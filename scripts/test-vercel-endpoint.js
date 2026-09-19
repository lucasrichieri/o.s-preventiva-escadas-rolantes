async function testLiveEndpoint() {
  console.log('Testing live Vercel endpoint: https://o-s-preventiva-escadas-rolantes.vercel.app/api/send-email ...');
  
  const samplePdfBase64 = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF').toString('base64');

  try {
    const res = await fetch('https://o-s-preventiva-escadas-rolantes.vercel.app/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toEmail: 'lucasrichieri@gmail.com',
        subject: '[TKE Teste Vercel] Relatório de Manutenção Preventiva TITS-502P',
        text: 'Teste de disparo direto pela API Serverless no Vercel.',
        pdfBase64: samplePdfBase64,
        pdfFilename: 'Relatorio_Teste_Vercel.pdf',
        data: {
          'Cliente / Condomínio': 'Shopping Teste Vercel',
          'Equipamento (Tag / Série)': 'ESC-01',
          'Data da Visita': '19/09/2026',
          'Total - Conformes': '10',
          'Total - Não Conformes': '0',
          'Total - Não se Aplica': '2',
        }
      })
    });

    console.log('Status:', res.status, res.statusText);
    const data = await res.json();
    console.log('Response JSON:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testLiveEndpoint();
