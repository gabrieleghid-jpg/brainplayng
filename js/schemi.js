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
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const schemaId = 'schema-' + Date.now();
      
      // Crea card con anteprima
      this.createUploadedSchemaCard({
        id: schemaId,
        title: file.name.replace(/\.[^.]+$/, ''),
        image: dataUrl,
        fileName: file.name,
        fileType: file.type,
        timestamp: new Date().toLocaleDateString('it-IT')
      });
    };

    reader.readAsDataURL(file);
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
          : '📄'}
      </div>
      <div class="schema-card-content">
        <h3 class="schema-card-title">${data.title}</h3>
        <p class="schema-card-meta">
          <span>${data.timestamp}</span>
        </p>
        <button class="schema-ai-btn" data-schema-id="${data.id}">
          Genera Flashcard e Domande
        </button>
      </div>
    `;

    grid.insertBefore(card, grid.firstChild);

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

    // Crea container per flashcard
    const flashcardsContainer = document.createElement('div');
    flashcardsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    `;

    // Aggiungi 3 flashcard
    this.mockFlashcards.forEach((fc, index) => {
      const flashcard = this.createFlashcardElement(fc);
      flashcardsContainer.appendChild(flashcard);
    });

    cardElement.querySelector('.schema-card-content').appendChild(flashcardsContainer);

    // Crea container per quiz
    const quizContainer = document.createElement('div');
    quizContainer.style.cssText = `
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-top: 1.5rem;
    `;

    // Aggiungi 2 domande
    this.mockQuestions.forEach((q, index) => {
      const quizDiv = this.createQuizQuestion(q, index);
      quizContainer.appendChild(quizDiv);
    });

    cardElement.querySelector('.schema-card-content').appendChild(quizContainer);
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
    qDiv.className = 'quiz-question';
    
    let optionsHtml = '';
    questionData.options.forEach((option, optIndex) => {
      const label = String.fromCharCode(65 + optIndex);
      optionsHtml += `
        <button class="quiz-option" data-index="${optIndex}">
          <span class="option-label">${label}</span>
          ${option}
        </button>
      `;
    });

    qDiv.innerHTML = `
      <p class="question-title">
        <span class="question-number">${index + 1}</span>
        ${questionData.question}
      </p>
      <div class="quiz-options" data-correct="${questionData.correct}">
        ${optionsHtml}
      </div>
    `;

    // Aggiungi event listeners
    const options = qDiv.querySelectorAll('.quiz-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        this.handleQuizClick(option, e);
      });
    });

    return qDiv;
  }

  handleQuizClick(optionElement, event) {
    event.stopPropagation();
    
    const quizContainer = optionElement.closest('.quiz-options');
    if (quizContainer.classList.contains('answered')) {
      return;
    }

    const correctIndex = parseInt(quizContainer.dataset.correct);
    const selectedIndex = parseInt(optionElement.dataset.index);

    // Deseleziona tutte le opzioni
    quizContainer.querySelectorAll('.quiz-option').forEach(opt => {
      opt.classList.remove('selected');
    });

    optionElement.classList.add('selected');
    quizContainer.classList.add('answered');

    // Mostra risultato dopo 300ms
    setTimeout(() => {
      if (selectedIndex === correctIndex) {
        optionElement.classList.add('correct');
      } else {
        optionElement.classList.add('incorrect');
        quizContainer.querySelectorAll('.quiz-option')[correctIndex].classList.add('correct');
      }
    }, 300);
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
