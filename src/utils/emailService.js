/**
 * Serviço de Envio Automático de E-mail via SMTP com Relatório PDF Anexo
 * Norma TITS-502P - TK Elevator
 */

/**
 * Envia o relatório de manutenção por e-mail com o PDF em Base64 como anexo via SMTP (Nodemailer)
 * 
 * O pdfBase64 deve ser gerado pelo componente chamador (enquanto o elemento está visível no DOM)
 * e passado diretamente. pdfElement é ignorado se pdfBase64 já estiver preenchido.
 */
export async function sendReportEmail({
  toEmail,
  headerData,
  activeActivities,
  itemStates,
  pdfBase64 = null,   // Base64 já gerado pelo componente (preferido)
  pdfFilename = null, // Nome do arquivo PDF
  pdfElement = null,  // Elemento DOM (fallback, apenas se pdfBase64 for null)
  customSubject
}) {
  const clienteName = headerData.cliente || 'Equipamento';
  const clienteSafe = clienteName.replace(/[^a-zA-Z0-9]/g, '_');
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
  const resolvedFilename = pdfFilename || `Relatorio_TKE_${clienteSafe}_${nomeMes}.pdf`;

  const subject = customSubject || `[TKE] Relatório de Manutenção Preventiva - ${clienteName} - ${nomeMes}/${new Date().getFullYear()}`;

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

${naoConformesItens.length > 0 ? 'NÃO-CONFORMIDADES / OBSERVAÇÕES:\n' + naoConformesItens.join('\n') + '\n' : ''}
O arquivo oficial em formato PDF (${resolvedFilename}) foi gerado e está anexado a este e-mail.

TK Elevator Corporation — TITS-502P
  `.trim();

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

  // Se não foi passado pdfBase64 pronto mas foi passado pdfElement (fallback)
  if (!pdfBase64 && pdfElement) {
    try {
      const { generatePdfBase64 } = await import('./pdfGenerator');
      pdfBase64 = await generatePdfBase64(pdfElement, resolvedFilename);
    } catch (e) {
      console.warn('Aviso: Não foi possível gerar o PDF para o anexo:', e);
    }
  }

  if (pdfBase64 && typeof pdfBase64 === 'string' && pdfBase64.length > 500) {
    console.log(`📎 PDF validado e pronto para envio: ${resolvedFilename} (${(pdfBase64.length / 1024).toFixed(1)} KB base64)`);
  } else {
    throw new Error('O arquivo PDF do relatório não foi gerado. O envio foi cancelado para garantir que o anexo seja incluído no e-mail.');
  }

  // Disparo via Servidor SMTP (API Backend / Serverless)
  let apiUrl = import.meta.env.VITE_API_URL || '/api';
  if (apiUrl === 'http://localhost:3000/api' || apiUrl === 'http://localhost:3000') {
    apiUrl = '/api';
  }
  const endpoint = apiUrl.endsWith('/send-email')
    ? apiUrl
    : `${apiUrl.replace(/\/+$/, '')}/send-email`;

  try {
    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        toEmail: toEmail?.trim(),
        subject,
        text: plainText,
        pdfBase64,
        pdfFilename: resolvedFilename,
        data: formDataFields
      })
    });

    const apiData = await apiRes.json().catch(() => ({}));

    if (!apiRes.ok || !apiData.success) {
      throw new Error(apiData.error || `Erro ${apiRes.status} no servidor de e-mail.`);
    }

    return {
      success: true,
      method: 'smtp',
      message: apiData.message || `E-mail com relatório PDF enviado com sucesso para ${toEmail}!`
    };
  } catch (err) {
    console.error('Falha no envio via SMTP:', err);
    if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
      throw new Error('Falha de conexão com a API de envio (Failed to fetch). Verifique se o Vite dev server está em execução.');
    }
    throw err;
  }
}
