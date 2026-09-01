/**
 * Serviço de Envio Automático de E-mail - Relatório TKE (TITS-502P)
 * Usa EmailJS (API REST) + FormSubmit como fallback
 */

export async function sendReportEmail({ toEmail, headerData, activeActivities, itemStates }) {
  const clienteName = headerData.cliente || 'Condomínio Plaza';
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

  const subject = `[TKE] Relatório de Manutenção Preventiva - ${clienteName} - ${nomeMes}/${new Date().getFullYear()}`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;color:#1e293b;padding:0;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
    <!-- Header TKE -->
    <tr>
      <td style="background:linear-gradient(135deg,#4c1d95,#be123c,#ea580c);padding:20px 28px;">
        <h1 style="color:#fff;margin:0;font-size:18px;font-weight:900;letter-spacing:-0.5px;">TK<span style="color:#fbbf24;">E</span> &nbsp;|&nbsp; Relatório de Manutenção Preventiva</h1>
        <p style="color:#e9d5ff;margin:4px 0 0;font-size:12px;">Norma TITS-502P &mdash; ${nomeMes} de ${new Date().getFullYear()}</p>
      </td>
    </tr>
    <!-- Dados do Atendimento -->
    <tr>
      <td style="padding:24px 28px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:8px;padding:16px;border:1px solid #e2e8f0;">
          <tr><td colspan="2" style="padding-bottom:10px;"><strong style="color:#7c3aed;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Dados do Atendimento</strong></td></tr>
          <tr>
            <td style="padding:4px 12px 4px 0;width:50%;vertical-align:top;">
              <div style="font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;margin-bottom:2px;">Cliente / Condomínio</div>
              <div style="font-size:13px;font-weight:700;color:#0f172a;">${clienteName}</div>
            </td>
            <td style="padding:4px 0;width:50%;vertical-align:top;">
              <div style="font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;margin-bottom:2px;">Local / Endereço</div>
              <div style="font-size:13px;color:#334155;">${headerData.endereco || 'Não informado'}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 12px 4px 0;vertical-align:top;">
              <div style="font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;margin-bottom:2px;">Equipamento (Tag / Série)</div>
              <div style="font-size:13px;font-weight:700;font-family:monospace;color:#0f172a;">${equipamento}</div>
            </td>
            <td style="padding:8px 0 4px;vertical-align:top;">
              <div style="font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;margin-bottom:2px;">Técnico(s) Responsável(is)</div>
              <div style="font-size:13px;color:#334155;">${tecnicos}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 12px 0 0;vertical-align:top;">
              <div style="font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;margin-bottom:2px;">Data da Visita</div>
              <div style="font-size:13px;font-weight:700;color:#0f172a;">${dataVisita}</div>
            </td>
            <td style="padding:8px 0 0;vertical-align:top;">
              <div style="font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;margin-bottom:2px;">Escopo da Manutenção</div>
              <div style="font-size:13px;color:#334155;">Preventiva Periódica Unificada (${nomeMes})</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Resumo Executivo -->
    <tr>
      <td style="padding:16px 28px 8px;">
        <strong style="color:#7c3aed;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Resumo Executivo</strong>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
          <tr>
            <td width="33%" style="text-align:center;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:12px 8px;">
              <div style="font-size:28px;font-weight:900;color:#047857;">${conformes}</div>
              <div style="font-size:10px;font-weight:700;color:#065f46;text-transform:uppercase;">Conformes</div>
            </td>
            <td width="4%"></td>
            <td width="33%" style="text-align:center;background:${naoConformes > 0 ? '#fee2e2' : '#f8fafc'};border:1px solid ${naoConformes > 0 ? '#fca5a5' : '#e2e8f0'};border-radius:8px;padding:12px 8px;">
              <div style="font-size:28px;font-weight:900;color:#dc2626;">${naoConformes}</div>
              <div style="font-size:10px;font-weight:700;color:#991b1b;text-transform:uppercase;">Não Conformes</div>
            </td>
            <td width="4%"></td>
            <td width="33%" style="text-align:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 8px;">
              <div style="font-size:28px;font-weight:900;color:#64748b;">${naoAplica}</div>
              <div style="font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;">Não se Aplica</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${naoConformesItens.length > 0 ? `
    <!-- Não Conformidades -->
    <tr>
      <td style="padding:8px 28px 16px;">
        <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:14px;">
          <strong style="color:#991b1b;font-size:10px;text-transform:uppercase;letter-spacing:1px;">⚠️ Não-Conformidades Detectadas (${naoConformes})</strong>
          <div style="margin-top:8px;font-size:12px;color:#7f1d1d;line-height:1.6;">
            ${naoConformesItens.join('<br/>')}
          </div>
        </div>
      </td>
    </tr>` : ''}
    <!-- Aviso -->
    <tr>
      <td style="padding:8px 28px 16px;">
        <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:12px 14px;border-radius:0 8px 8px 0;">
          <strong style="display:block;color:#78350f;font-size:10px;text-transform:uppercase;margin-bottom:4px;">⚠️ Alerta Obrigatório de Segurança (TITS-502P)</strong>
          <p style="margin:0;font-size:11px;color:#92400e;line-height:1.5;">Desligar a escada/esteira rolante e notificar o condomínio e supervisor se ocorrer: (1) deficiência na alimentação elétrica; (2) micro da série de segurança danificado/ponteado; (3) água no poço.</p>
        </div>
      </td>
    </tr>
    <!-- Info PDF -->
    <tr>
      <td style="padding:0 28px 20px;">
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:12px 14px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#0369a1;">📄 O relatório fotográfico completo (PDF) foi gerado e está disponível para download no sistema web.</p>
        </div>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#1e1b4b;padding:16px 28px;text-align:center;">
        <p style="color:#a5b4fc;font-size:11px;margin:0;">TK Elevator Corporation &mdash; TITS-502P Manutenção Preventiva de Escadas e Esteiras Rolantes</p>
        <p style="color:#6d71ad;font-size:10px;margin:4px 0 0;">Este é um e-mail automático gerado pelo Sistema de Relatórios Fotográficos TKE.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
O relatório fotográfico completo (PDF) está disponível para download no sistema web.

TK Elevator Corporation — TITS-502P
  `.trim();

  // =========================================================
  // 1. FORMSUBMIT via JSON (método mais simples sem anexo)
  // =========================================================
  try {
    const payload = {
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      _replyto: 'noreply@tkelevator.com',
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

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.success === 'true' || data.success === true)) {
      return { success: true, method: 'formsubmit', message: 'E-mail enviado com sucesso!' };
    }
    console.warn('FormSubmit retornou falha:', data);
  } catch (err) {
    console.warn('Falha no FormSubmit:', err);
  }

  // =========================================================
  // 2. EMAILJS como segundo método (se .env configurado)
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
  return { success: true, method: 'mailto', message: 'Abrindo cliente de e-mail para envio.' };
}
