/**
 * Utilitário de Geração e Download Direto de Arquivo PDF (.pdf)
 * Utiliza html2pdf.js com clonagem isolada no viewport
 */

/**
 * Gera os dados Base64 do PDF (Data URI) para envio como anexo de e-mail
 */
export async function generatePdfBase64(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) {
    console.error('Elemento não fornecido para generatePdfBase64');
    return null;
  }

  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default || html2pdfModule;

  const opt = {
    margin: [8, 6, 8, 6],
    filename: filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 1.75,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      scrollY: 0,
      scrollX: 0,
      logging: false
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  // Método 1: Tentar diretamente no elemento fornecido
  try {
    const worker = html2pdf().set(opt).from(element);
    const dataUri = await worker.output('datauristring');
    if (dataUri && typeof dataUri === 'string' && dataUri.startsWith('data:application/pdf') && dataUri.length > 500) {
      console.log(`📎 PDF Base64 gerado com sucesso (Método Direto): ${(dataUri.length / 1024).toFixed(1)} KB`);
      return dataUri;
    }
  } catch (err1) {
    console.warn('Método 1 falhou, tentando Método 2 (Blob):', err1);
  }

  // Método 2: Output blob no elemento direto
  try {
    const blob = await html2pdf().set(opt).from(element).outputPdf('blob');
    if (blob && blob.size > 200) {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      if (base64 && typeof base64 === 'string' && base64.length > 500) {
        console.log(`📎 PDF Base64 gerado com sucesso (Método Blob): ${(base64.length / 1024).toFixed(1)} KB`);
        return base64;
      }
    }
  } catch (err2) {
    console.warn('Método 2 falhou, tentando Método 3 (Clone Isolado):', err2);
  }

  // Método 3: Clone isolado no DOM
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '794px';
  container.style.opacity = '0.01';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-9999';
  container.style.overflow = 'visible';

  const clone = element.cloneNode(true);
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0';
  clone.style.padding = '24px';
  clone.style.borderRadius = '0';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const cloneOpt = {
      ...opt,
      html2canvas: {
        ...opt.html2canvas,
        windowWidth: 800
      }
    };
    const dataUri = await html2pdf().set(cloneOpt).from(clone).outputPdf('datauristring');
    if (dataUri && typeof dataUri === 'string' && dataUri.length > 500) {
      console.log(`📎 PDF Base64 gerado com sucesso (Método Clone): ${(dataUri.length / 1024).toFixed(1)} KB`);
      return dataUri;
    }

    const fallbackBlob = await html2pdf().set(cloneOpt).from(clone).outputPdf('blob');
    if (fallbackBlob && fallbackBlob.size > 200) {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(fallbackBlob);
      });
      console.log(`📎 PDF Base64 gerado com sucesso (Método Clone Blob): ${(base64.length / 1024).toFixed(1)} KB`);
      return base64;
    }
  } catch (err3) {
    console.error('Erro em todos os métodos de geração do Base64 do PDF:', err3);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }

  return null;
}

/**
 * Gera um objeto Blob do PDF
 */
export async function generatePdfBlob(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) return null;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '794px';
  container.style.opacity = '0.01';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-9999';
  container.style.overflow = 'visible';

  const clone = element.cloneNode(true);
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0';
  clone.style.padding = '24px';
  clone.style.borderRadius = '0';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

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
        windowWidth: 800,
        logging: false
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    const blob = await html2pdf().set(opt).from(clone).outputPdf('blob');
    return blob;
  } catch (err) {
    console.error('Erro ao gerar Blob do PDF:', err);
    return null;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Realiza o download direto do PDF para a máquina do usuário
 */
export async function downloadReportPdf(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) {
    window.print();
    return;
  }

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '794px';
  container.style.opacity = '0.01';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-9999';
  container.style.overflow = 'visible';

  const clone = element.cloneNode(true);
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0';
  clone.style.padding = '24px';
  clone.style.borderRadius = '0';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

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
        windowWidth: 800,
        logging: false
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
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
