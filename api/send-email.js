/**
 * Vercel Serverless Function: /api/send-email
 * Processa o envio de e-mail com anexo do relatório PDF da O.S. TKE
 */

export default async function handler(req, res) {
  // Configuração CORS para requisições do frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
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
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { toEmail, subject, text, data } = req.body || {};
    const targetEmail = toEmail || 'lucasrichieri@gmail.com';

    // Disparo através do gateway de email HTTP
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject || '[TKE] Relatório de Manutenção Preventiva TITS-502P',
        _template: 'table',
        _captcha: 'false',
        _replyto: 'noreply@tkelevator.com',
        ...(data || {}),
        'Resumo da O.S.': text || ''
      })
    });

    const result = await response.json().catch(() => ({}));
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Erro na API Serverless send-email:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
