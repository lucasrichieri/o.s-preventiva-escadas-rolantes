import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const smtpUser = process.env.SMTP_USER?.trim() || 'lucasrichieri@gmail.com';
const smtpPass = (process.env.SMTP_PASS || 'gnbj fjrg ctof xsau').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

async function run() {
  console.log('Sending test email with PDF attachment to', smtpUser, '...');
  // Dummy PDF buffer
  const samplePdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF');

  try {
    const info = await transporter.sendMail({
      from: `TK Elevator <${smtpUser}>`,
      to: smtpUser,
      subject: '[TKE] Teste Real de Disparo com Anexo PDF',
      text: 'Este é um teste real de envio com anexo PDF.',
      html: '<h2>TK Elevator - Teste Real</h2><p>Se você está lendo isso, o envio SMTP funcionou perfeitamente!</p>',
      attachments: [
        {
          filename: 'Relatorio_Teste.pdf',
          content: samplePdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
    console.log('✅ Email enviado com sucesso!', info.messageId, info.response);
  } catch (err) {
    console.error('❌ Erro no envio:', err);
  }
}

run();
