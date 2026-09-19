/**
 * Utilitário Oficial de Geração de PDF e Anexo para E-mail
 * TK Elevator (TKE) - Norma TITS-502P
 *
 * Utiliza html2canvas e jsPDF diretamente para garantir renderização perfeita,
 * suporte a múltiplas páginas e exportação confiável em Base64 Data URI e Blob.
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Converte um elemento do DOM em um documento jsPDF
 * @param {HTMLElement} element 
 * @param {string} filename 
 * @returns {Promise<jsPDF>}
 */
async function buildJsPdfFromElement(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) {
    throw new Error('Elemento DOM não fornecido para geração do PDF.');
  }

  // Função auxiliar para converter cores oklch() para hex via Canvas 2D API
  const convertOklchToHex = (oklchStr) => {
    try {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 1;
      tempCanvas.height = 1;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.fillStyle = '#000000';
        tempCtx.fillStyle = oklchStr;
        return tempCtx.fillStyle;
      }
    } catch (_) {}
    return '#6b7280';
  };

  // Regex para encontrar oklch(...) em CSS (incluindo com / alpha)
  const oklchRegex = /oklch\([^)]*\)/gi;

  // Substitui todas as ocorrências de oklch() em uma string CSS
  const sanitizeCssText = (cssText) => {
    return cssText.replace(oklchRegex, (match) => convertOklchToHex(match));
  };

  // Captura o elemento com html2canvas em alta resolução (scale 2)
  console.log('[TKE-PDF] html2canvas: iniciando captura do elemento...');
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scrollY: 0,
    scrollX: 0,
    logging: false,
    imageTimeout: 15000,
    ignoreElements: (el) => {
      return el.classList?.contains('no-print') || el.tagName === 'NOSCRIPT';
    },
    onclone: (clonedDoc, clonedElement) => {
      // Garante largura consistente e fundo branco
      clonedElement.style.maxWidth = '210mm';
      clonedElement.style.width = '210mm';
      clonedElement.style.boxShadow = 'none';
      clonedElement.style.margin = '0 auto';
      clonedElement.style.backgroundColor = '#ffffff';

      // ===== CRÍTICO: Sanitizar TODAS as stylesheets do DOM clonado =====
      // html2canvas faz parse interno das CSS rules e crasha em oklch()
      const styleSheets = clonedDoc.querySelectorAll('style');
      let sanitizedCount = 0;
      styleSheets.forEach((styleEl) => {
        try {
          const originalCss = styleEl.textContent || '';
          if (originalCss.includes('oklch')) {
            styleEl.textContent = sanitizeCssText(originalCss);
            sanitizedCount++;
          }
        } catch (_) {}
      });

      // Sanitizar <link> stylesheets convertendo-as em <style> inline
      const linkSheets = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
      linkSheets.forEach((linkEl) => {
        try {
          // Tenta acessar as regras CSS do link
          const sheets = Array.from(clonedDoc.styleSheets);
          const matchSheet = sheets.find(s => s.ownerNode === linkEl);
          if (matchSheet) {
            let cssText = '';
            try {
              Array.from(matchSheet.cssRules).forEach(rule => {
                cssText += rule.cssText + '\n';
              });
            } catch (_) { return; }
            if (cssText.includes('oklch')) {
              const newStyle = clonedDoc.createElement('style');
              newStyle.textContent = sanitizeCssText(cssText);
              linkEl.replaceWith(newStyle);
              sanitizedCount++;
            }
          }
        } catch (_) {}
      });

      // Sanitizar estilos inline dos elementos
      const allElements = clonedDoc.querySelectorAll('*');
      allElements.forEach((el) => {
        try {
          const inlineStyle = el.getAttribute('style') || '';
          if (inlineStyle.includes('oklch')) {
            el.setAttribute('style', sanitizeCssText(inlineStyle));
          }
        } catch (_) {}
      });

      console.log(`[TKE-PDF] onclone: ${sanitizedCount} stylesheets sanitizadas, ${allElements.length} elementos processados`);
    }
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Metadados do documento
  pdf.setDocumentProperties({
    title: filename.replace('.pdf', ''),
    subject: 'Relatório Fotográfico de Manutenção Preventiva TITS-502P',
    author: 'TK Elevator (TKE)',
    creator: 'Sistema de Relatórios O.S. TKE'
  });

  const marginMm = 6;
  const pdfPageWidthMm = 210;
  const pdfPageHeightMm = 297;
  const contentWidthMm = pdfPageWidthMm - (marginMm * 2); // 198 mm
  const contentHeightMm = pdfPageHeightMm - (marginMm * 2); // 285 mm

  // Altura total do documento em mm calculada a partir da proporção do canvas
  const totalDocHeightMm = (canvas.height * contentWidthMm) / canvas.width;

  // Se cabe em uma única página A4
  if (totalDocHeightMm <= contentHeightMm) {
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', marginMm, marginMm, contentWidthMm, totalDocHeightMm, undefined, 'FAST');
    return pdf;
  }

  // Para documentos longos (múltiplas páginas), fatia o canvas com precisão
  const sliceHeightPx = Math.floor((canvas.width * contentHeightMm) / contentWidthMm);
  let positionPx = 0;
  let pageIndex = 0;

  while (positionPx < canvas.height) {
    const currentSliceHeightPx = Math.min(sliceHeightPx, canvas.height - positionPx);
    
    // Canvas temporário para a página atual
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = currentSliceHeightPx;
    const ctx = pageCanvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, positionPx, canvas.width, currentSliceHeightPx,
        0, 0, canvas.width, currentSliceHeightPx
      );
    }

    const sliceImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
    const sliceHeightMm = (currentSliceHeightPx * contentWidthMm) / canvas.width;

    if (pageIndex > 0) {
      pdf.addPage();
    }

    pdf.addImage(sliceImgData, 'JPEG', marginMm, marginMm, contentWidthMm, sliceHeightMm, undefined, 'FAST');

    positionPx += sliceHeightPx;
    pageIndex++;
  }

  return pdf;
}

/**
 * Gera os dados Base64 do PDF (Data URI) para anexo em e-mail
 * @param {HTMLElement} element 
 * @param {string} filename 
 * @returns {Promise<string|null>}
 */
export async function generatePdfBase64(element, filename = 'Relatorio_TKE.pdf') {
  try {
    const pdf = await buildJsPdfFromElement(element, filename);
    const dataUri = pdf.output('datauristring', { filename });
    
    if (dataUri && typeof dataUri === 'string' && dataUri.length > 500) {
      console.log(`📎 PDF Base64 gerado com sucesso: ${filename} (${(dataUri.length / 1024).toFixed(1)} KB)`);
      return dataUri;
    }
    
    console.error('Base64 gerado é inválido ou vazio.');
    return null;
  } catch (err) {
    console.error('Erro na geração do PDF Base64:', err);
    return null;
  }
}

/**
 * Gera um objeto Blob do PDF
 * @param {HTMLElement} element 
 * @param {string} filename 
 * @returns {Promise<Blob|null>}
 */
export async function generatePdfBlob(element, filename = 'Relatorio_TKE.pdf') {
  try {
    const pdf = await buildJsPdfFromElement(element, filename);
    const blob = pdf.output('blob', { filename });
    return blob;
  } catch (err) {
    console.error('Erro ao gerar Blob do PDF:', err);
    return null;
  }
}

/**
 * Realiza o download direto do PDF para a máquina do usuário
 * @param {HTMLElement} element 
 * @param {string} filename 
 */
export async function downloadReportPdf(element, filename = 'Relatorio_TKE.pdf') {
  try {
    const pdf = await buildJsPdfFromElement(element, filename);
    pdf.save(filename);
  } catch (err) {
    console.warn('Falha no download via jsPDF, utilizando fallback nativo:', err);
    window.print();
  }
}
