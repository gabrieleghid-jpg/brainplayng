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
      this.expandCard(card, data.id);
    });
  }

  expandCard(cardElement, schemaId) {
    // Nascondi l'immagine
    const imageDiv = cardElement.querySelector('[data-card-image]');
    imageDiv.style.display = 'none';

    // Nascondi il pulsante
    const btn = cardElement.querySelector('.schema-ai-btn');
    btn.style.display = 'none';

    // Crea container principale per contenuti espansi
    const expandedContainer = document.createElement('div');
    expandedContainer.className = 'expanded-content-container';
    expandedContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem 0;
      animation: slideInUp 0.5s ease;
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
      padding: 3rem 2rem;
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
    loadingText.textContent = 'Sto analizzando lo schema...';

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(loadingText);
    expandedContainer.appendChild(loadingContainer);

    // Aggiungi il container espanso alla card
    cardElement.querySelector('.schema-card-content').appendChild(expandedContainer);

    // Espandi la card per contenere meglio i nuovi contenuti
    cardElement.style.gridRow = 'span 2';
    cardElement.style.minHeight = 'auto';

    // Simula caricamento di 2 secondi prima di mostrare i contenuti
    setTimeout(() => {
      // Rimuovi il spinner
      loadingContainer.remove();

      // Sezione Flashcard con titolo
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

      // Container per flashcard con layout migliorato
      const flashcardsContainer = document.createElement('div');
      flashcardsContainer.className = 'flashcards-grid';
      flashcardsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        width: 100%;
      `;

      // Aggiungi 3 flashcard con animazione ritardata
      this.mockFlashcards.forEach((fc, index) => {
        const flashcard = this.createFlashcardElement(fc);
        flashcard.style.animation = `fadeInUp 0.6s ease ${index * 0.15}s both`;
        flashcardsContainer.appendChild(flashcard);
      });

      flashcardSection.appendChild(flashcardsContainer);
      expandedContainer.appendChild(flashcardSection);

      // Separatore visivo
      const separator = document.createElement('div');
      separator.className = 'content-separator';
      separator.style.cssText = `
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border), transparent);
        margin: 1rem 0;
        animation: fadeInUp 0.4s ease 0.25s both;
      `;
      expandedContainer.appendChild(separator);

      // Sezione Quiz con titolo
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

      // Container per quiz con layout migliorato
      const quizContainer = document.createElement('div');
      quizContainer.className = 'quiz-container';
      quizContainer.style.cssText = `
        display: grid;
        gap: 2rem;
        width: 100%;
      `;

      // Aggiungi 2 domande con animazione ritardata
      this.mockQuestions.forEach((q, index) => {
        const quizDiv = this.createQuizQuestion(q, index);
        quizDiv.style.animation = `fadeInUp 0.6s ease ${(index * 0.15) + 0.45}s both`;
        quizContainer.appendChild(quizDiv);
      });

      quizSection.appendChild(quizContainer);
      expandedContainer.appendChild(quizSection);
    }, 2000); // 2 secondi di caricamento
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
