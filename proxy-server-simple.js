/**
 * Proxy Server per Hugging Face API
 * Risolve i problemi CORS inoltrando le richieste tramite un server locale
 * Versione senza dipendenze esterne - usa solo moduli Node.js build-in
 */

const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

// Configurazione
const CONFIG = {
  HF_TOKEN: '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',
  HF_API_URL_VISION: 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
  HF_API_URL_TEXT: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1'
};

// Funzione per fare richieste HTTP/HTTPS con gestione redirect
function makeRequest(options, data, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error('Troppi redirect'));
      return;
    }

    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      
      // Gestisci redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`Redirect ${res.statusCode} to: ${res.headers.location}`);
        const redirectUrl = url.parse(res.headers.location);
        const redirectOptions = {
          hostname: redirectUrl.hostname,
          port: redirectUrl.port,
          path: redirectUrl.path,
          method: options.method,
          headers: options.headers
        };
        
        // Aggiorna Content-Length se c'è data
        if (data) {
          redirectOptions.headers['Content-Length'] = Buffer.byteLength(data);
        }
        
        makeRequest(redirectOptions, data, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

// Funzione per servire file statici
function serveStaticFile(filePath, res) {
  const fullPath = path.join(__dirname, filePath);
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    const ext = path.extname(fullPath);
    const contentType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';

    res.writeHead(200, { 
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(data);
  });
}

// Funzione per gestire le richieste CORS
function handleCORS(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return true;
  }
  return false;
}

// Server HTTP
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Gestisci CORS
  if (handleCORS(req, res)) {
    return;
  }

  // Log delle richieste
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  try {
    if (req.method === 'POST' && pathname === '/api/hf-proxy') {
      // Gestisci proxy per Hugging Face API
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const { apiUrl, inputs, parameters } = JSON.parse(body);
          
          if (!apiUrl || !inputs) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'apiUrl e inputs sono richiesti' }));
            return;
          }
          
          console.log('Proxy request to:', apiUrl);
          console.log('Inputs:', inputs.substring(0, 100) + '...');
          
          const hfUrl = url.parse(apiUrl);
          const postData = JSON.stringify({
            inputs,
            parameters: parameters || {}
          });

          const options = {
            hostname: hfUrl.hostname,
            port: hfUrl.port,
            path: hfUrl.path,
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CONFIG.HF_TOKEN}`,
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData)
            }
          };

          const response = await makeRequest(options, postData);
          
          if (response.statusCode !== 200) {
            console.error('Hugging Face API error:', response.statusCode, response.data);
            res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: `Errore API Hugging Face: ${response.statusCode}`,
              details: response.data 
            }));
            return;
          }
          
          console.log('Response received successfully');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
          
        } catch (error) {
          console.error('Proxy server error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Errore interno del proxy server',
            details: error.message 
          }));
        }
      });

    } else if (req.method === 'GET' && pathname === '/api/health') {
      // Health check endpoint
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
      }));

    } else if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      // Servi la pagina principale
      serveStaticFile('index.html', res);

    } else if (req.method === 'GET') {
      // Servi altri file statici
      serveStaticFile(pathname, res);

    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Errore interno del server',
      details: error.message 
    }));
  }
});

// Avvia il server
server.listen(PORT, () => {
  console.log(`🚀 Proxy server avviato su http://localhost:${PORT}`);
  console.log(`📁 Servendo file statici dalla directory: ${__dirname}`);
  console.log(`🔗 Proxy API disponibile su: http://localhost:${PORT}/api/hf-proxy`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Sito web disponibile su: http://localhost:${PORT}/`);
});
