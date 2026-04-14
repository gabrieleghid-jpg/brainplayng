class FotoPageManager {
  constructor() {
    this.dropZone = document.getElementById('dropZone');
    this.dropZoneContent = this.dropZone?.querySelector('.drop-zone-content');
    this.previewMeta = document.getElementById('previewMeta');
    this.fileInput = document.getElementById('fileInput');
    this.uploadBtn = document.getElementById('uploadBtn');
    this.photoPreview = document.getElementById('photoPreview');
    this.uploadedFileName = document.getElementById('uploadedFileName');
    this.notesInput = document.getElementById('notesInput');
    this.explanationArea = document.getElementById('explanationArea');
    this.explanationSection = document.getElementById('explanationSection');
    this.qaSection = document.getElementById('qaSection');
    this.askForm = document.getElementById('askForm');
    this.askInput = document.getElementById('askInput');
    this.qaList = document.getElementById('qaList');
    this.quizSection = document.getElementById('quizSection');
    this.quizCount = document.getElementById('quizCount');
    this.generateQuizBtn = document.getElementById('generateQuizBtn');
    this.quizContainer = document.getElementById('quizContainer');
    this.quizResult = document.getElementById('quizResult');
    this.quizSubmitBtn = document.getElementById('quizSubmitBtn');

    this.currentTopic = 'altro';
    this.currentQuestions = [];
    this.knowledgeBank = this.buildKnowledgeBank();

    this.init();
  }

  init() {
    if (this.dropZone) {
      this.dropZone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
      this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
      this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    if (this.uploadBtn) {
      this.uploadBtn.addEventListener('click', () => this.fileInput.click());
    }

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        this.handleFiles(e.target.files);
        e.target.value = '';
      });
    }

    if (this.askForm) {
      this.askForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleQuestion();
      });
    }

    if (this.generateQuizBtn) {
      this.generateQuizBtn.addEventListener('click', () => this.createQuiz());
    }

    if (this.quizSubmitBtn) {
      this.quizSubmitBtn.addEventListener('click', () => this.checkQuiz());
    }

    this.renderInitialState();
  }

  buildKnowledgeBank() {
    return {
      biologia: {
        label: 'Biologia',
        summary: 'Questa foto sembra contenere appunti di biologia. Qui trovi una spiegazione chiara sugli argomenti principali e su come collegarli tra loro.',
        details: 'La biologia studia la vita e gli organismi. Spesso le note coprono strutture cellulari, processi come la fotosintesi e il sistema nervoso. Per studiare in modo efficace, cerca di identificare concetti chiave, relazioni causa-effetto e parole ricorrenti.',
        faq: [
          { question: 'Qual è il concetto principale?', answer: 'Il concetto principale è comprendere come gli elementi biologici si collegano per spiegare la funzione di un organismo o di un processo.' },
          { question: 'Come posso memorizzare meglio le definizioni?', answer: 'Usa schemi visivi, confronto di termini simili e ripetizione attiva. Trasforma ogni definizione in una frase semplice.' }
        ],
        questions: [
          { question: 'Quale processo converte l’energia solare in energia chimica?', options: ['Respirazione', 'Fotosintesi', 'Osmosi', 'Mitocondri'], answer: 1 },
          { question: 'Qual è la funzione principale dei mitocondri?', options: ['Produzione di energia', 'Sintesi proteica', 'Riproduzione cellulare', 'Trasporto di ossigeno'], answer: 0 },
          { question: 'Dove si trova il DNA nelle cellule eucariotiche?', options: ['Nella membrana cellulare', 'Nel citoplasma', 'Nel nucleo', 'Nella parete cellulare'], answer: 2 }
        ]
      },
      matematica: {
        label: 'Matematica',
        summary: 'Questa foto sembra contenere appunti di matematica. Qui ti spiego i passaggi fondamentali e le regole principali per risolvere esercizi tipici.',
        details: 'La matematica richiede chiarezza sui concetti e la pratica dei passaggi. Spesso si studiano equazioni, funzioni e geometria. Concentrati su motivare ogni passaggio e riconoscere i segnali delle operazioni.',
        faq: [
          { question: 'Come risolvere un’equazione di primo grado?', answer: 'Isola la variabile spostando i termini e semplificando. Verifica il risultato sostituendolo nell’equazione originale.' },
          { question: 'Qual è il metodo per una disequazione?', answer: 'Rispetta il segno dell’inequazione mentre risolvi e ricorda di cambiare il segno quando moltiplichi o dividi per un numero negativo.' }
        ],
        questions: [
          { question: 'Qual è il valore di x in 2x + 3 = 11?', options: ['4', '5', '6', '7'], answer: 0 },
          { question: 'Quale figura ha tutti i lati congruenti e angoli retti?', options: ['Trapezio', 'Rettangolo', 'Quadrato', 'Parallelogramma'], answer: 2 },
          { question: 'Qual è la formula dell’area del cerchio?', options: ['2πr', 'πr²', 'πd', 'r²'], answer: 1 }
        ]
      },
      storia: {
        label: 'Storia',
        summary: 'Questa foto sembra contenere appunti di storia. Qui trovi un quadro generale dell’argomento e i punti cronologici più importanti.',
        details: 'La storia si basa su eventi collegati nel tempo, cause e conseguenze. Quando studi, cerca di mappare date, personaggi e trasformazioni sociali per creare una narrazione coerente.',
        faq: [
          { question: 'Come collegare due eventi storici?', answer: 'Cerca la relazione di causa-effetto e le trasformazioni sociali o politiche che ne derivano.' },
          { question: 'Qual è il modo migliore per ricordare le date?', answer: 'Associa le date a eventi chiave e crea una linea del tempo mentale o visiva.' }
        ],
        questions: [
          { question: 'In quale anno iniziò la Rivoluzione francese?', options: ['1776', '1789', '1804', '1815'], answer: 1 },
          { question: 'Chi fu il leader principale della Rivoluzione russa del 1917?', options: ['Lenin', 'Stalin', 'Trotsky', 'Gorbaciov'], answer: 0 },
          { question: 'Quale processo storico descrive la fine del Medioevo?', options: ['Rinascimento', 'Illuminismo', 'Rivoluzione industriale', 'Età del bronzo'], answer: 0 }
        ]
      },
      inglese: {
        label: 'Inglese',
        summary: 'Questa foto sembra contenere appunti di inglese. Ti spiego le regole principali, le strutture grammaticali e i suggerimenti per la traduzione.',
        details: 'Lo studio dell’inglese richiede attenzione a tempi verbali, vocabolario e collocazioni. Leggi frasi complete e prova a parafrasare i contenuti per fissare meglio le regole.' ,
        faq: [
          { question: 'Come funzionano i tempi progressivi in inglese?', answer: 'I tempi progressivi usano il verbo “to be” + verbo in -ing per indicare un’azione in corso.' },
          { question: 'Qual è la differenza tra “will” e “going to”?', answer: '“Will” presenta una decisione spontanea, mentre “going to” indica un piano o un’intenzione già formata.' }
        ],
        questions: [
          { question: 'Qual è il passato del verbo “to go”?', options: ['Goed', 'Went', 'Gone', 'Go'], answer: 1 },
          { question: 'Quale frase è corretta?', options: ['She don’t like pizza.', 'She doesn’t like pizza.', 'She didn’t likes pizza.', 'She hadn’t liked pizza.'], answer: 1 },
          { question: 'Quale parola è un avverbio?', options: ['Happy', 'Slowly', 'Friend', 'Tall'], answer: 1 }
        ]
      },
      altro: {
        label: 'Altro',
        summary: 'Caricando una foto, il sistema elabora il contenuto e offre spiegazioni personalizzate. Se non è chiaro, aggiungi un dettaglio per meglio definire il contenuto.',
        details: 'Descrivi brevemente il contenuto o lascia che l’AI interpreti la foto. Puoi poi fare domande per approfondire e usare il quiz per esercitarti.',
        faq: [
          { question: 'Cosa devo fare dopo aver caricato la foto?', answer: 'Leggi la spiegazione che l’AI ha generato. Poi usa il Q&A per chiarire i dubbi e genera il quiz per allenarti.' },
          { question: 'Posso scegliere più domande?', answer: 'Sì. Scegli il numero di domande che preferisci e il sistema genera un quiz sul tema selezionato.' }
        ],
        questions: [
          { question: 'Qual è il primo passo dopo aver studiato un argomento?', options: ['Rileggerlo tre volte', 'Chiederne una spiegazione', 'Fare un riassunto', 'Ignorarlo'], answer: 2 },
          { question: 'Come si prepara meglio un ripasso?', options: ['Con una sola lettura', 'Ripetendo e facendo domande', 'Solo ascoltando', 'Solo memorizzando'], answer: 1 },
          { question: 'Perché è utile fare domande sul testo?', options: ['Aiuta a capire meglio', 'Serve solo a perdere tempo', 'È inutile', 'Complica lo studio'], answer: 0 }
        ]
      }
    };
  }

  renderInitialState() {
    this.explanationSection.classList.add('hidden');
    this.qaSection.classList.add('hidden');
    this.quizSection.classList.add('hidden');
    this.quizResult.classList.add('hidden');
  }

  handleDragEnter(e) {
    e.preventDefault();
    this.dropZone.classList.add('dragover');
  }

  handleDragOver(e) {
    e.preventDefault();
    this.dropZone.classList.add('dragover');
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.dropZone.classList.remove('dragover');
  }

  handleDrop(e) {
    e.preventDefault();
    this.dropZone.classList.remove('dragover');
    this.handleFiles(e.dataTransfer.files);
  }

  handleFiles(files) {
    if (!files || !files.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Seleziona un file immagine (JPG, PNG, GIF).');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    this.photoPreview.src = imageUrl;
    this.photoPreview.alt = file.name;
    this.photoPreview.classList.remove('hidden');
    this.uploadedFileName.textContent = file.name;
    this.previewMeta.classList.remove('hidden');
    this.dropZone.classList.add('has-image');

    this.currentTopic = this.guessTopicFromName(file.name, this.notesInput.value);
    this.updateExplanation();
    this.explanationSection.classList.remove('hidden');
    this.qaSection.classList.remove('hidden');
    this.quizSection.classList.remove('hidden');
    this.appendSystemMessage('Foto caricata correttamente. L’AI sta preparando una spiegazione in base al contenuto dell’immagine.');
  }

  guessTopicFromName(name, notes = '') {
    const lower = (name + ' ' + notes).toLowerCase();
    if (/(bio|cell|fotosintesi|mitocondri|dna|batteri|enzima|flora|fauna)/.test(lower)) return 'biologia';
    if (/(math|matematica|equazione|geometria|funzione|algebra|calcolo|aritmetica|derivata|integrale)/.test(lower)) return 'matematica';
    if (/(storia|rivoluzione|guerra|secolo|roma|medioevo|rinascimento|antica|impero|parlamento)/.test(lower)) return 'storia';
    if (/(inglese|english|vocabulary|grammar|tense|verb|adjective|noun|pronoun|translate|traduci)/.test(lower)) return 'inglese';
    return 'altro';
  }

  updateExplanation() {
    const knowledge = this.knowledgeBank[this.currentTopic] || this.knowledgeBank.altro;
    const userNotes = this.notesInput.value.trim();
    const explanationText = this.getExplanationFromPhoto(this.uploadedFileName.textContent, userNotes, knowledge);
    this.explanationArea.innerHTML = `
      <div class="explanation-box">
        <strong>Spiegazione AI del contenuto</strong>
        ${explanationText}
      </div>
    `;
  }

  getExplanationFromPhoto(fileName, notes, knowledge) {
    const fileLabel = fileName && fileName !== 'Nessun file selezionato' ? `<p><strong>Immagine:</strong> ${fileName}</p>` : '';
    const noteText = notes ? `<p><strong>Informazioni aggiuntive:</strong> ${notes}</p>` : '';
    const detailText = notes ? notes : 'Non sono presenti altri dettagli nel campo note.';
    const generic = knowledge.label === 'Altro';

    return `
      ${fileLabel}
      <p>${generic ? 'Sto interpretando la foto come un appunto generico.' : `Questa foto sembra contenere contenuti di ${knowledge.label}.`}</p>
      <p>${knowledge.summary}</p>
      <p>${knowledge.details}</p>
      ${noteText}
      <p>Dettaglio usato per l’interpretazione: ${detailText}</p>
      <p>Se vuoi, chiedimi di spiegare un concetto specifico o indica una parola chiave presente nella foto.</p>
    `;
  }

  appendMessage(text, type = 'system') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `<p>${text}</p>`;
    this.qaList.appendChild(message);
    this.qaList.scrollTop = this.qaList.scrollHeight;
  }

  appendUserMessage(text) {
    this.appendMessage(text, 'user');
  }

  appendSystemMessage(text) {
    this.appendMessage(text, 'system');
  }

  handleQuestion() {
    const question = this.askInput.value.trim();
    if (!question) return;
    this.appendUserMessage(question);
    this.askInput.value = '';
    const answer = this.generateAnswer(question);
    setTimeout(() => this.appendSystemMessage(answer), 300);
  }

  generateAnswer(question) {
    const normalized = question.toLowerCase();
    const knowledge = this.knowledgeBank[this.currentTopic] || this.knowledgeBank.altro;
    const details = this.notesInput.value.trim();
    const fileName = this.uploadedFileName.textContent;
    const base = `${knowledge.summary} ${knowledge.details}`;

    if (/(cos|ché|che|chi|quando|dove|perché|perchè|perche|come|qual|quale|quali)/.test(normalized)) {
      if (knowledge.faq.length) {
        for (const faq of knowledge.faq) {
          if (normalized.includes(faq.question.split(' ')[0].toLowerCase()) || normalized.includes('definiz')) {
            return faq.answer;
          }
        }
      }
      return `In base alla foto e ai dettagli forniti, ti consiglio di concentrarti su questo: ${base}. Se vuoi posso spiegarti meglio un punto specifico.`;
    }

    if (/esempio|applicazione|uso|come/.test(normalized)) {
      return `Un esempio pratico in questo contesto è cercare di trasformare le informazioni in una domanda. Ad esempio, se la foto parla di ${knowledge.label}, prova a identificare il processo principale e descriverlo con parole tue.`;
    }

    if (/riassum|sintesi|riassunto|sintetizzare/.test(normalized)) {
      return `Riassumendo: la foto sembra parlare di ${knowledge.label}. ${details ? `Hai aggiunto anche questo dettaglio: ${details}. ` : ''}Concentrati sui concetti chiave e ripassa con domande come quella che hai appena scritto.`;
    }

    if (/quiz|domand|esame|test/.test(normalized)) {
      return `Genera un quiz e scegli quante domande vuoi. Il quiz verrà creato in base a ciò che l’AI ha capito dalla foto e dai dettagli che hai fornito.`;
    }

    return `Sto valutando la foto e le informazioni caricate. ${knowledge.summary} ${details ? `Inoltre, hai aggiunto: ${details}.` : 'Se vuoi, aggiungi una breve descrizione per rendere la spiegazione più precisa.'} Se vuoi, chiedimi di approfondire un concetto specifico.`;
  }

  createQuiz() {
    const count = Number(this.quizCount.value) || 3;
    const knowledge = this.knowledgeBank[this.currentTopic] || this.knowledgeBank.altro;
    const available = this.shuffleArray([...knowledge.questions]);
    const questions = available.slice(0, count);

    if (questions.length < count) {
      questions.push(...this.generateFallbackQuestions(count - questions.length, knowledge));
    }

    this.currentQuestions = this.shuffleArray(questions).slice(0, count);
    this.renderQuiz();
    this.quizResult.classList.add('hidden');
    this.quizSubmitBtn.classList.remove('hidden');
    this.quizSubmitBtn.disabled = false;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generateFallbackQuestions(count, knowledge) {
    const topic = knowledge.label;
    const notes = this.notesInput.value.trim() || 'contenuti mostrati nella foto';
    const templates = [
      {
        question: `Di che tipo di contenuto sembra parlare la foto?`,
        options: [topic, 'Un diagramma generico', 'Una lista di verifica', 'Una poesia'],
        answer: 0
      },
      {
        question: `Quale elemento è importante per comprendere questa immagine?`,
        options: ['Il concetto principale', 'Il formato del file', 'Il colore del bordo', 'La dimensione del foglio'],
        answer: 0
      },
      {
        question: `Se dovessi riassumere la foto in una parola, quale sarebbe?`,
        options: [topic, 'Dettaglio', 'Colore', 'Font'],
        answer: 0
      },
      {
        question: `In base ai dettagli forniti, cosa dovresti fare dopo aver letto gli appunti?`,
        options: ['Ripassare i concetti', 'Cambiare argomento', 'Ignorare la foto', 'Stampare il documento'],
        answer: 0
      },
      {
        question: `Quale informazione aggiuntiva può aiutare l’AI a spiegare meglio la foto?`,
        options: ['Una parola chiave', 'La data del file', 'La dimensione dell’immagine', 'Il colore di sfondo'],
        answer: 0
      }
    ];

    return this.shuffleArray(templates).slice(0, count);
  }

  renderQuiz() {
    this.quizContainer.innerHTML = '';
    if (!this.currentQuestions.length) {
      this.quizContainer.innerHTML = '<p style="color: var(--muted);">Nessuna domanda disponibile per questo contenuto.</p>';
      return;
    }
    this.currentQuestions.forEach((item, index) => {
      const questionCard = document.createElement('div');
      questionCard.className = 'quiz-card';
      questionCard.innerHTML = `
        <div class="quiz-question">
          <h4>Domanda ${index + 1}</h4>
          <p>${item.question}</p>
          <div class="quiz-options" data-question-index="${index}">
            ${item.options.map((option, optionIndex) => `
              <label>
                <input type="radio" name="question-${index}" value="${optionIndex}" />
                <span>${option}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
      this.quizContainer.appendChild(questionCard);
    });
  }

  checkQuiz() {
    const answers = Array.from(this.quizContainer.querySelectorAll('.quiz-options')).map((optionsEl, index) => {
      const selected = optionsEl.querySelector('input:checked');
      return selected ? Number(selected.value) : null;
    });

    const total = this.currentQuestions.length;
    const correctCount = answers.reduce((count, answer, index) => {
      if (answer === this.currentQuestions[index].answer) {
        return count + 1;
      }
      return count;
    }, 0);

    const scorePercent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    const victory = scorePercent >= 70;
    this.quizResult.innerHTML = `
      <div class="quiz-result${victory ? ' victory' : ''}">
        <strong>Risultato quiz</strong>
        <p>Hai risposto correttamente a ${correctCount} domande su ${total} (${scorePercent}%).</p>
        <p>${victory ? 'Ottimo lavoro! 😊 Sei pronto a continuare con altre domande.' : 'Non male, ma puoi sempre migliorare. Rivedi la spiegazione e poi chiedi altre chiarificazioni.'}</p>
      </div>
    `;
    this.quizResult.classList.remove('hidden');
    this.quizSubmitBtn.disabled = true;
    this.appendSystemMessage(victory ? 'Complimenti! Se vuoi, continua con il Q&A o genera un nuovo quiz.' : 'Prova a chiedermi un approfondimento sui punti che vuoi chiarire.');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
      themeToggle.setAttribute('aria-label', document.body.classList.contains('dark') ? 'Attiva modalità chiara' : 'Attiva modalità scura');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
  }

  if (document.body.classList.contains('dark')) {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', 'Attiva modalità chiara');
    }
  }

  new FotoPageManager();
});
