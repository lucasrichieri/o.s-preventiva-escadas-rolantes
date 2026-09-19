import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const smtpUser = process.env.SMTP_USER?.trim() || 'lucasrichieri@gmail.com';
const smtpPass = (process.env.SMTP_PASS || 'gnbj fjrg ctof xsau').replace(/\s+/g, '');

console.log('Testing SMTP with User:', smtpUser, 'Pass length:', smtpPass.length);

async function testGmailService() {
  console.log('\n--- 1. Testing service: gmail ---');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    const verify = await transporter.verify();
    console.log('✅ verify() success with service: gmail!', verify);
    
    // Try sending a real test email
    console.log('Sending test email to', smtpUser, '...');
    const res = await transporter.sendMail({
      from: `TK Elevator <${smtpUser}>`,
      to: smtpUser,
      subject: 'Teste de Envio SMTP - TK Elevator',
      text: 'Este é um e-mail de teste para verificar a integração SMTP.',
    });
    console.log('✅ SendMail response:', res);
  } catch (err) {
    console.error('❌ Failed service: gmail:', err);
  }
}

async function testGmailPort587() {
  console.log('\n--- 2. Testing smtp.gmail.com:587 STARTTLS ---');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS via STARTTLS
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const verify = await transporter.verify();
    console.log('✅ verify() success with port 587!', verify);
  } catch (err) {
    console.error('❌ Failed port 587:', err);
  }
}

async function testGmailPort465() {
  console.log('\n--- 3. Testing smtp.gmail.com:465 SSL ---');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    const verify = await transporter.verify();
    console.log('✅ verify() success with port 465!', verify);
  } catch (err) {
    console.error('❌ Failed port 465:', err);
  }
}

async function run() {
  await testGmailService();
  await testGmailPort587();
  await testGmailPort465();
}

run();
