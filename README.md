# Sistema de Relatório Fotográfico de Manutenção Preventiva (TITS-502P) - TKE

Sistema Web / PWA para geração de Ordens de Serviço (O.S.) e relatórios fotográficos de manutenção preventiva em escadas e esteiras rolantes conforme a norma **TITS-502P (Ind. 1)** da **TK Elevator (TKE)**, com exportação direta em PDF e disparo automático via **SMTP**.

---

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar o Servidor SMTP**:
   Edite o arquivo `.env` com os dados do seu provedor de e-mail (Gmail, Outlook, Hostinger, SendGrid, etc.):
   ```env
   # Exemplo para Gmail
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="seu-email@gmail.com"
   SMTP_PASS="sua-senha-de-app-16-digitos"
   SMTP_FROM="TK Elevator <seu-email@gmail.com>"
   SMTP_TO_DEFAULT="destinatario@cliente.com"
   ```

3. **Iniciar o ambiente de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Gerar build de produção**:
   ```bash
   npm run build
   ```

---

## 📧 Envio de E-mails via SMTP

- O envio é processado via **Nodemailer** através do endpoint `/api/send-email`.
- O relatório PDF é gerado dinamicamente no navegador e enviado em anexo (`.pdf`) com corpo de e-mail formatado em HTML com a identidade visual da TKE, resumo estatístico (Conformes / Não Conformes) e detalhes da visita.
- Funciona tanto em ambiente local (`npm run dev` com middleware integrado no Vite) quanto em deploy serverless (Vercel, Netlify ou Node.js).
