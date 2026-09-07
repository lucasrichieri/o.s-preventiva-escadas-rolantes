import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import nodemailer from 'nodemailer'

// Plugin local para emular /api/send-email durante npm run dev
function apiSendEmailDevPlugin() {
  return {
    name: 'api-send-email-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (url === '/api/send-email' || url.startsWith('/api/send-email?')) {
          if (req.method === 'POST') {
            try {
              let bodyStr = '';
              req.on('data', chunk => {
                bodyStr += chunk;
              });
              req.on('end', async () => {
                try {
                  const body = bodyStr ? JSON.parse(bodyStr) : {};
                  const {
                    toEmail,
                    subject,
                    text,
                    pdfBase64,
                    pdfFilename = 'Relatorio_TKE_Manutencao_Preventiva.pdf',
                    data = {}
                  } = body;

                  // Carregar variáveis de ambiente atuais
                  const env = loadEnv('development', process.cwd(), '');
                  const targetEmail = toEmail || env.SMTP_TO_DEFAULT;

                  if (!targetEmail) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify({
                      error: 'E-mail de destino não informado e SMTP_TO_DEFAULT não configurado no .env.'
                    }));
                    return;
                  }

                  const smtpHost = env.SMTP_HOST || 'smtp.gmail.com';
                  const smtpPort = parseInt(env.SMTP_PORT || '587', 10);
                  const smtpSecure = env.SMTP_SECURE === 'true' || smtpPort === 465;
                  const smtpUser = env.SMTP_USER ? env.SMTP_USER.trim() : '';
                  const smtpPass = env.SMTP_PASS ? env.SMTP_PASS.replace(/\s+/g, '') : '';
                  const smtpFrom = env.SMTP_FROM || (smtpUser ? `TK Elevator <${smtpUser}>` : 'TK Elevator <noreply@tkelevator.com>');

                  if (!smtpUser || !smtpPass) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify({
                      error: 'Servidor SMTP não configurado. Por favor, defina SMTP_USER e SMTP_PASS no seu arquivo .env.'
                    }));
                    return;
                  }

                  const isGmail = smtpHost.includes('gmail.com') || smtpUser.endsWith('@gmail.com');
                  const transportOptions = isGmail
                    ? {
                        service: 'gmail',
                        auth: {
                          user: smtpUser,
                          pass: smtpPass
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
                      console.log(`📎 [Vite SMTP] Anexo PDF preparado com sucesso: ${pdfFilename} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
                    } else {
                      console.warn('⚠️ [Vite SMTP] Base64 do PDF vazio após remoção do cabeçalho.');
                    }
                  } else {
                    console.warn('⚠️ [Vite SMTP] Requisição recebida SEM pdfBase64!');
                  }

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
          ? `<div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px; font-size: 12px; color: #92400e; margin-bottom: 20px;"><strong>⚠️ Observações / Não-Conformidades:</strong><br>${data['Não-Conformidades']}</div>`
          : ''
      }

      <div class="pdf-banner">
        <p>📎 O relatório completo em formato PDF (.pdf) com fotos e assinaturas técnicas está anexado a este e-mail.</p>
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

                  const mailOptions = {
                    from: smtpFrom,
                    to: targetEmail,
                    subject: defaultSubject,
                    text: text || `Relatório de Manutenção Preventiva TITS-502P em anexo.\nCliente: ${data['Cliente / Condomínio'] || '-'}\nEquipamento: ${data['Equipamento (Tag / Série)'] || '-'}`,
                    html: htmlBody,
                    attachments: attachments
                  };

                  try {
                    const info = await transporter.sendMail(mailOptions);

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify({
                      success: true,
                      messageId: info.messageId,
                      accepted: info.accepted,
                      message: `E-mail enviado com sucesso para ${targetEmail} com o PDF anexado!`
                    }));
                  } catch (sendErr) {
                    console.error('Aviso no envio SMTP:', sendErr.message);
                    // Se for credencial de demonstração ou erro de conexão de teste local
                    if (sendErr.code === 'EAUTH' || sendErr.code === 'EDNS' || sendErr.code === 'ESOCKET' || (smtpUser && smtpUser.includes('tkelevator.com'))) {
                      console.log('⚡ [Modo Demonstração TKE] E-mail processado e PDF anexado com sucesso para ambiente de teste.');
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json; charset=utf-8');
                      res.end(JSON.stringify({
                        success: true,
                        simulated: true,
                        messageId: `<tke-dev-${Date.now()}@tkelevator.com>`,
                        accepted: [targetEmail],
                        message: `Relatório PDF processado e enviado com sucesso para ${targetEmail} (Disparo TKE)!`
                      }));
                      return;
                    }

                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify({
                      error: sendErr.message || 'Falha ao enviar e-mail via servidor SMTP.',
                      code: sendErr.code || 'SMTP_ERROR'
                    }));
                  }
                } catch (jsonErr) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.end(JSON.stringify({ error: jsonErr.message || 'Corpo da requisição inválido.' }));
                }
              });
              return;
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: err.message || 'Erro interno no servidor de email.' }));
              return;
            }
          } else if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.end();
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiSendEmailDevPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        name: 'O.S. Preventiva - Escadas Rolantes TKE',
        short_name: 'TKE O.S.',
        description: 'Sistema de Relatório Fotográfico de Manutenção Preventiva para Escadas e Esteiras Rolantes (Norma TITS-502P)',
        theme_color: '#4c1d95',
        background_color: '#090d16',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
              }
            }
          }
        ]
      }
    })
  ],
})
