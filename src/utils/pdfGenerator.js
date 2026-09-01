/**
 * Utilitário de Geração e Download Direto de Arquivo PDF (.pdf)
 * Utiliza html2pdf.js com clonagem de elemento isolado fora de restrições de scroll
 */

export async function generatePdfBlob(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) return null;

  // Criar clone isolado no DOM com dimensões A4 padronizadas
  const clone = element.cloneNode(true);
  clone.style.width = '794px'; // 210mm a 96 DPI
  clone.style.maxWidth = '794px';
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '-99999px';
  clone.style.zIndex = '-9999';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0';
  clone.style.padding = '24px';
  clone.style.borderRadius = '0';
  document.body.appendChild(clone);

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: [8, 6, 8, 6],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0,
        windowWidth: 800
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    const blob = await html2pdf().set(opt).from(clone).output('blob');
    return blob;
  } catch (err) {
    console.error('Erro ao gerar Blob do PDF:', err);
    return null;
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}

export async function downloadReportPdf(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) {
    window.print();
    return;
  }

  // 1. Criar clone isolado fora do modal para evitar problemas de scroll/transform
  const clone = element.cloneNode(true);
  clone.style.width = '794px'; // 210mm a 96 DPI
  clone.style.maxWidth = '794px';
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '-99999px';
  clone.style.zIndex = '-9999';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0';
  clone.style.padding = '24px';
  clone.style.borderRadius = '0';
  document.body.appendChild(clone);

  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: [8, 6, 8, 6],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        scrollY: 0,
        scrollX: 0,
        windowWidth: 800
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().set(opt).from(clone).save();
  } catch (err) {
    console.warn('Falha no html2pdf direto, abrindo diálogo nativo de PDF:', err);
    window.print();
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
