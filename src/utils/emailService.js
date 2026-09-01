/**
 * Serviço de Envio Automático de E-mail com PDF Anexo - Relatório TKE (TITS-502P)
 */

export async function sendReportEmail({ toEmail, headerData, activeActivities, itemStates, pdfElement }) {
  const clienteName = headerData.cliente || 'Condomínio Plaza';
  const clienteSafe = (headerData.cliente || 'Equipamento').replace(/[^a-zA-Z0-9]/g, '_');
  const dataVisita = headerData.data
    ? new Date(headerData.data).toLocaleDateString('pt-BR')
    : new Date().toLocaleDateString('pt-BR');
  const equipamento = headerData.equipamento || 'Escada Rolante';
  const tecnicos = headerData.tecnicos || 'Técnico TKE';
  const mesRef = headerData.mesRef || 1;

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
      naoConformesItens.push(
        `• ${act.code} - ${act.description}${itemStates[act.id]?.comment ? ' [Obs: ' + itemStates[act.id].comment + ']' : ''}`
      );
    } else if (status === 'Não se aplica') {
      naoAplica++;
    }
  });

  const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const nomeMes = MESES[(mesRef - 1)] || 'Janeiro';
  const pdfFilename = `Relatorio_TKE_${clienteSafe}.pdf`;

  const subject = `[TKE] Relatório de Manutenção Preventiva - ${clienteName} - ${nomeMes}/${new Date().getFullYear()}`;

  const plainText = `
[TKE] Relatório de Manutenção Preventiva
Norma TITS-502P - ${nomeMes}/${new Date().getFullYear()}

DADOS DO ATENDIMENTO:
Cliente / Condomínio: ${clienteName}
Endereço: ${headerData.endereco || 'Não informado'}
Equipamento (Tag / Série): ${equipamento}
Data da Visita: ${dataVisita}
Técnico(s) Responsável(is): ${tecnicos}

RESUMO EXECUTIVO:
• Conformes: ${conformes}
• Não Conformes: ${naoConformes}
• Não se Aplica: ${naoAplica}

${naoConformesItens.length > 0 ? 'NÃO-CONFORMIDADES DETECTADAS:\n' + naoConformesItens.join('\n') + '\n' : ''}
O arquivo PDF completo com todas as inspeções e fotos encontra-se em anexo nesta mensagem.

TK Elevator Corporation — TITS-502P
  `.trim();

  // 1. Gerar o arquivo PDF real em formato Blob
  let pdfBlob = null;
  if (pdfElement) {
    try {
      const { generatePdfBlob } = await import('./pdfGenerator');
      pdfBlob = await generatePdfBlob(pdfElement, pdfFilename);
    } catch (e) {
      console.warn('Aviso: Não foi possível gerar blob do PDF para anexo:', e);
    }
  }

  // =========================================================
  // 1. FORMSUBMIT com Arquivo PDF Anexo (multipart/form-data)
  // =========================================================
  try {
    const formData = new FormData();
    formData.append('_subject', subject);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('_replyto', 'noreply@tkelevator.com');
    formData.append('Nome do Relatório', `Manutenção Preventiva TKE - ${clienteName}`);
    formData.append('Mês de Referência', nomeMes);
    formData.append('Cliente / Condomínio', clienteName);
    formData.append('Endereço', headerData.endereco || 'Não informado');
    formData.append('Equipamento (Tag / Série)', equipamento);
    formData.append('Data da Visita', dataVisita);
    formData.append('Técnico(s) Responsável(is)', tecnicos);
    formData.append('Total - Conformes', String(conformes));
    formData.append('Total - Não Conformes', String(naoConformes));
    formData.append('Total - Não se Aplica', String(naoAplica));
    formData.append('Não-Conformidades', naoConformesItens.length > 0
      ? naoConformesItens.join(' | ')
      : 'Nenhuma detectada (equipamento 100% operacional)');
    formData.append('Resumo O.S.', plainText);

    // Anexa o PDF real gerado
    if (pdfBlob) {
      const pdfFile = new File([pdfBlob], pdfFilename, { type: 'application/pdf' });
      formData.append('attachment', pdfFile, pdfFilename);
    }

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.success === 'true' || data.success === true)) {
      return { success: true, method: 'formsubmit_with_pdf', message: 'E-mail com relatório PDF em anexo enviado com sucesso!' };
    }
    console.warn('FormSubmit com anexo retornou:', data);
  } catch (err) {
    console.warn('Falha no FormSubmit:', err);
  }

  // =========================================================
  // 2. EMAILJS como método secundário (se .env configurado)
  // =========================================================
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  if (emailjsPublicKey && emailjsServiceId && emailjsTemplateId) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsPublicKey,
          template_params: {
            to_email: toEmail,
            subject,
            cliente: clienteName,
            equipamento,
            data_visita: dataVisita,
            tecnicos,
            mes_referencia: nomeMes,
            conformes: String(conformes),
            nao_conformes: String(naoConformes),
            nao_aplica: String(naoAplica),
            nao_conformidades: naoConformesItens.length > 0
              ? naoConformesItens.join('\n')
              : 'Nenhuma — equipamento 100% operacional',
            message: plainText,
          },
        }),
      });
      if (res.ok) {
        return { success: true, method: 'emailjs', message: 'E-mail enviado via EmailJS!' };
      }
    } catch (err) {
      console.warn('Falha no EmailJS:', err);
    }
  }

  // =========================================================
  // 3. Fallback: abre cliente de email do usuário via mailto
  // =========================================================
  const mailtoLink = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;
  window.open(mailtoLink, '_blank');
  return { success: true, method: 'mailto', message: 'Abrindo cliente de e-mail.' };
}
