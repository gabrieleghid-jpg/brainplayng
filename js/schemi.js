/**
 * Gestione interattiva della sezione Schemi
 * - Upload immagini e creazione dinamica card
 * - Generazione flashcard e quiz da immagini
 */

class SchematiManager {
  constructor() {
    // Modal Schemi
    this.modal = document.getElementById('schemiBigModal');
    this.schemiBtnCard = document.getElementById('schemiBtnCard');
    this.modalCloseBtn = document.getElementById('schemiBigModalClose');
    
    // Upload Zone
    this.dropZone = document.getElementById('dropZone');
    this.fileInput = document.getElementById('fileInput');
    this.uploadBtn = document.querySelector('.upload-btn');
    
    // Grid delle card caricate
    this.schemiGrid = document.getElementById('schemiGrid');
    
    // Storage per card espanse
    this.expandedCards = new Set();
    
    // Mock data per flashcard e quiz
    this.mockFlashcards = [
      {
        title: 'Concetto Principale',
        concept: 'Tematica Centrale',
        connections: [
          { icon: '🔍', label: 'Analisi' },
          { icon: '🎯', label: 'Obiettivo' },
          { icon: '📊', label: 'Struttura' },
          { icon: '💡', label: 'Intuizione' },
          { icon: '🔗', label: 'Collegamento' },
          { icon: '✨', label: 'Applicazione' }
        ]
      },
      {
        title: 'Concetto Secondario',
        concept: 'Elemento di Supporto',
        connections: [
          { icon: '📚', label: 'Teoria' },
          { icon: '🧪', label: 'Pratica' },
          { icon: '⚙️', label: 'Meccanismo' },
          { icon: '🎨', label: 'Esempi' },
          { icon: '🔄', label: 'Ciclo' }
        ]
      },
      {
        title: 'Applicazione Pratica',
        concept: 'Utilizzo Reale',
        connections: [
          { icon: '🌍', label: 'Contesto' },
          { icon: '👨‍💼', label: 'Professione' },
          { icon: '💼', label: 'Industria' },
          { icon: '🎓', label: 'Studio' },
          { icon: '🚀', label: 'Innovazione' }
        ]
      }
    ];
    
    this.mockQuestions = [
      {
        question: 'Qual è il concetto principale trattato in questo schema?',
        options: ['Elemento A', 'Elemento B', 'Elemento C', 'Elemento D'],
        correct: 1
      },
      {
        question: 'Come si collegano i diversi elementi dello schema?',
        options: ['Solo teoricamente', 'In modo sequenziale', 'attraverso relazioni complesse', 'Non si collegano'],
        correct: 2
      }
    ];
    
    this.init();
  }

  init() {
    // Gestione apertura modal dal pulsante card
    if (this.schemiBtnCard) {
      this.schemiBtnCard.addEventListener('click', () => {
        this.openModal();
      });
    }

    // Gestione chiusura modal
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Chiudi modal cliccando sul backdrop
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Keyboard support - Escape per chiudere modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    // File Upload Handlers
    if (this.dropZone) {
      this.dropZone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
      this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
      this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    // Collegamento pulsante upload al file input
    if (this.uploadBtn && this.fileInput) {
      this.uploadBtn.addEventListener('click', () => {
        this.fileInput.click();
      });
    }

    // Handler per file selezionati
    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        this.handleFiles(e.target.files);
        // Reset input per permettere di selezionare lo stesso file più volte
        e.target.value = '';
      });
    }
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone?.classList.add('dragover');
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone?.classList.add('dragover');
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone?.classList.remove('dragover');
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone?.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    this.handleFiles(files);
  }

  handleFiles(files) {
    if (!files || files.length === 0) return;

    for (let file of files) {
      if (this.validateFile(file)) {
        this.processFile(file);
      }
    }
  }

  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!file.type.startsWith('image/')) {
      alert(`Tipo di file non supportato: ${file.type}`);
      return false;
    }

    if (file.size > maxSize) {
      alert(`File troppo grande. Massimo 10MB`);
      return false;
    }

    return true;
  }

  processFile(file) {
    const imageUrl = URL.createObjectURL(file);
    const schemaId = 'schema-' + Date.now();
    
    // Crea card con anteprima usando URL.createObjectURL
    this.createUploadedSchemaCard({
      id: schemaId,
      title: file.name.replace(/\.[^.]+$/, ''),
      image: imageUrl,
      fileName: file.name,
      fileType: file.type,
      timestamp: new Date().toLocaleDateString('it-IT'),
      file: file // Mantiene il riferimento al file per usi futuri
    });
  }

  createUploadedSchemaCard(data) {
    const grid = this.schemiGrid;
    if (!grid) return;

    const card = document.createElement('div');
    card.className = 'schema-card';
    card.setAttribute('data-schema-id', data.id);
    
    card.innerHTML = `
      <div class="schema-card-image" data-card-image>
        ${data.fileType.startsWith('image') 
          ? `<img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">` 
          : '??'}
      </div>
      <div class="schema-card-content">
        <div class="schema-title-section">
          <input type="text" 
                 class="schema-title-input" 
                 value="${data.title}" 
                 placeholder="Inserisci titolo dello schema..."
                 maxlength="50">
          <button class="schema-title-edit-btn" title="Modifica titolo">
            <span style="font-size: 0.9rem;">?</span>
          </button>
        </div>
        <p class="schema-card-meta">
          <span>${data.timestamp}</span>
        </p>
        <button class="schema-ai-btn" data-schema-id="${data.id}">
          <span style="display: block; font-size: 1.1rem; margin-bottom: 0.3rem;">?</span>
          <span style="display: block; font-size: 0.9rem;">Genera</span>
          <span style="display: block; font-size: 0.9rem;">Flashcard e Domande</span>
        </button>
      </div>
    `;

    grid.insertBefore(card, grid.firstChild);

    // Event listener per il campo di input del titolo
    const titleInput = card.querySelector('.schema-title-input');
    titleInput.addEventListener('input', (e) => {
      const newTitle = e.target.value.trim() || data.title;
      card.setAttribute('data-schema-title', newTitle);
    });

    titleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    });

    // Event listener per il pulsante Genera Flashcard
    const btn = card.querySelector('.schema-ai-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openGeneratorModal(card, data.id);
    });
  }

  openGeneratorModal(cardElement, schemaId) {
    // Prendi l'immagine dal card
    const imageElement = cardElement.querySelector('.schema-card-image img');
    const schemaTitle = cardElement.querySelector('.schema-title-input').value || 'Schema';
    
    // Crea modal overlay a schermo intero
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'generator-modal-overlay';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
      overflow-y: auto;
      animation: fadeIn 0.3s ease;
    `;

    // Crea il contenuto del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'generator-modal-content';
    modalContent.style.cssText = `
      background: var(--panel);
      border-radius: var(--radius);
      width: 100%;
      max-width: 1200px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
      position: relative;
      animation: slideInUp 0.4s ease;
    `;

    // Header con pulsante di chiusura
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      background: var(--panel);
      z-index: 10;
    `;

    const title = document.createElement('h2');
    title.style.cssText = `
      margin: 0;
      color: var(--text);
      font-size: 1.5rem;
    `;
    title.textContent = 'Flashcard e Domande';

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--muted);
      transition: color 0.2s;
      padding: 0.5rem;
    `;
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = 'var(--text)');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = 'var(--muted)');
    closeBtn.addEventListener('click', () => {
      modalOverlay.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modalOverlay.remove(), 300);
    });

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Container per il contenuto principale
    const contentBody = document.createElement('div');
    contentBody.style.cssText = `
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    `;

    // Mostra spinner di caricamento
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'loading-container';
    loadingContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 3rem;
      text-align: center;
    `;

    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.cssText = `
      width: 48px;
      height: 48px;
      border: 4px solid rgba(79, 70, 229, 0.1);
      border-top: 4px solid var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    `;

    const loadingText = document.createElement('p');
    loadingText.className = 'loading-text';
    loadingText.style.cssText = `
      color: var(--muted);
      font-size: 1rem;
      margin: 0;
    `;
    loadingText.textContent = 'Sto analizzando lo schema con l\'IA...';

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(loadingText);
    contentBody.appendChild(loadingContainer);

    modalContent.appendChild(header);
    modalContent.appendChild(contentBody);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Chiudi cliccando sul background
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modalOverlay.remove(), 300);
      }
    });

    // Analizza l'immagine con Hugging Face e genera domande
    if (imageElement && imageElement.src) {
      this.analyzeSchemaWithHuggingFace(imageElement.src, schemaTitle, contentBody, loadingContainer);
    } else {
      // Fallback se nessuna immagine
      loadingContainer.remove();
      this.renderFallbackContent(contentBody);
    }
  }

  async analyzeSchemaWithHuggingFace(imageSrc, schemaTitle, contentBody, loadingContainer) {
    try {
      // Verifica che il token sia configurato
      if (!CONFIG.HF_TOKEN || CONFIG.HF_TOKEN.includes('INSERISCI')) {
        console.log('Token Hugging Face non configurato, uso dati mock');
        loadingContainer.remove();
        this.renderMockContent(contentBody, schemaTitle);
        return;
      }

      // Converti l'immagine in base64
      const base64Image = await this.imageToBase64(imageSrc);
      
      // Step 1: Usa BLIP per descrivere l'immagine
      const imageDescription = await this.describeImageWithBlip(base64Image);
      
      // Step 2: Usa Mistral per generare domande basate sulla descrizione
      const huggingFaceResponse = await this.generateQuestionsWithMistral(imageDescription, schemaTitle);
      
      // Rimuovi il loading
      loadingContainer.remove();
      
      // Render il contenuto con le domande generate
      this.renderGeneratedContent(contentBody, huggingFaceResponse);
    } catch (error) {
      console.error('Errore nell\'analisi con Hugging Face, uso dati mock:', error);
      loadingContainer.remove();
      this.renderMockContent(contentBody, schemaTitle);
    }
  }

  async describeImageWithBlip(base64Image) {
    // Converte base64 in Blob per Hugging Face
    const binaryString = atob(base64Image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });

    const response = await fetch(CONFIG.HF_API_URL_VISION, {
      headers: { Authorization: `Bearer ${CONFIG.HF_TOKEN}` },
      method: 'POST',
      body: blob,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore BLIP: ${error.error || 'Impossibile analizzare l\'immagine'}`);
    }

    const result = await response.json();
    return result[0]?.generated_text || 'Schema educativo';
  }

  async generateQuestionsWithMistral(imageDescription, schemaTitle) {
    const prompt = `Analizza la seguente descrizione di uno schema educativo intitolato "${schemaTitle}":

Descrizione: ${imageDescription}

Devi generare:
1. Una lista di 3-4 concetti principali identificati
2. 2-3 domande a scelta multipla che testino la comprensione
3. Per ogni domanda: testo, 4 opzioni, indice risposta corretta, spiegazione

Rispondi SOLO in JSON valido, nel formato ESATTO:
{
  "concepts": ["concetto1", "concetto2", "concetto3"],
  "questions": [
    {
      "question": "Testo della domanda?",
      "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
      "correctIndex": 0,
      "explanation": "Spiegazione della risposta"
    }
  ]
}

Assicurati che il JSON sia valido e le domande siano specifiche al contenuto descritto.`;

    const response = await fetch(CONFIG.HF_API_URL_TEXT, {
      headers: { Authorization: `Bearer ${CONFIG.HF_TOKEN}` },
      method: 'POST',
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore Mistral: ${error.error || 'Impossibile generare domande'}`);
    }

    const result = await response.json();
    const responseText = result[0]?.generated_text || '';
    
    // Estrai il JSON dalla risposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Formato risposta non valido. Riprova.');
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  async imageToBase64(imageSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
        resolve(base64);
      };
      
      img.onerror = () => {
        reject(new Error('Non riesco a leggere l\'immagine'));
      };
      
      img.src = imageSrc;
    });
  }

  async describeImageWithBlip(base64Image) {
    // Converte base64 in Blob per Hugging Face
    const binaryString = atob(base64Image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });

    const response = await fetch(CONFIG.HF_API_URL_VISION, {
      headers: { Authorization: `Bearer ${CONFIG.HF_TOKEN}` },
      method: 'POST',
      body: blob,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore BLIP: ${error.error || 'Impossibile analizzare l\'immagine'}`);
    }

    const result = await response.json();
    return result[0]?.generated_text || 'Schema educativo';
  }

  renderGeneratedContent(contentBody, geminiData) {
    // Sezione Concetti
    const conceptsSection = document.createElement('div');
    conceptsSection.style.cssText = `
      background: rgba(79, 70, 229, 0.04);
      border-left: 4px solid var(--accent);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    `;

    const conceptsTitle = document.createElement('h3');
    conceptsTitle.style.cssText = `
      margin: 0 0 1rem;
      color: var(--accent);
      font-size: 1.1rem;
    `;
    conceptsTitle.textContent = '📚 Concetti Identificati';

    const conceptsList = document.createElement('div');
    conceptsList.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    `;

    geminiData.concepts.forEach(concept => {
      const tag = document.createElement('div');
      tag.style.cssText = `
        background: var(--accent);
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 20px;
        font-weight: 500;
        text-align: center;
      `;
      tag.textContent = concept;
      conceptsList.appendChild(tag);
    });

    conceptsSection.appendChild(conceptsTitle);
    conceptsSection.appendChild(conceptsList);
    contentBody.appendChild(conceptsSection);

    // Separatore
    const separator1 = document.createElement('div');
    separator1.style.cssText = `
      height: 1px;
      background: var(--border);
      margin: 1rem 0;
    `;
    contentBody.appendChild(separator1);

    // Sezione Quiz con domande generate
    const quizSection = document.createElement('div');
    quizSection.className = 'quiz-section';
    quizSection.innerHTML = `
      <h3 style="margin: 0 0 1.5rem; color: var(--accent); font-size: 1.1rem; font-weight: 600;">
        ✍️ Quiz Personalizzato
      </h3>
    `;

    const quizContainer = document.createElement('div');
    quizContainer.style.cssText = `
      display: grid;
      gap: 2rem;
      width: 100%;
    `;

    geminiData.questions.forEach((q, index) => {
      const quizDiv = this.createGeminiQuizQuestion(q, index);
      quizDiv.style.animation = `fadeInUp 0.6s ease ${(index * 0.15) + 0.45}s both`;
      quizContainer.appendChild(quizDiv);
    });

    quizSection.appendChild(quizContainer);
    contentBody.appendChild(quizSection);
  }

  createGeminiQuizQuestion(questionData, index) {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question-enhanced';
    qDiv.style.cssText = `
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    `;
    
    // Header della domanda
    const questionHeader = document.createElement('div');
    questionHeader.style.cssText = `
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
    `;
    
    const questionNumber = document.createElement('div');
    questionNumber.style.cssText = `
      background: linear-gradient(135deg, var(--accent), #6366f1);
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    `;
    questionNumber.textContent = index + 1;
    
    const questionText = document.createElement('div');
    questionText.style.cssText = `
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text);
      line-height: 1.5;
    `;
    questionText.textContent = questionData.question;
    
    questionHeader.appendChild(questionNumber);
    questionHeader.appendChild(questionText);
    qDiv.appendChild(questionHeader);

    // Container per le opzioni
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'quiz-options-enhanced';
    optionsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    `;
    optionsContainer.setAttribute('data-correct', questionData.correctIndex);

    // Crea le opzioni
    questionData.options.forEach((option, optIndex) => {
      const label = String.fromCharCode(65 + optIndex);
      const optionBtn = document.createElement('button');
      optionBtn.className = 'quiz-option-enhanced';
      optionBtn.setAttribute('data-index', optIndex);
      optionBtn.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 2px solid var(--border);
        border-radius: 12px;
        background: transparent;
        color: var(--text);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
        font-size: 0.95rem;
        font-weight: 500;
        position: relative;
        overflow: hidden;
      `;
      
      const optionLabel = document.createElement('span');
      optionLabel.style.cssText = `
        background: rgba(79, 70, 229, 0.1);
        color: var(--accent);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        flex-shrink: 0;
        transition: all 0.2s ease;
      `;
      optionLabel.textContent = label;
      
      const optionText = document.createElement('span');
      optionText.textContent = option;
      
      optionBtn.appendChild(optionLabel);
      optionBtn.appendChild(optionText);
      
      // Event listener per il click
      optionBtn.addEventListener('click', (e) => {
        this.handleGeminiQuizClick(optionBtn, questionData, e);
      });
      
      // Hover effect
      optionBtn.addEventListener('mouseenter', () => {
        if (!optionsContainer.classList.contains('answered')) {
          optionBtn.style.borderColor = 'var(--accent)';
          optionBtn.style.background = 'rgba(79, 70, 229, 0.04)';
          optionBtn.style.transform = 'translateY(-1px)';
        }
      });
      
      optionBtn.addEventListener('mouseleave', () => {
        if (!optionsContainer.classList.contains('answered')) {
          optionBtn.style.borderColor = 'var(--border)';
          optionBtn.style.background = 'transparent';
          optionBtn.style.transform = 'translateY(0)';
        }
      });
      
      optionsContainer.appendChild(optionBtn);
    });

    qDiv.appendChild(optionsContainer);
    return qDiv;
  }

  handleGeminiQuizClick(optionElement, questionData, event) {
    event.stopPropagation();
    
    const optionsContainer = optionElement.parentElement;
    if (optionsContainer.classList.contains('answered')) {
      return;
    }

    const correctIndex = questionData.correctIndex;
    const selectedIndex = parseInt(optionElement.dataset.index);

    // Deseleziona tutte le opzioni
    optionsContainer.querySelectorAll('.quiz-option-enhanced').forEach(opt => {
      opt.style.borderColor = 'var(--border)';
      opt.style.background = 'transparent';
    });

    // Seleziona l'opzione cliccata
    optionElement.style.borderColor = 'var(--accent)';
    optionElement.style.background = 'rgba(79, 70, 229, 0.08)';
    optionsContainer.classList.add('answered');

    // Mostra risultato dopo 300ms
    setTimeout(() => {
      const allOptions = optionsContainer.querySelectorAll('.quiz-option-enhanced');
      
      if (selectedIndex === correctIndex) {
        // Risposta corretta
        optionElement.style.borderColor = '#10b981';
        optionElement.style.background = 'rgba(16, 185, 129, 0.08)';
        optionElement.querySelector('span:first-child').style.background = '#10b981';
        optionElement.querySelector('span:first-child').style.color = 'white';
        this.showQuizFeedback(optionElement, '✅ Corretto! Ottimo lavoro!', 'success');
      } else {
        // Risposta errata
        optionElement.style.borderColor = '#ef4444';
        optionElement.style.background = 'rgba(239, 68, 68, 0.08)';
        optionElement.querySelector('span:first-child').style.background = '#ef4444';
        optionElement.querySelector('span:first-child').style.color = 'white';
        
        // Mostra la risposta corretta
        const correctOption = allOptions[correctIndex];
        correctOption.style.borderColor = '#10b981';
        correctOption.style.background = 'rgba(16, 185, 129, 0.08)';
        correctOption.querySelector('span:first-child').style.background = '#10b981';
        correctOption.querySelector('span:first-child').style.color = 'white';
        
        this.showQuizFeedback(optionElement, `❌ Non esatto. La risposta corretta è: ${questionData.options[correctIndex]}`, 'error');
      }

      // Mostra la spiegazione
      setTimeout(() => {
        this.showExplanation(optionElement, questionData.explanation);
      }, 1500);
    }, 300);
  }

  showExplanation(questionElement, explanation) {
    const questionDiv = questionElement.closest('.quiz-question-enhanced');
    
    const explanationDiv = document.createElement('div');
    explanationDiv.style.cssText = `
      background: rgba(79, 70, 229, 0.06);
      border-left: 4px solid var(--accent);
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      color: var(--text);
      animation: slideInUp 0.3s ease;
    `;
    explanationDiv.innerHTML = `
      <strong style="color: var(--accent);">💡 Spiegazione:</strong><br>
      ${explanation}
    `;
    
    questionDiv.appendChild(explanationDiv);
  }

  renderApiKeyWarning(contentBody) {
    const warning = document.createElement('div');
    warning.style.cssText = `
      background: rgba(239, 68, 68, 0.1);
      border: 2px solid #ef4444;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
    `;

    warning.innerHTML = `
      <h3 style="color: #ef4444; margin: 0 0 1rem;">⚠️ Token Hugging Face non configurato</h3>
      <p style="margin: 0 0 1rem; color: var(--text);">Per usare il generatore intelligente di domande con IA, devi:</p>
      <ol style="margin: 0 0 1.5rem; color: var(--text); text-align: left; display: inline-block;">
        <li>Registrati gratuitamente su <strong>https://huggingface.co/join</strong></li>
        <li>Vai a <strong>https://huggingface.co/settings/tokens</strong></li>
        <li>Crea un nuovo token (scegli "Read")</li>
        <li>Apri il file <code style="background: var(--panel-strong); padding: 0.2rem 0.5rem; border-radius: 4px;">config.js</code></li>
        <li>Incolla il token in: <code style="background: var(--panel-strong); padding: 0.2rem 0.5rem; border-radius: 4px;">HF_TOKEN: 'tuotoken'</code></li>
      </ol>
      <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: var(--accent); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Ricarica quando pronto</button>
    `;

    contentBody.appendChild(warning);
  }

  renderMockContent(contentBody, schemaTitle) {
    // Usa i dati mock esistenti ma personalizzati per il titolo
    const mockFlashcards = this.mockFlashcards.map(fc => ({
      ...fc,
      title: fc.title === 'Concetto Principale' ? `Concetto chiave di ${schemaTitle}` : fc.title
    }));

    const mockQuestions = this.mockQuestions.map(q => ({
      ...q,
      question: q.question.includes('schema') ? q.question.replace('questo schema', schemaTitle) : q.question
    }));

    // Crea le sezioni come nella funzione expandCard originale
    const flashcardSection = document.createElement('div');
    flashcardSection.className = 'flashcard-section';
    flashcardSection.innerHTML = `
      <div class="section-header">
        <h3 style="margin: 0 0 1rem; color: var(--accent); font-size: 1.1rem; font-weight: 600;">
          <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">Flashcard Interattive</span>
            <span style="font-size: 0.8rem; color: var(--muted);">Clicca per esplorare i concetti</span>
          </span>
        </h3>
      </div>
    `;

    const flashcardsContainer = document.createElement('div');
    flashcardsContainer.className = 'flashcards-grid';
    flashcardsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      width: 100%;
    `;

    mockFlashcards.forEach((fc, index) => {
      const flashcard = this.createFlashcardElement(fc);
      flashcard.style.animation = `fadeInUp 0.6s ease ${index * 0.15}s both`;
      flashcardsContainer.appendChild(flashcard);
    });

    flashcardSection.appendChild(flashcardsContainer);
    contentBody.appendChild(flashcardSection);

    // Separatore visivo
    const separator = document.createElement('div');
    separator.className = 'content-separator';
    separator.style.cssText = `
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 1rem 0;
      animation: fadeInUp 0.4s ease 0.25s both;
    `;
    contentBody.appendChild(separator);

    // Sezione Quiz
    const quizSection = document.createElement('div');
    quizSection.className = 'quiz-section';
    quizSection.innerHTML = `
      <div class="section-header">
        <h3 style="margin: 0 0 1.5rem; color: var(--accent); font-size: 1.1rem; font-weight: 600;">
          <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">Quiz di Verifica</span>
            <span style="font-size: 0.8rem; color: var(--muted);">Testa la tua comprensione</span>
          </span>
        </h3>
      </div>
    `;

    const quizContainer = document.createElement('div');
    quizContainer.className = 'quiz-container';
    quizContainer.style.cssText = `
      display: grid;
      gap: 2rem;
      width: 100%;
    `;

    mockQuestions.forEach((q, index) => {
      const quizDiv = this.createQuizQuestion(q, index);
      quizDiv.style.animation = `fadeInUp 0.6s ease ${(index * 0.15) + 0.45}s both`;
      quizContainer.appendChild(quizDiv);
    });

    quizSection.appendChild(quizContainer);
    contentBody.appendChild(quizSection);
  }

  renderErrorMessage(contentBody, errorMessage) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.style.cssText = `
      text-align: center;
      padding: 2rem;
      color: var(--text);
    `;

    error.innerHTML = `
      <h3 style="color: #ef4444; margin: 0 0 1rem;">? Errore nell'analisi</h3>
      <p style="margin: 0; color: var(--text);">${errorMessage}</p>
      <p style="margin: 1rem 0 0; font-size: 0.9rem; color: var(--muted);">Controlla la console per più dettagli.</p>
    `;

    contentBody.appendChild(error);
  }

  renderFallbackContent(contentBody) {
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      background: rgba(79, 70, 229, 0.04);
      border: 2px dashed var(--border);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
    `;

    fallback.innerHTML = `
      <h3 style="color: var(--muted); margin: 0 0 1rem;">⚠️ Immagine non disponibile</h3>
      <p style="margin: 0; color: var(--text);">Non riesco a leggere l'immagine dello schema. Assicurati che il file sia stato caricato correttamente.</p>
    `;

    contentBody.appendChild(fallback);
  }

  createFlashcardElement(data) {
    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard-schema';
    
    const connectionsHtml = (data.connections || [])
      .map(conn => `
        <div class="connection-item">
          <span class="connection-icon">${conn.icon}</span>
          <p class="connection-label">${conn.label}</p>
        </div>
      `)
      .join('');

    flashcard.innerHTML = `
      <div class="flashcard-central">
        <p class="flashcard-title">${data.title}</p>
        <p class="flashcard-concept">${data.concept}</p>
        <p class="flashcard-hint" style="font-size: 0.85rem; color: var(--muted);">Clicca per scoprire i concetti collegati</p>
      </div>
      <div class="flashcard-connections">
        ${connectionsHtml}
      </div>
    `;

    // Aggiungi interattività
    flashcard.addEventListener('click', () => {
      flashcard.classList.toggle('active');
    });

    return flashcard;
  }

  createQuizQuestion(questionData, index) {
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question-enhanced';
    qDiv.style.cssText = `
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    `;
    
    // Header della domanda con numero e testo
    const questionHeader = document.createElement('div');
    questionHeader.className = 'question-header';
    questionHeader.style.cssText = `
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.5rem;
    `;
    
    const questionNumber = document.createElement('div');
    questionNumber.className = 'question-number-enhanced';
    questionNumber.style.cssText = `
      background: linear-gradient(135deg, var(--accent), #6366f1);
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    `;
    questionNumber.textContent = index + 1;
    
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.style.cssText = `
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text);
      line-height: 1.5;
      margin: 0;
    `;
    questionText.textContent = questionData.question;
    
    questionHeader.appendChild(questionNumber);
    questionHeader.appendChild(questionText);
    qDiv.appendChild(questionHeader);

    // Container per le opzioni con layout a griglia
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'quiz-options-enhanced';
    optionsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    `;
    optionsContainer.setAttribute('data-correct', questionData.correct);

    // Crea le opzioni
    questionData.options.forEach((option, optIndex) => {
      const label = String.fromCharCode(65 + optIndex);
      const optionBtn = document.createElement('button');
      optionBtn.className = 'quiz-option-enhanced';
      optionBtn.setAttribute('data-index', optIndex);
      optionBtn.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 2px solid var(--border);
        border-radius: 12px;
        background: transparent;
        color: var(--text);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
        font-size: 0.95rem;
        font-weight: 500;
        position: relative;
        overflow: hidden;
      `;
      
      const optionLabel = document.createElement('span');
      optionLabel.className = 'option-label-enhanced';
      optionLabel.style.cssText = `
        background: rgba(79, 70, 229, 0.1);
        color: var(--accent);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        flex-shrink: 0;
        transition: all 0.2s ease;
      `;
      optionLabel.textContent = label;
      
      const optionText = document.createElement('span');
      optionText.className = 'option-text';
      optionText.textContent = option;
      
      optionBtn.appendChild(optionLabel);
      optionBtn.appendChild(optionText);
      
      // Event listener per il click
      optionBtn.addEventListener('click', (e) => {
        this.handleQuizClick(optionBtn, e);
      });
      
      // Hover effect
      optionBtn.addEventListener('mouseenter', () => {
        if (!optionsContainer.classList.contains('answered')) {
          optionBtn.style.borderColor = 'var(--accent)';
          optionBtn.style.background = 'rgba(79, 70, 229, 0.04)';
          optionBtn.style.transform = 'translateY(-1px)';
        }
      });
      
      optionBtn.addEventListener('mouseleave', () => {
        if (!optionsContainer.classList.contains('answered')) {
          optionBtn.style.borderColor = 'var(--border)';
          optionBtn.style.background = 'transparent';
          optionBtn.style.transform = 'translateY(0)';
        }
      });
      
      optionsContainer.appendChild(optionBtn);
    });

    qDiv.appendChild(optionsContainer);
    return qDiv;
  }

  handleQuizClick(optionElement, event) {
    event.stopPropagation();
    
    const quizContainer = optionElement.closest('.quiz-options-enhanced') || optionElement.closest('.quiz-options');
    if (quizContainer.classList.contains('answered')) {
      return;
    }

    const correctIndex = parseInt(quizContainer.dataset.correct);
    const selectedIndex = parseInt(optionElement.dataset.index);

    // Deseleziona tutte le opzioni (sia vecchie che nuove)
    quizContainer.querySelectorAll('.quiz-option, .quiz-option-enhanced').forEach(opt => {
      opt.classList.remove('selected');
      // Resetta stili per le nuove opzioni
      if (opt.classList.contains('quiz-option-enhanced')) {
        opt.style.borderColor = 'var(--border)';
        opt.style.background = 'transparent';
        opt.style.transform = 'translateY(0)';
        opt.querySelector('.option-label-enhanced').style.background = 'rgba(79, 70, 229, 0.1)';
        opt.querySelector('.option-label-enhanced').style.color = 'var(--accent)';
      }
    });

    // Seleziona l'opzione cliccata
    optionElement.classList.add('selected');
    quizContainer.classList.add('answered');

    // Stile per l'opzione selezionata
    if (optionElement.classList.contains('quiz-option-enhanced')) {
      optionElement.style.borderColor = 'var(--accent)';
      optionElement.style.background = 'rgba(79, 70, 229, 0.08)';
      optionElement.querySelector('.option-label-enhanced').style.background = 'var(--accent)';
      optionElement.querySelector('.option-label-enhanced').style.color = 'white';
    }

    // Mostra risultato dopo 300ms con animazione
    setTimeout(() => {
      const allOptions = quizContainer.querySelectorAll('.quiz-option, .quiz-option-enhanced');
      
      if (selectedIndex === correctIndex) {
        // Risposta corretta
        if (optionElement.classList.contains('quiz-option-enhanced')) {
          optionElement.style.borderColor = '#10b981';
          optionElement.style.background = 'rgba(16, 185, 129, 0.08)';
          optionElement.querySelector('.option-label-enhanced').style.background = '#10b981';
          optionElement.querySelector('.option-label-enhanced').style.color = 'white';
        } else {
          optionElement.classList.add('correct');
        }
        
        // Aggiungi feedback positivo
        this.showQuizFeedback(optionElement, 'Corretto! Ottimo lavoro!', 'success');
      } else {
        // Risposta errata
        if (optionElement.classList.contains('quiz-option-enhanced')) {
          optionElement.style.borderColor = '#ef4444';
          optionElement.style.background = 'rgba(239, 68, 68, 0.08)';
          optionElement.querySelector('.option-label-enhanced').style.background = '#ef4444';
          optionElement.querySelector('.option-label-enhanced').style.color = 'white';
        } else {
          optionElement.classList.add('incorrect');
        }
        
        // Mostra la risposta corretta
        const correctOption = allOptions[correctIndex];
        if (correctOption.classList.contains('quiz-option-enhanced')) {
          correctOption.style.borderColor = '#10b981';
          correctOption.style.background = 'rgba(16, 185, 129, 0.08)';
          correctOption.querySelector('.option-label-enhanced').style.background = '#10b981';
          correctOption.querySelector('.option-label-enhanced').style.color = 'white';
        } else {
          correctOption.classList.add('correct');
        }
        
        // Aggiungi feedback negativo
        this.showQuizFeedback(optionElement, 'Non proprio. Riprova!', 'error');
      }
    }, 300);
  }

  showQuizFeedback(element, message, type) {
    // Crea un elemento di feedback temporaneo
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: absolute;
      top: -40px;
      right: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: white;
      z-index: 10;
      animation: slideDown 0.3s ease;
      pointer-events: none;
    `;
    
    if (type === 'success') {
      feedback.style.background = '#10b981';
      feedback.textContent = message;
    } else {
      feedback.style.background = '#ef4444';
      feedback.textContent = message;
    }
    
    // Posiziona il feedback relativamente alla domanda
    const questionDiv = element.closest('.quiz-question-enhanced, .quiz-question');
    questionDiv.style.position = 'relative';
    questionDiv.appendChild(feedback);
    
    // Rimuovi il feedback dopo 2 secondi
    setTimeout(() => {
      feedback.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        if (feedback.parentNode) {
          feedback.parentNode.removeChild(feedback);
        }
      }, 300);
    }, 2000);
  }

  openModal() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Inizializza il manager quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  new SchematiManager();
});
