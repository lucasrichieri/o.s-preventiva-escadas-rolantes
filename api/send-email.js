/**
 * API Serverless / Backend: /api/send-email
 * Processa o envio de e-mail real via SMTP (Nodemailer) com anexo do relatório PDF gerado pelo sistema
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente locais (se houver)
dotenv.config();

function cleanEnvValue(val) {
  if (!val) return '';
  let s = String(val).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    } else if (Buffer.isBuffer(body)) {
      try {
        body = JSON.parse(body.toString('utf-8'));
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const {
      toEmail,
      subject,
      text,
      pdfBase64,
      pdfFilename = 'Relatorio_TKE_Manutencao_Preventiva.pdf',
      data = {}
    } = body;

    // Sanitização e resolução de credenciais SMTP
    const smtpHost = cleanEnvValue(process.env.SMTP_HOST) || 'smtp.gmail.com';
    const smtpPort = parseInt(cleanEnvValue(process.env.SMTP_PORT) || '465', 10);
    const smtpSecure = cleanEnvValue(process.env.SMTP_SECURE) === 'true' || smtpPort === 465;
    const smtpUser = cleanEnvValue(process.env.SMTP_USER);
    // Senha de aplicativo do Gmail não deve conter espaços
    const smtpPass = cleanEnvValue(process.env.SMTP_PASS).replace(/\s+/g, '');
    const defaultTo = cleanEnvValue(process.env.SMTP_TO_DEFAULT);
    const smtpFrom = cleanEnvValue(process.env.SMTP_FROM) || (smtpUser ? `TK Elevator <${smtpUser}>` : 'TK Elevator <noreply@tkelevator.com>');

    const targetEmail = (toEmail && String(toEmail).trim()) || defaultTo;

    if (!targetEmail) {
      return res.status(400).json({
        success: false,
        error: 'E-mail de destino não informado e SMTP_TO_DEFAULT não configurado.'
      });
    }

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        success: false,
        error: 'Servidor SMTP não configurado. Por favor, defina SMTP_USER e SMTP_PASS nas variáveis de ambiente do sistema.'
      });
    }

    // Configurar transporte SMTP
    const isGmail = smtpHost.includes('gmail.com') || smtpUser.endsWith('@gmail.com');
    const transportOptions = isGmail
      ? {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          pool: false,
          maxConnections: 1,
          tls: {
            rejectUnauthorized: false
          }
        }
      : {
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        };

    const transporter = nodemailer.createTransport(transportOptions);

    // Preparar anexo do PDF se fornecido em Base64
    const attachments = [];
    if (pdfBase64 && typeof pdfBase64 === 'string') {
      const cleanBase64 = pdfBase64.includes('base64,')
        ? pdfBase64.split('base64,')[1].trim()
        : pdfBase64.trim();

      if (cleanBase64.length > 0) {
        const pdfBuffer = Buffer.from(cleanBase64, 'base64');
        attachments.push({
          filename: pdfFilename || 'Relatorio_TKE_Manutencao_Preventiva.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        });
        console.log(`📎 Anexo PDF preparado: ${pdfFilename} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
      } else {
        console.warn('⚠️ Base64 do PDF vazio após limpeza.');
      }
    } else {
      console.warn('⚠️ Requisição recebida sem pdfBase64.');
    }

    // Construção do template HTML corporativo TKE
    const defaultSubject = subject || `[TKE] Relatório de Manutenção Preventiva - ${data['Cliente / Condomínio'] || 'Equipamento'} - TITS-502P`;
    
    const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: linear-gradient(135deg, #4c1d95, #c026d3, #ea580c); padding: 24px; color: #ffffff; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 13px; opacity: 0.9; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-top: 10px; }
    .content { padding: 24px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    .info-table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
    .info-table td.label { font-weight: bold; color: #64748b; width: 40%; }
    .info-table td.val { color: #0f172a; font-weight: 600; }
    .alert-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; font-size: 12px; color: #92400e; margin-bottom: 20px; }
    .pdf-banner { background: #fdf4ff; border: 1px dashed #c084fc; border-radius: 8px; padding: 14px; text-align: center; margin-top: 15px; }
    .pdf-banner p { margin: 0; font-size: 13px; color: #6b21a8; font-weight: bold; }
    .footer { background-color: #0f172a; color: #94a3b8; padding: 16px 24px; font-size: 11px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 22px; font-weight: 900; font-family: monospace; margin-bottom: 4px;">TK<span style="color: #fbd38d;">E</span></div>
      <h1>Relatório de Manutenção Preventiva</h1>
      <p>Norma TITS-502P (Ind. 1) — Escadas e Esteiras Rolantes</p>
      <span class="badge">O.S. Preventiva Periódica Unificada</span>
    </div>

    <div class="content">
      <table class="info-table">
        <tr>
          <td class="label">Cliente / Condomínio:</td>
          <td class="val">${data['Cliente / Condomínio'] || '-'}</td>
        </tr>
        <tr>
          <td class="label">Endereço:</td>
          <td class="val">${data['Endereço'] || '-'}</td>
        </tr>
        <tr>
          <td class="label">Equipamento:</td>
          <td class="val">${data['Equipamento (Tag / Série)'] || '-'}</td>
        </tr>
        <tr>
          <td class="label">Data da Visita:</td>
          <td class="val">${data['Data da Visita'] || '-'}</td>
        </tr>
        <tr>
          <td class="label">Mês de Referência:</td>
          <td class="val">${data['Mês de Referência'] || '-'}</td>
        </tr>
        <tr>
          <td class="label">Técnico(s):</td>
          <td class="val">${data['Técnico(s) Responsável(is)'] || '-'}</td>
        </tr>
      </table>

      <table style="width: 100%; border-spacing: 6px; margin-bottom: 16px;">
        <tr>
          <td style="background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; text-align: center; padding: 10px; border-radius: 6px; width: 33%;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Conformes</div>
            <div style="font-size: 20px; font-weight: 800;">${data['Total - Conformes'] || '0'}</div>
          </td>
          <td style="background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; text-align: center; padding: 10px; border-radius: 6px; width: 33%;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Não Conformes</div>
            <div style="font-size: 20px; font-weight: 800;">${data['Total - Não Conformes'] || '0'}</div>
          </td>
          <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; color: #475569; text-align: center; padding: 10px; border-radius: 6px; width: 33%;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Não se Aplica</div>
            <div style="font-size: 20px; font-weight: 800;">${data['Total - Não se Aplica'] || '0'}</div>
          </td>
        </tr>
      </table>

      ${
        data['Não-Conformidades'] && data['Não-Conformidades'] !== 'Nenhuma detectada (equipamento 100% operacional)'
          ? `<div class="alert-box"><strong>⚠️ Observações / Não-Conformidades:</strong><br>${data['Não-Conformidades']}</div>`
          : ''
      }

      <div class="pdf-banner">
        <p>📎 O relatório completo em formato PDF (.pdf) com registro fotográfico e assinaturas técnicas está anexado a este e-mail.</p>
      </div>
    </div>

    <div class="footer">
      TK Elevator Corporation • Gestão Técnica de Serviços e Manutenção Preventiva TITS-502P<br>
      E-mail gerado automaticamente pelo Sistema de Relatórios O.S.
    </div>
  </div>
</body>
</html>
    `.trim();

    // Disparo real do e-mail com Nodemailer
    const mailOptions = {
      from: smtpFrom,
      to: targetEmail,
      subject: defaultSubject,
      text: text || `Relatório de Manutenção Preventiva TITS-502P em anexo.\nCliente: ${data['Cliente / Condomínio'] || '-'}\nEquipamento: ${data['Equipamento (Tag / Série)'] || '-'}`,
      html: htmlBody,
      attachments: attachments
    };

    console.log(`📤 Enviando e-mail para ${targetEmail} via ${smtpHost}:${smtpPort}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ E-mail enviado com sucesso:', info.messageId, info.response);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      response: info.response,
      message: `E-mail enviado com sucesso para ${targetEmail} com o PDF anexado!`
    });
  } catch (error) {
    console.error('❌ Erro no envio de e-mail SMTP:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Falha ao conectar ou enviar via servidor SMTP.',
      code: error.code || 'SMTP_ERROR'
    });
  }
}
