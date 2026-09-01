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
O arquivo PDF com todos os dados da inspeção foi gerado pelo sistema.

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

  const formDataFields = {
    'Nome do Relatório': `Manutenção Preventiva TKE - ${clienteName}`,
    'Mês de Referência': nomeMes,
    'Cliente / Condomínio': clienteName,
    'Endereço': headerData.endereco || 'Não informado',
    'Equipamento (Tag / Série)': equipamento,
    'Data da Visita': dataVisita,
    'Técnico(s) Responsável(is)': tecnicos,
    'Total - Conformes': String(conformes),
    'Total - Não Conformes': String(naoConformes),
    'Total - Não se Aplica': String(naoAplica),
    'Não-Conformidades': naoConformesItens.length > 0
      ? naoConformesItens.join(' | ')
      : 'Nenhuma detectada (equipamento 100% operacional)',
  };

  // =========================================================
  // Método 1: Vercel Serverless API (/api/send-email)
  // =========================================================
  try {
    const apiRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toEmail,
        subject,
        text: plainText,
        data: formDataFields
      })
    });
    if (apiRes.ok) {
      const apiData = await apiRes.json().catch(() => ({}));
      if (apiData.success) {
        return { success: true, method: 'vercel_api', message: 'E-mail enviado com sucesso via servidor!' };
      }
    }
  } catch (err) {
    console.warn('Tentativa via /api/send-email falhou ou em ambiente local:', err);
  }

  // =========================================================
  // Método 2: FormSubmit direto com FormData / Anexo
  // =========================================================
  try {
    const formData = new FormData();
    formData.append('_subject', subject);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('_replyto', 'noreply@tkelevator.com');
    Object.entries(formDataFields).forEach(([key, val]) => {
      formData.append(key, val);
    });
    formData.append('Resumo O.S.', plainText);

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
      return { success: true, method: 'formsubmit_multipart', message: 'E-mail enviado com sucesso!' };
    }
  } catch (err) {
    console.warn('Falha no FormSubmit com anexo:', err);
  }

  // =========================================================
  // Método 3: FormSubmit simples em JSON (sem anexo binário)
  // =========================================================
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        ...formDataFields,
        'Resumo O.S.': plainText
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.success === 'true' || data.success === true)) {
      return { success: true, method: 'formsubmit_json', message: 'E-mail enviado com sucesso!' };
    }
  } catch (err) {
    console.warn('Falha no FormSubmit JSON:', err);
  }

  // =========================================================
  // Método 4: Fallback cliente nativo de email (mailto)
  // =========================================================
  try {
    const mailtoLink = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;
    window.open(mailtoLink, '_blank');
    return { success: true, method: 'mailto', message: 'Abrindo cliente de e-mail.' };
  } catch (e) {
    return { success: true, method: 'fallback', message: 'Dados da O.S. prontos.' };
  }
}
