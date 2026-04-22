// Sistema di Ricerca Google per Brainplayng
class GoogleSearchService {
    constructor() {
        this.searchUrl = 'https://www.googleapis.com/customsearch/v1';
        this.apiKey = CONFIG?.GOOGLE_API_KEY || '';
        this.searchEngineId = CONFIG?.SEARCH_ENGINE_ID || '';
    }

    // Ricerca Google per ottenere informazioni su un argomento
    async searchGoogle(query, maxResults = 5) {
        try {
            console.log('Ricerca Google per:', query);
            
            // Se non ci sono le credenziali, usa un metodo alternativo
            if (!this.apiKey || !this.searchEngineId) {
                return await this.mockSearchResults(query);
            }

            const response = await fetch(`${this.searchUrl}?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&num=${maxResults}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Errore ricerca Google: ${response.status}`);
            }

            const data = await response.json();
            console.log('Risultati ricerca Google:', data);

            return {
                success: true,
                query: query,
                results: data.items || [],
                totalResults: data.searchInformation?.totalResults || 0,
                searchTime: data.searchInformation?.searchTime || 0
            };

        } catch (error) {
            console.error('Errore ricerca Google:', error);
            // Fallback a risultati mock
            return await this.mockSearchResults(query);
        }
    }

    // Risultati mock quando l'API non è disponibile
    async mockSearchResults(query) {
        console.log('Usando risultati mock per:', query);
        
        // Database di informazioni mock per argomenti comuni
        const mockDatabase = {
            'fotosintesi': {
                title: 'Fotosintesi - Wikipedia',
                snippet: 'La fotosintesi è il processo biochimico attraverso cui le piante, le alghe e alcuni batteri convertono l\'energia luminosa del sole in energia chimica.',
                link: 'https://it.wikipedia.org/wiki/Fotosintesi'
            },
            'dna': {
                title: 'DNA - Enciclopedia Treccani',
                snippet: 'Il DNA (acido desossiribonucleico) è la molecola che contiene le informazioni genetiche degli organismi viventi.',
                link: 'https://www.treccani.it/enciclopedia/dna/'
            },
            'gravità': {
                title: 'Gravitazione - Wikipedia',
                snippet: 'La gravitazione è una delle quattro forze fondamentali della natura, responsabile dell\'attrazione tra corpi dotati di massa.',
                link: 'https://it.wikipedia.org/wiki/Gravitazione'
            },
            'cellula': {
                title: 'Cellula - Wikipedia',
                snippet: 'La cellula è l\'unità strutturale e funzionale fondamentale degli organismi viventi, la più piccola struttura in grado di eseguire tutte le funzioni vitali.',
                link: 'https://it.wikipedia.org/wiki/Cellula'
            },
            'energia': {
                title: 'Energia - Wikipedia',
                snippet: 'L\'energia è la capacità di compiere lavoro o di produrre calore. In fisica, è una grandezza fisica scalare che si manifesta in diverse forme.',
                link: 'https://it.wikipedia.org/wiki/Energia'
            }
        };

        // Cerca risultati pertinenti
        const results = [];
        const queryLower = query.toLowerCase();

        for (const [key, info] of Object.entries(mockDatabase)) {
            if (queryLower.includes(key) || key.includes(queryLower)) {
                results.push({
                    title: info.title,
                    snippet: info.snippet,
                    link: info.link,
                    displayLink: new URL(info.link).hostname
                });
            }
        }

        // Se non trovati, genera risultati generici
        if (results.length === 0) {
            results.push({
                title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Ricerca Enciclopedica`,
                snippet: `${query.charAt(0).toUpperCase() + query.slice(1)} è un argomento di studio importante che merita approfondimento. Per informazioni dettagliate, consulta fonti specializzate.`,
                link: `https://it.wikipedia.org/wiki/${encodeURIComponent(query)}`,
                displayLink: 'it.wikipedia.org'
            });
        }

        return {
            success: true,
            query: query,
            results: results,
            totalResults: results.length,
            searchTime: 0.1,
            mock: true
        };
    }

    // Estrae informazioni rilevanti dai risultati di ricerca
    extractInformation(searchResults, maxParagraphs = 3) {
        if (!searchResults.results || searchResults.results.length === 0) {
            return {
                summary: 'Nessuna informazione trovata.',
                sources: [],
                keyPoints: []
            };
        }

        const sources = searchResults.results.map(result => ({
            title: result.title,
            url: result.link,
            snippet: result.snippet
        }));

        // Combina gli snippet per creare un riassunto
        const combinedText = searchResults.results
            .map(result => result.snippet)
            .join(' ');

        // Estrai punti chiave
        const keyPoints = searchResults.results
            .slice(0, 3)
            .map(result => result.snippet.substring(0, 150) + '...');

        return {
            summary: combinedText.substring(0, 500) + '...',
            sources: sources,
            keyPoints: keyPoints,
            totalResults: searchResults.totalResults,
            isFromGoogle: !searchResults.mock
        };
    }
}

// Funzione globale per la ricerca
window.googleSearchService = new GoogleSearchService();

// Funzione per cercare informazioni su un argomento
window.searchTopicInfo = async function(topic) {
    try {
        console.log('Ricerca informazioni per:', topic);
        
        const searchResults = await window.googleSearchService.searchGoogle(topic);
        const information = window.googleSearchService.extractInformation(searchResults);
        
        console.log('Informazioni estratte:', information);
        return information;
        
    } catch (error) {
        console.error('Errore ricerca informazioni:', error);
        return {
            summary: 'Errore nella ricerca delle informazioni.',
            sources: [],
            keyPoints: [],
            error: error.message
        };
    }
};

// Funzione per aggiungere il link al sito alla fine dei contenuti
window.addSiteLink = function(content, topic) {
    const siteLink = '\n\n---\n\n**Scopri di più su [Brainplayng](https://brainplayng.github.io) - Il tuo compagno di studio intelligente!**';
    const siteUrl = 'https://brainplayng.github.io';
    
    if (typeof content === 'string') {
        return content + siteLink;
    } else if (typeof content === 'object' && content !== null) {
        const enhancedContent = { ...content };
        
        // Aggiungi link a tutti i campi testuali
        if (enhancedContent.spiegazione_semplice) {
            enhancedContent.spiegazione_semplice += siteLink;
        }
        
        if (enhancedContent.riassunto_esecutivo) {
            enhancedContent.riassunto_esecutivo += siteLink;
        }
        
        if (enhancedContent.schema_concettuale) {
            enhancedContent.schema_concettuale += siteLink;
        }
        
        // Aggiungi informazioni sul sito
        enhancedContent.fonte_sito = {
            nome: 'Brainplayng',
            url: siteUrl,
            descrizione: 'Piattaforma di studio intelligente'
        };
        
        return enhancedContent;
    }
    
    return content;
};

// Funzione per integrare la ricerca nel sistema di generazione
window.enhanceWithGoogleSearch = async function(topic, existingContent = null) {
    try {
        const searchInfo = await window.searchTopicInfo(topic);
        
        // Se c'è contenuto esistente, integralo con le informazioni di ricerca
        if (existingContent) {
            const enhancedContent = {
                ...existingContent,
                googleSearchInfo: searchInfo,
                spiegazione_semplice: searchInfo.summary || existingContent.spiegazione_semplice,
                fonti_esterne: searchInfo.sources || [],
                punti_chiave: searchInfo.keyPoints || []
            };
            
            // Aggiungi il link al sito
            return window.addSiteLink(enhancedContent, topic);
        } else {
            // Crea contenuto basato solo sulla ricerca
            const baseContent = {
                spiegazione_semplice: searchInfo.summary,
                riassunto_esecutivo: `# **${topic.charAt(0).toUpperCase() + topic.slice(1)}**

## **Informazioni dalla Ricerca**

${searchInfo.summary}

### **Fonti**
${searchInfo.sources.map(source => `- [${source.title}](${source.url})`).join('\n')}

### **Punti Chiave**
${searchInfo.keyPoints.map(point => `- ${point}`).join('\n')}`,
                schema_concettuale: `## **Schema di ${topic}**

### **Fonti di Informazione**
${searchInfo.sources.map((source, index) => `${index + 1}. ${source.title}`).join('\n')}

### **Concetti Principali**
${searchInfo.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}`,
                googleSearchInfo: searchInfo,
                fonti_esterne: searchInfo.sources,
                punti_chiave: searchInfo.keyPoints
            };
            
            // Aggiungi il link al sito
            return window.addSiteLink(baseContent, topic);
        }
        
    } catch (error) {
        console.error('Errore integrazione ricerca:', error);
        const errorContent = existingContent || {
            spiegazione_semplice: 'Errore nella ricerca delle informazioni.',
            riassunto_esecutivo: '**Errore**: Impossibile ottenere informazioni dalla ricerca.',
            schema_concettuale: '| Errore | Descrizione |\n|---------|-------------|\n| Ricerca | Non disponibile |',
            error: error.message
        };
        
        // Aggiungi il link al sito anche agli errori
        return window.addSiteLink(errorContent, topic);
    }
};

console.log('Google Search Service caricato');
