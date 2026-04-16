/**
 * Proxy Server con API Mock per Test
 * Prima verifichiamo che il sistema funzioni, poi l'API reale
 */

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

// Funzione per servire file statici
function serveStaticFile(filePath, res) {
  try {
    const fullPath = path.join(__dirname, filePath);
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

// Server HTTP con API Mock
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Gestisci CORS
  if (handleCORS(req, res)) {
    return;
  }

  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  try {
    if (req.method === 'POST' && pathname === '/api/hf-proxy') {
      // Gestisci proxy con risposta MOCK per test
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          console.log('Received request body:', body.substring(0, 200) + '...');
          
          const { apiUrl, inputs } = JSON.parse(body);
          
          console.log('Mock response for:', apiUrl);
          console.log('Topic:', inputs.substring(0, 100) + '...');
          
          // Funzione per generare contenuti specifici basati sull'argomento
          function generateSpecificContent(topic) {
            const topicLower = topic.toLowerCase();
            
            // Contenuti specifici per DNA
            if (topicLower.includes('dna') || topicLower.includes('acido') || topicLower.includes('genetico')) {
              return {
                spiegazione_semplice: `# Analisi della richiesta su DNA\n\nL'utente ha richiesto informazioni approfondite sul **DNA (Acido Desossiribonucleico)**. Questa è una molecola fondamentale per la vita e la genetica.\n\n## Punti chiave identificati:\n- **Molecola centrale**: DNA come materiale genetico\n- **Struttura**: Doppia elica e basi azotate\n- **Funzione**: Archiviazione e trasmissione dell'informazione genetica\n- **Applicazioni**: Medicina, forense, biotecnologie\n\n## Prossimi passi:\n1. Analisi dettagliata della struttura del DNA\n2. Studio delle funzioni biologiche\n3. Esplorazione delle applicazioni pratiche`,
                
                riassunto_esecutivo: `# Il DNA: La Molecola della Vita\n\n## Introduzione\nIl **DNA (Acido Desossiribonucleico)** è la molecola che contiene le informazioni genetiche di quasi tutti gli organismi viventi. Scoperto nel 1953 da Watson e Crick, il DNA è la base dell'ereditarietà e della vita stessa.\n\n## Struttura del DNA\n### La Doppia Elica\nIl DNA ha una struttura a doppia elica, simile a una scala a chiocciola:\n- **Filamenti**: Due catene di nucleotidi intrecciate\n- **Basi azotate**: Adenina (A), Timina (T), Guanina (G), Citosina (C)\n- **Accoppiamento**: A si lega sempre con T, G sempre con C\n- **Zuccheri e fosfati**: Formano lo "scheletro" della molecola\n\n### Il Codice Genetico\nLe sequenze di basi formano i **geni**, che contengono le istruzioni per:\n- **Sintesi proteica**: Produzione di proteine essenziali\n- **Regolazione cellulare**: Controllo delle funzioni biologiche\n- **Trasmissione ereditaria**: Passaggio dei tratti ai discendenti\n\n## Funzioni Biologiche\n### Replicazione\nIl DNA può copiarsi stesso attraverso:\n- **Semi-conservativa**: Ogni nuova molecola contiene un filamento vecchio e uno nuovo\n- **Enzimi specifici**: DNA polimerasi ed elicasi\n- **Precisione**: Tasso di errore molto basso grazie a meccanismi di correzione\n\n### Trascrizione e Traduzione\n- **Trascrizione**: DNA → RNA (nel nucleo)\n- **Traduzione**: RNA → Proteine (nel citoplasma)\n- **Espressione genica**: Alcuni geni sono attivi, altri silenziosi\n\n## Applicazioni Pratiche\n### Medicina e Salute\n- **Diagnosi genetica**: Identificazione di malattie ereditarie\n- **Terapia genica**: Correzione di difetti genetici\n- **Farmacogenomica**: Medicina personalizzata basata sul DNA\n\n### Biotecnologie\n- **Ingegneria genetica**: Modifica di organismi\n- **PCR**: Amplificazione di sequenze DNA\n- **Sequenziamento**: Lettura completa del genoma\n\n### Scienze Forensi\n- **Identificazione**: Confronto di DNA biologico\n- **Ricerca parentela**: Stabilire legami familiari\n- **Criminalistica**: Prove scientifiche in indagini\n\n## Sviluppi Futuri\n- **CRISPR**: Tecnologia di editing genetico preciso\n- **Medicina personalizzata**: Trattamenti basati sul profilo genetico\n- **Sintesi artificiale**: Creazione di DNA sintetico`,
                
                schema_concettuale: `1. DNA (Acido Desossiribonucleico)\n   1.1. Struttura molecolare\n      1.1.1. Doppia elica\n      1.1.2. Nucleotidi e basi azotate\n         1.1.2.1. Adenina (A)\n         1.1.2.2. Timina (T)\n         1.1.2.3. Guanina (G)\n         1.1.2.4. Citosina (C)\n      1.1.3. Legami idrogeno\n   1.2. Funzioni biologiche\n      1.2.1. Replicazione del DNA\n      1.2.2. Trascrizione (DNA → RNA)\n      1.2.3. Traduzione (RNA → Proteine)\n   1.3. Applicazioni pratiche\n      1.3.1. Medicina e salute\n         1.3.1.1. Diagnosi genetica\n         1.3.1.2. Terapia genica\n      1.3.2. Biotecnologie\n         1.3.2.1. Ingegneria genetica\n         1.3.2.2. PCR e sequenziamento\n      1.3.3. Scienze forensi\n         1.3.3.1. Identificazione personale\n         1.3.3.2. Ricerca parentela\n2. Tecnologie emergenti\n   2.1. CRISPR-Cas9\n   2.2. Medicina personalizzata\n   2.3. Sintesi di DNA artificiale`,
                
                quiz: {
                  domande: [
                    {
                      domanda: "Cosa significa l'acronimo DNA?",
                      opzioni: ["Acido Desossiribonucleico", "Acido Ribonucleico", "Acido Aminonucleico", "Acido Liponucleico"],
                      risposta_corretta: 0
                    },
                    {
                      domanda: "Quale delle seguenti basi azotate NON si trova nel DNA?",
                      opzioni: ["Adenina", "Uracile", "Guanina", "Citosina"],
                      risposta_corretta: 1
                    },
                    {
                      domanda: "Come si chiamano gli scienziati che hanno scoperto la struttura a doppia elica del DNA?",
                      opzioni: ["Watson e Crick", "Mendel e Darwin", "Pasteur e Fleming", "Einstein e Bohr"],
                      risposta_corretta: 0
                    },
                    {
                      domanda: "Quale base si accoppia sempre con l'Adenina nel DNA?",
                      opzioni: ["Timina", "Guanina", "Citosina", "Uracile"],
                      risposta_corretta: 0
                    },
                    {
                      domanda: "A cosa serve il processo di replicazione del DNA?",
                      opzioni: ["Creare copie identiche del DNA per la divisione cellulare", "Produrre proteine", "Eliminare DNA danneggiato", "Convertire RNA in DNA"],
                      risposta_corretta: 0
                    }
                  ],
                  soluzioni: `Soluzioni Complete del Quiz sul DNA:\n\n1. Risposta corretta: A - Acido Desossiribonucleico\n   Spiegazione: DNA è l'acronimo di Deoxyribonucleic Acid in inglese.\n\n2. Risposta corretta: B - Uracile\n   Spiegazione: L'Uracile si trova solo nell'RNA, non nel DNA dove è sostituita dalla Timina.\n\n3. Risposta corretta: A - Watson e Crick\n   Spiegazione: James Watson e Francis Crick hanno scoperto la struttura a doppia elica nel 1953.\n\n4. Risposta corretta: A - Timina\n   Spiegazione: Nella doppia elica del DNA, l'Adenina si accoppia sempre con la Timina (A-T).\n\n5. Risposta corretta: A - Creare copie identiche del DNA per la divisione cellulare\n   Spiegazione: La replicazione permette alle cellule figlie di ricevere una copia completa del DNA.`
                }
              };
            }
            
            // Contenuti per fotosintesi
            if (topicLower.includes('fotosintesi') || topicLower.includes('clorofilla')) {
              return {
                spiegazione_semplice: `# Analisi della richiesta su Fotosintesi\n\nL'utente ha richiesto informazioni sulla **fotosintesi**, il processo fondamentale attraverso cui le piante convertono l'energia solare in energia chimica.\n\n## Punti chiave:\n- **Processo vitale**: Conversione di energia solare\n- **Organismi**: Piante, alghe e alcuni batteri\n- **Prodotti**: Glucosio e ossigeno\n- **Importanza**: Base della catena alimentare`,
                
                riassunto_esecutivo: `# La Fotosintesi: Il Processo che Dà Vita alla Terra\n\n## Introduzione\nLa **fotosintesi** è il processo biologico attraverso cui le piante, le alghe e alcuni batteri convertono l'energia luminosa del sole in energia chimica, producendo glucosio e ossigeno.\n\n## La Reazione Chimica\n6CO₂ + 6H₂O + Energia luminosa → C₆H₁₂O₆ + 6O₂\n\n## Fasi della Fotosintesi\n### Fase Luminosa\n- **Clorofilla**: Pigmento verde che cattura la luce\n- **Fotolisi**: Scissione dell'acqua\n- **Produzione ATP e NADPH**: Molecole energetiche\n\n### Fase Oscura (Ciclo di Calvin)\n- **Fixazione del CO₂**: Incorporazione dell'anidride carbonica\n- **Produzione di glucosio**: Sintesi di zuccheri`,
                
                schema_concettuale: `1. Fotosintesi\n   1.1. Reazione generale\n      1.1.1. Reagenti: CO₂, H₂O, Energia luminosa\n      1.1.2. Prodotti: Glucosio, O₂\n   1.2. Fasi del processo\n      1.2.1. Fase luminosa\n         1.2.1.1. Cattura della luce (clorofilla)\n         1.2.1.2. Fotolisi dell'acqua\n      1.2.2. Fase oscura (Ciclo di Calvin)\n         1.2.2.1. Fixazione del CO₂\n         1.2.2.2. Sintesi del glucosio`,
                
                quiz: {
                  domande: [
                    {
                      domanda: "Qual è il prodotto principale della fotosintesi?",
                      opzioni: ["Glucosio e ossigeno", "Anidride carbonica e acqua", "Proteine e grassi", "Lattice e resine"],
                      risposta_corretta: 0
                    },
                    {
                      domanda: "Quale pigmento è fondamentale per la fotosintesi?",
                      opzioni: ["Clorofilla", "Emoglobina", "Melanina", "Carotene"],
                      risposta_corretta: 0
                    }
                  ],
                  soluzioni: "Soluzioni: 1A - Glucosio e ossigeno, 2A - Clorofilla"
                }
              };
            }
            
            // Contenuti generici per altri argomenti
            return {
              spiegazione_semplice: `# Analisi della richiesta\n\nL'utente ha richiesto informazioni su **${topic}**. Questo argomento è stato analizzato con successo dal sistema di intelligenza artificiale.\n\n## Punti chiave identificati:\n- **Argomento principale**: ${topic}\n- **Contesto**: Richiesta di approfondimento\n- **Obiettivo**: Creazione di materiali didattici completi`,
              
              riassunto_esecutivo: `# Riassunto su ${topic}\n\n## Introduzione\nQuesto è un riassunto dettagliato su **${topic}**, generato per fornire una comprensione completa dell'argomento richiesto.\n\n## Concetti Fondamentali\n### Definizione\nL'argomento rappresenta un concetto importante che merita un'analisi approfondita.\n\n### Applicazioni\nNella pratica, questo concetto si manifesta attraverso applicazioni reali e tangibili.`,
              
              schema_concettuale: `1. ${topic}\n   1.1. Definizione e concetti base\n   1.2. Applicazioni pratiche\n   1.3. Importanza e rilevanza`,
              
              quiz: {
                domande: [
                  {
                    domanda: `Qual è la definizione corretta di ${topic}?`,
                    opzioni: ["Definizione corretta", "Definizione parziale", "Definizione errata", "Nessuna delle precedenti"],
                    risposta_corretta: 0
                  }
                ],
                soluzioni: `Soluzione: A - Definizione corretta`
              }
            };
          }

          // Risposta MOCK che simula l'API di Hugging Face
          const mockResponse = [{
            generated_text: JSON.stringify(generateSpecificContent(inputs))
          }];

          console.log('Sending mock response');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(mockResponse));
          
        } catch (error) {
          console.error('Mock server error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Errore interno del mock server',
            details: error.message 
          }));
        }
      });

    } else if (req.method === 'GET' && pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        mode: 'mock'
      }));

    } else if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      serveStaticFile('index.html', res);

    } else if (req.method === 'GET') {
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
  console.log(`🚀 Proxy Server MOCK avviato su http://localhost:${PORT}`);
  console.log(`📁 Servendo file statici dalla directory: ${__dirname}`);
  console.log(`🔗 Proxy API disponibile su: http://localhost:${PORT}/api/hf-proxy`);
  console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Sito web disponibile su: http://localhost:${PORT}/`);
  console.log(`🧪 MODALITÀ MOCK: Risposte simulate per testare il sistema`);
});
