/**
 * Serviço de Envio de E-mail para Relatório TKE (TITS-502P)
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

  activeActivities.forEach(act => {
    const status = itemStates[act.id]?.status || 'Conforme';
    if (status === 'Conforme') conformes++;
    else if (status === 'Não conforme') naoConformes++;
    else if (status === 'Não se aplica') naoAplica++;
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
• Não Conformes: ${naoConformes}
• Não se Aplica: ${naoAplica}

O arquivo PDF detalhado contendo a tabela completa de inspeção e as fotos de campo foi gerado e baixado no dispositivo.

Atenciosamente,
Equipe Técnica TK Elevator (TKE)`;

  // Tenta enviar via EmailJS se as chaves estiverem configuradas no .env
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
        return { success: true, method: 'emailjs' };
      }
    } catch (err) {
      console.warn('Erro no envio via EmailJS API, acionando fallback Gmail Web:', err);
    }
  }

  // Fallback 1: Abrir Gmail Web Compose diretamente com todos os campos preenchidos
  const encodedTo = encodeURIComponent(toEmail);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyText);

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  
  // Abre em nova aba o Gmail Web já pronto para o usuário clicar em "Enviar"
  window.open(gmailWebUrl, '_blank');

  return { success: true, method: 'gmail_web' };
}
