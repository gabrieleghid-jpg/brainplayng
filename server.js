/**
 * Server Web Semplice per brainplaying
 * Versione senza dipendenze esterne - usa solo moduli Node.js built-in
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Gestione delle richieste
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './home.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  // Leggi il file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File non trovato, prova a caricare home.html
        fs.readFile('./home.html', (err, homeContent) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1><p>File non trovato</p>', 'utf-8');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(homeContent, 'utf-8');
          }
        });
      } else {
        // Altro errore
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // File trovato, servilo
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server brainplaying avviato!`);
  console.log(`📍 Indirizzo: http://localhost:${PORT}`);
  console.log(`🏠 Home page: http://localhost:${PORT}/home.html`);
  console.log(`🎮 Minigiochi: http://localhost:${PORT}/minigiochi.html`);
  console.log(`🧠 Avatar: http://localhost:${PORT}/avatar.html`);
  console.log(`🛍️ Negozio: http://localhost:${PORT}/negozio.html`);
  console.log(`\n✨ Server in ascolto sulla porta ${PORT}...`);
});
