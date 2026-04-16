/**
 * Proxy Server per Hugging Face API
 * Risolve i problemi CORS inoltrando le richieste tramite un server locale
 * Versione senza dipendenze esterne - usa solo moduli Node.js built-in
 */

const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Configurazione
const CONFIG = {
  HF_TOKEN: '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',
  HF_API_URL_VISION: 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
  HF_API_URL_TEXT: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1'
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Proxy endpoint per le API di Hugging Face
app.post('/api/hf-proxy', async (req, res) => {
  try {
    const { apiUrl, inputs, parameters } = req.body;
    
    if (!apiUrl || !inputs) {
      return res.status(400).json({ error: 'apiUrl e inputs sono richiesti' });
    }
    
    console.log('Proxy request to:', apiUrl);
    console.log('Inputs:', inputs.substring(0, 100) + '...');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs,
        parameters: parameters || {}
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Errore API Hugging Face: ${response.status}`,
        details: errorText 
      });
    }
    
    const data = await response.json();
    console.log('Response received successfully');
    res.json(data);
    
  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ 
      error: 'Errore interno del proxy server',
      details: error.message 
    });
  }
});

// Endpoint per salute del server
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servi i file statici nella directory corrente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`🚀 Proxy server avviato su http://localhost:${PORT}`);
  console.log(`📁 Servendo file statici dalla directory: ${__dirname}`);
  console.log(`🔗 Proxy API disponibile su: http://localhost:${PORT}/api/hf-proxy`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
});
