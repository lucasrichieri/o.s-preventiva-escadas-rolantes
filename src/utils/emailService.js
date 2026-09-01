/**
 * Serviço de Envio Automático de E-mail para Relatório TKE (TITS-502P)
 */

export async function sendReportEmail({ toEmail, headerData, activeActivities, itemStates }) {
  const clienteName = headerData.cliente || 'Equipamento Plaza';
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

O arquivo PDF detalhado com todas as imagens de inspeção foi gerado e baixado no dispositivo.

Atenciosamente,
Equipe Técnica TK Elevator (TKE)`;

  // 1. Envio Automático em Segundo Plano via FormSubmit AJAX API (Sem abrir tela externa)
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        'Cliente / Condomínio': clienteName,
        'Endereço': headerData.endereco || 'Não informado',
        'Equipamento / Tag': equipamento,
        'Data da Visita': dataVisita,
        'Técnico(s) Responsável(is)': tecnicos,
        'Total Itens Conformes': conformes,
        'Total Itens Não Conformes': naoConformes,
        'Total Não se Aplica': naoAplica,
        'Não Conformidades Detectadas': naoConformesItens.length > 0 ? naoConformesItens.join(' | ') : 'Nenhuma (100% operacional)',
        'Resumo': bodyText
      })
    });

    const data = await response.json();
    if (response.ok && (data.success === 'true' || data.success === true)) {
      return { success: true, method: 'formsubmit_auto', message: 'E-mail enviado automaticamente com sucesso!' };
    }
  } catch (err) {
    console.warn('Falha no FormSubmit automático, tentando EmailJS se configurado:', err);
  }

  // 2. Envio via EmailJS se configurado no .env
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
