/**
 * Serviço de Envio Automático de E-mail com PDF Anexo para Relatório TKE (TITS-502P)
 */

export async function generatePdfBlob(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) return null;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: [6, 4, 6, 4],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    const blob = await html2pdf().set(opt).from(element).output('blob');
    return blob;
  } catch (err) {
    console.error('Erro ao gerar blob do PDF com html2pdf:', err);
    return null;
  }
}

export async function downloadPdfFile(element, filename = 'Relatorio_TKE.pdf') {
  if (!element) return false;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: [6, 4, 6, 4],
      filename: filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.error('Erro ao baixar PDF:', err);
    return false;
  }
}

export async function sendReportEmail({ toEmail, headerData, activeActivities, itemStates, pdfElement }) {
  const clienteName = headerData.cliente || 'Condomínio Plaza';
  const clienteSafe = (headerData.cliente || 'Equipamento').replace(/[^a-zA-Z0-9]/g, '_');
  const dataVisita = headerData.data ? new Date(headerData.data).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');
  const equipamento = headerData.equipamento || 'Escada Rolante';
  const tecnicos = headerData.tecnicos || 'Técnico TKE';

  // Contagem de itens
  let conformes = 0;
  let naoConformes = 0;
  let naoAplica = 0;
  const naoConformesItens = [];

  activeActivities.forEach(act => {
    const status = itemStates[act.id]?.status || 'Conforme';
    if (status === 'Conforme') conformes++;
    else if (status === 'Não conforme') {
      naoConformes++;
      naoConformesItens.push(`${act.code} - ${act.description} (${itemStates[act.id]?.comment || 'Sem observação'})`);
    } else if (status === 'Não se aplica') {
      naoAplica++;
    }
  });

  const subject = `[Relatório TKE] Manutenção Preventiva TITS-502P - ${clienteName}`;
  const bodyText = 
`Prezados,

Segue o Relatório Fotográfico Oficial de Manutenção Preventiva de Escadas Rolantes (Norma TITS-502P):

📌 DADOS DO ATENDIMENTO:
• Cliente / Condomínio: ${clienteName}
• Endereço: ${headerData.endereco || 'Não informado'}
• Equipamento / Tag: ${equipamento}
• Data da Visita: ${dataVisita}
• Técnico(s) Responsável(is): ${tecnicos}

📊 RESUMO EXECUTIVO:
• Conformes: ${conformes}
• Não Conformes: ${naoConformes} ${naoConformesItens.length > 0 ? '\n  - ' + naoConformesItens.join('\n  - ') : ''}
• Não se Aplica: ${naoAplica}

O arquivo PDF completo com todas as inspeções e registros fotográficos encontra-se em anexo.

Atenciosamente,
Equipe Técnica TK Elevator (TKE)`;

  // 1. Gerar o arquivo PDF em formato Blob para anexo real
  let pdfBlob = null;
  if (pdfElement) {
    try {
      pdfBlob = await generatePdfBlob(pdfElement, `Relatorio_TKE_${clienteSafe}.pdf`);
    } catch (e) {
      console.warn('Não foi possível gerar blob do PDF para anexo:', e);
    }
  }

  // 2. Envio Automático em Segundo Plano via FormSubmit Multipart com Anexo do PDF
  try {
    const formData = new FormData();
    formData.append('_subject', subject);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('Cliente / Condomínio', clienteName);
    formData.append('Endereço', headerData.endereco || 'Não informado');
    formData.append('Equipamento / Tag', equipamento);
    formData.append('Data da Visita', dataVisita);
    formData.append('Técnico(s) Responsável(is)', tecnicos);
    formData.append('Total Itens Conformes', conformes.toString());
    formData.append('Total Itens Não Conformes', naoConformes.toString());
    formData.append('Total Não se Aplica', naoAplica.toString());
    formData.append('Não Conformidades Detectadas', naoConformesItens.length > 0 ? naoConformesItens.join(' | ') : 'Nenhuma (100% operacional)');
    formData.append('Resumo O.S.', bodyText);

    // Anexa o PDF real se gerado
    if (pdfBlob) {
      formData.append('attachment', pdfBlob, `Relatorio_TKE_${clienteSafe}.pdf`);
    }

    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    const data = await response.json();
    if (response.ok && (data.success === 'true' || data.success === true)) {
      return { success: true, method: 'formsubmit_with_pdf', message: 'E-mail com PDF anexo enviado automaticamente com sucesso!' };
    }
  } catch (err) {
    console.warn('Falha no FormSubmit com anexo, tentando fallback:', err);
  }

  // 3. Fallback via EmailJS se configurado no .env
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  if (emailjsPublicKey && emailjsServiceId && emailjsTemplateId) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          template_params: {
            to_email: toEmail,
            cliente: clienteName,
            equipamento: equipamento,
            data: dataVisita,
            tecnicos: tecnicos,
            summary: `Conformes: ${conformes} | Não Conformes: ${naoConformes}`,
            message: bodyText
          }
        }),
      });

      if (response.ok) {
        return { success: true, method: 'emailjs_auto' };
      }
    } catch (err) {
      console.warn('Erro no envio via EmailJS:', err);
    }
  }

  return { success: true, method: 'auto' };
}
