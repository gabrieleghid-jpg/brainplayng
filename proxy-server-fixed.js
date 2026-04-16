/**
 * Proxy Server per Hugging Face API - Versione Corretta
 * Risolve i problemi CORS e di connessione
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

// Funzione per fare richieste HTTPS con handling completo
function makeHttpsRequest(hostname, pathData, postData, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: 443,
      path: pathData,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.HF_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      }
    };

    console.log(`Making HTTPS request to: https://${hostname}${pathData}`);
    console.log('Request options:', JSON.stringify(options, null, 2));

    const req = https.request(options, (res) => {
      console.log(`Response status: ${res.statusCode}`);
      console.log('Response headers:', JSON.stringify(res.headers, null, 2));

      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        console.log('Raw response data:', responseData.substring(0, 500) + '...');
        
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          console.log('Failed to parse JSON, returning raw data');
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      console.error('HTTPS request error:', error);
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Funzione per servire file statici
function serveStaticFile(filePath, res) {
  try {
    const fullPath = path.join(__dirname, filePath);
    console.log(`Serving static file: ${fullPath}`);
    
    const data = fs.readFileSync(fullPath);
    
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
  } catch (error) {
    console.error('Error serving static file:', error);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
  }
}

// Gestione CORS
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
  console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);

  try {
    if (req.method === 'POST' && pathname === '/api/hf-proxy') {
      // Gestisci proxy per Hugging Face API
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          console.log('Received request body:', body.substring(0, 200) + '...');
          
          const { apiUrl, inputs, parameters } = JSON.parse(body);
          
          if (!apiUrl || !inputs) {
            console.error('Missing apiUrl or inputs');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'apiUrl e inputs sono richiesti' }));
            return;
          }
          
          console.log('Proxy request to:', apiUrl);
          console.log('Inputs length:', inputs.length);
          
          // Estrai hostname e path dall'URL
          const urlObj = url.parse(apiUrl);
          const postData = JSON.stringify({
            inputs,
            parameters: parameters || {}
          });

          console.log('Making request to:', urlObj.hostname, urlObj.path);

          const response = await makeHttpsRequest(
            urlObj.hostname,
            urlObj.path,
            postData
          );
          
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
  console.log(`🚀 Proxy server FIXED avviato su http://localhost:${PORT}`);
  console.log(`📁 Servendo file statici dalla directory: ${__dirname}`);
  console.log(`🔗 Proxy API disponibile su: http://localhost:${PORT}/api/hf-proxy`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Sito web disponibile su: http://localhost:${PORT}/`);
});
