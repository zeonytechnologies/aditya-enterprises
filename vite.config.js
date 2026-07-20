import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import nodemailer from 'nodemailer'

const localMailPlugin = () => ({
  name: 'local-mail-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/send-email' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'ckpgrouponline@gmail.com',
                pass: 'ybmo fpjzabdyankq'
              }
            });
            const mailOptions = {
              from: '"Aditya Enterprises" <ckpgrouponline@gmail.com>',
              to: data.to,
              subject: data.subject,
              html: data.html
            };
            const info = await transporter.sendMail(mailOptions);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, messageId: info.messageId }));
          } catch (err) {
            console.error('Mail error', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localMailPlugin()],
  server: {
    port: 5500,
    host: true
  }
})

