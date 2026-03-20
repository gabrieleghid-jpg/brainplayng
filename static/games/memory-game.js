// Responsabile: Game Developer - Logica JavaScript del Memory Game
// Gestisce tutta l'interattività e la logica del gioco di memoria

class MemoryGame {
    constructor() {
        this.gameState = {
            cards: [],
            flipped: [],
            matched: [],
            moves: 0,
            score: 0,
            level: 'facile',
            isProcessing: false,
            startTime: null,
            elapsedTime: 0,
            timerInterval: null
        };
        
        // Configurazione gioco
        this.CARD_SYMBOLS = [
            '🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻',
            '🎲', '🎳', '🎯', '🎪', '🎭', '🎮', '🎨', '🎸',
            '🎺', '🎻', '🎲', '🎳', '🎰', '🎱', '🎲', '🎳',
            '🎯', '🎪', '🎭', '🎮', '🎨', '🎸'
        ];
        this.LEVEL_CONFIG = {
            'facile': {
                'pairs': 6, 
                'grid_cols': 4, 
                'grid_rows': 3,
                'time_bonus': 100,
                'max_width': '450px'
            },
            'medio': {
                'pairs': 8, 
                'grid_cols': 4, 
                'grid_rows': 4,
                'time_bonus': 150,
                'max_width': '500px'
            },
            'difficile': {
                'pairs': 15, 
                'grid_cols': 6, 
                'grid_rows': 5,
                'time_bonus': 200,
                'max_width': '700px'
            }
        };
        
        this.init();
    }
    
    // Inizializza il gioco
    init() {
        console.log('Memory Game: Inizializzazione...');
        
        // Verifica che gli elementi DOM esistano
        const gameBoard = document.getElementById('gameBoard');
        const movesElement = document.getElementById('moves');
        const scoreElement = document.getElementById('score');
        
        if (!gameBoard) {
            console.error('Memory Game: Elemento gameBoard non trovato!');
            return;
        }
        if (!movesElement) {
            console.error('Memory Game: Elemento moves non trovato!');
            return;
        }
        if (!scoreElement) {
            console.error('Memory Game: Elemento score non trovato!');
            return;
        }
        
        console.log('Memory Game: Elementi DOM trovati, procedo...');
        
        this.setupLevelButtons();
        this.startNewGame();
    }
    
    // Configura i pulsanti di livello
    setupLevelButtons() {
        console.log('Memory Game: Configurazione pulsanti livello...');
        
        const buttons = document.querySelectorAll('.level-btn');
        console.log('Memory Game: Trovati', buttons.length, 'pulsanti livello');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Memory Game: Click su livello', btn.dataset.level);
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.gameState.level = btn.dataset.level;
                this.startNewGame();
            });
        });
    }
    
    // Inizia una nuova partita
    startNewGame() {
        console.log('Memory Game: Inizio nuova partita, livello:', this.gameState.level);
        
        // Ferma il timer precedente
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        const config = this.LEVEL_CONFIG[this.gameState.level];
        const pairs = config['pairs'];
        
        console.log('Memory Game: Configurazione livello', config);
        console.log('Memory Game: Numero coppie', pairs);
        
        // Resetta lo stato PRIMA di creare le carte
        this.gameState.flipped = [];
        this.gameState.matched = [];
        this.gameState.moves = 0;
        this.gameState.score = 0;
        this.gameState.isProcessing = false;
        this.gameState.startTime = Date.now();
        this.gameState.elapsedTime = 0;
        
        console.log('Memory Game: Stato resettato');
        
        // Crea carte duplicate
        const symbols = this.CARD_SYMBOLS.slice(0, pairs);
        const cards = [...symbols, ...symbols];
        
        // Mescola le carte con l'algoritmo migliorato
        this.gameState.cards = this.shuffleArray(cards);
        
        console.log('Memory Game: Carte mescolate', this.gameState.cards.length);
        
        // Inizializza il timer
        this.startTimer();
        
        this.updateDisplay();
        this.renderGameBoard();
        this.updatePairsDisplay();
        
        console.log('Memory Game: Partita avviata! Gioco pronto!');
        
        // Aggiorna la griglia in base al livello
        const board = document.getElementById('gameBoard');
        board.className = `game-board ${this.gameState.level}`;
        
        // Resetta isProcessing dopo un breve delay per assicurarsi che il gioco sia pronto
        setTimeout(() => {
            this.gameState.isProcessing = false;
            console.log('Memory Game: Gioco completamente pronto per interazione!');
        }, 100);
    }
    
    // Algoritmo Fisher-Yates migliorato per mescolare array
    shuffleArray(array) {
        // Crea una copia per evitare modifiche all'array originale
        const shuffled = [...array];
        
        // Mescolamento Fisher-Yates con randomizzazione crittografica
        for (let i = shuffled.length - 1; i > 0; i--) {
            // Usa crypto.getRandomValues per migliore casualità se disponibile
            let randomIndex;
            if (window.crypto && window.crypto.getRandomValues) {
                const randomBuffer = new Uint32Array(1);
                window.crypto.getRandomValues(randomBuffer);
                randomIndex = Math.floor((randomBuffer[0] / (0xFFFFFFFF + 1)) * (i + 1));
            } else {
                // Fallback a Math.random
                randomIndex = Math.floor(Math.random() * (i + 1));
            }
            
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
        
        return shuffled;
    }
    
    // Renderizza il tabellone di gioco
    renderGameBoard() {
        const board = document.getElementById('gameBoard');
        board.innerHTML = '';
        
        console.log('Memory Game: Renderizzo board con', this.gameState.cards.length, 'carte');
        
        this.gameState.cards.forEach((symbol, index) => {
            const card = this.createCard(symbol, index);
            board.appendChild(card);
        });
        
        // IMPORTANTE: Applica event delegation dopo aver creato le carte
        this.setupCardEventListeners();
        
        console.log('Memory Game: Board renderizzata, event listeners applicati');
    }
    
    // Configura gli event listeners per le carte (Event Delegation)
    setupCardEventListeners() {
        const board = document.getElementById('gameBoard');
        
        // Rimuovi event listener precedente per evitare duplicati
        board.removeEventListener('click', this.handleCardClick);
        
        // Aggiungi event listener con delegation
        this.handleCardClick = (event) => {
            const card = event.target.closest('.card');
            if (!card) return;
            
            const index = parseInt(card.dataset.index);
            console.log('Memory Game: Card clicked!', index);
            
            if (!isNaN(index)) {
                this.flipCard(index);
            }
        };
        
        board.addEventListener('click', this.handleCardClick);
        
        console.log('Memory Game: Event delegation configurata sul board');
    }
    
    // Crea una singola carta
    createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        // NON usare onclick qui - useremo event delegation
        // card.onclick = () => this.flipCard(index);
        
        card.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${symbol}</div>
        `;
        
        // Debug: assicuriamoci che la carta sia cliccabile
        card.style.cursor = 'pointer';
        card.style.pointerEvents = 'auto';
        
        return card;
    }
    
    // Gira una carta
    flipCard(index) {
        console.log('Memory Game: flipCard called with index', index);
        console.log('Memory Game: isProcessing:', this.gameState.isProcessing);
        console.log('Memory Game: flipped:', this.gameState.flipped);
        console.log('Memory Game: matched:', this.gameState.matched);
        
        // Blocca qualsiasi azione durante il processing
        if (this.gameState.isProcessing) {
            console.log('Memory Game: Bloccato - isProcessing attivo');
            return;
        }
        
        // Impedisci di cliccare carte già girate o già accoppiate
        if (this.gameState.flipped.includes(index) || this.gameState.matched.includes(index)) {
            console.log('Memory Game: Carta già girata o accoppiata');
            return;
        }
        
        // Impedisci di cliccare più di due carte contemporaneamente
        if (this.gameState.flipped.length >= 2) {
            console.log('Memory Game: Già 2 carte girate');
            return;
        }
        
        console.log('Memory Game: Giro carta', index);
        
        // Gira la carta
        const card = document.querySelector(`[data-index="${index}"]`);
        if (!card) {
            console.error('Memory Game: Carta non trovata!', index);
            return;
        }
        
        card.classList.add('flipped');
        this.gameState.flipped.push(index);
        
        console.log('Memory Game: Carta girata, flipped array:', this.gameState.flipped);
        
        // Controlla se sono state girate due carte
        if (this.gameState.flipped.length === 2) {
            console.log('Memory Game: Due carte girate, attendo check...');
            this.gameState.isProcessing = true;
            this.gameState.moves++; // Incrementa mosse solo per coppia
            this.updateDisplay();
            
            // Controlla la corrispondenza dopo un breve delay per permettere all'utente di vedere
            setTimeout(() => {
                this.checkMatch();
            }, 500);
        }
    }
    
    // Controlla se le carte corrispondono
    checkMatch() {
        const [card1, card2] = this.gameState.flipped;
        
        if (this.gameState.cards[card1] === this.gameState.cards[card2]) {
            // Le carte corrispondono - gestisci immediatamente
            this.handleMatch(card1, card2);
        } else {
            // Le carte non corrispondono - mostra per 1 secondo poi rigira
            setTimeout(() => {
                this.handleMismatch(card1, card2);
            }, 1000);
        }
    }
    
    // Gestisce le carte corrispondenti
    handleMatch(card1, card2) {
        // Aggiungi alle carte accoppiate
        this.gameState.matched.push(card1, card2);
        this.gameState.flipped = [];
        
        // Aggiungi animazione di match e blocca le carte
        const card1Element = document.querySelector(`[data-index="${card1}"]`);
        const card2Element = document.querySelector(`[data-index="${card2}"]`);
        
        card1Element.classList.add('matched');
        card2Element.classList.add('matched');
        
        // Rimuovi evento click per le carte accoppiate
        card1Element.style.pointerEvents = 'none';
        card2Element.style.pointerEvents = 'none';
        
        // Calcola punteggio (bonus di tempo meno penalità mosse)
        const timeBonus = this.LEVEL_CONFIG[this.gameState.level]['time_bonus'];
        const movePenalty = this.gameState.moves * 5;
        const scoreGain = Math.max(10, timeBonus - movePenalty); // Minimo 10 punti
        this.gameState.score += scoreGain;
        
        this.updateDisplay();
        this.updatePairsDisplay();
        
        // Controlla vittoria
        if (this.gameState.matched.length === this.gameState.cards.length) {
            setTimeout(() => {
                this.showVictory();
            }, 500);
        }
        
        this.gameState.isProcessing = false;
    }
    
    // Gestisce le carte non corrispondenti
    handleMismatch(card1, card2) {
        // Rigira le carte con animazione
        const card1Element = document.querySelector(`[data-index="${card1}"]`);
        const card2Element = document.querySelector(`[data-index="${card2}"]`);
        
        card1Element.classList.remove('flipped');
        card2Element.classList.remove('flipped');
        
        // Resetta le carte girate
        this.gameState.flipped = [];
        this.gameState.isProcessing = false;
    }
    
    // Aggiorna il display
    updateDisplay() {
        document.getElementById('moves').textContent = this.gameState.moves;
        document.getElementById('score').textContent = this.gameState.score;
        
        // Aggiorna anche il display del tempo se esiste
        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.textContent = this.formatTime(this.gameState.elapsedTime);
        }
    }
    
    // Aggiorna il display delle coppie
    updatePairsDisplay() {
        const totalPairs = this.gameState.cards / 2;
        const foundPairs = this.gameState.matched / 2;
        document.getElementById('pairs').textContent = `${foundPairs}/${totalPairs}`;
    }
    
    // Mostra la vittoria
    showVictory() {
        document.getElementById('finalMoves').textContent = this.gameState.moves;
        document.getElementById('finalScore').textContent = this.gameState.score;
        document.getElementById('finalTime').textContent = Math.floor(this.gameState.moves * 2);
        document.getElementById('victoryModal').style.display = 'flex';
        
        // Salva il punteggio nella leaderboard globale
        this.saveScoreToLeaderboard();
        
        // Salva la partita nello storico dell'utente
        this.saveGameToHistory();
    }
    
    // Salva la partita nello storico dell'utente
    async saveGameToHistory() {
        try {
            const gameData = {
                score: this.gameState.score,
                moves: this.gameState.moves,
                difficulty: this.gameState.level,
                time: this.gameState.elapsedTime,
                completed: true,
                pairs_found: this.gameState.matched.length / 2,
                total_pairs: this.gameState.cards.length / 2
            };
            
            const response = await fetch('/auth/api/user/add-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'memory',
                    data: gameData
                })
            });
            
            if (response.ok) {
                console.log('Partita salvata nello storico');
            }
        } catch (error) {
            console.error('Errore nel salvare la partita:', error);
        }
    }
    
    // Salva il punteggio nella leaderboard globale
    saveScoreToLeaderboard() {
        // Ottieni il nome utente (da sessionStorage o prompt)
        let username = sessionStorage.getItem('username');
        
        if (!username) {
            // Se non c'è un nome utente, chiedilo
            username = prompt('Inserisci il tuo nome per la classifica:') || 'Anonimo';
            sessionStorage.setItem('username', username);
        }
        
        // Emetti l'evento per aggiornare la leaderboard
        const event = new CustomEvent('updateScore', {
            detail: {
                username: username,
                score: this.gameState.score,
                gameName: 'Memory Game'
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Formatta il tempo in MM:SS
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Mostra la classifica
    showLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        
        if (leaderboard.style.display === 'none') {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';
            
            const sampleData = [
                {name: 'Player1', score: 850, level: 'difficile'},
                {name: 'Player2', score: 720, level: 'medio'},
                {name: 'Player3', score: 650, level: 'facile'}
            ];
            
            sampleData.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                item.innerHTML = `
                    <span>${index + 1}. ${entry.name}</span>
                    <span>${entry.score} pts - ${entry.level}</span>
                `;
                leaderboardList.appendChild(item);
            });
            
            leaderboard.style.display = 'block';
        } else {
            leaderboard.style.display = 'none';
        }
    }
    
    // Funzioni globali per accesso dall'HTML
    closeVictory() {
        document.getElementById('victoryModal').style.display = 'none';
        this.startNewGame();
    }
}

// Funzioni globali per i pulsanti HTML
let game;

function startNewGame() {
    if (game) {
        game.startNewGame();
    }
}

function showLeaderboard() {
    if (game) {
        game.showLeaderboard();
    }
}

function closeVictory() {
    if (game) {
        game.closeVictory();
    }
}

// Inizializza il gioco quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    console.log('Memory Game: DOM caricato, inizializzo...');
    
    // Forza l'inizializzazione immediata
    setTimeout(() => {
        console.log('Memory Game: Timeout scaduto, creo gioco...');
        game = new MemoryGame();
        
        // Forza l'avvio di una nuova partita dopo l'inizializzazione
        setTimeout(() => {
            console.log('Memory Game: Forzo avvio partita...');
            if (game) {
                game.startNewGame();
            }
        }, 500);
    }, 100);
});
