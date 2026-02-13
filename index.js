const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = process.env.PORT || 3000;

// Servidor HTTP para Railway não derrubar o app
app.get('/', (req, res) => {
  res.send('Bot está rodando.');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('Escaneie o QR acima');
});

client.on('ready', () => {
  console.log('Bot está online!');
});

client.on('message', async message => {
  if (!message.from.endsWith('@g.us')) return;

  if (message.body === '!oi') {
    message.reply('Olá 👋');
  }

  if (message.body === '!menu') {
    message.reply('🤖 Comandos:\n!oi\n!menu\n!musica');
  }

  if (message.body === '!musica') {
    const musicas = [
      'Shape of You - Ed Sheeran',
      'Blinding Lights - The Weeknd',
      'Dance Monkey - Tones and I'
    ];
    const random = musicas[Math.floor(Math.random() * musicas.length)];
    message.reply('🎵 Música: ' + random);
  }
});

client.initialize();

