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
        this.setupLevelButtons();
        this.startNewGame();
    }
    
    // Configura i pulsanti di livello
    setupLevelButtons() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.gameState.level = btn.dataset.level;
                this.startNewGame();
            });
        });
    }
    
    // Inizia una nuova partita
    startNewGame() {
        // Ferma il timer precedente
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        const pairs = this.LEVEL_CONFIG[this.gameState.level]['pairs'];
        
        // Crea carte duplicate
        const symbols = this.CARD_SYMBOLS.slice(0, pairs);
        const cards = [...symbols, ...symbols];
        
        // Mescola le carte con l'algoritmo migliorato
        this.gameState.cards = this.shuffleArray(cards);
        
        // Resetta lo stato
        this.gameState.flipped = [];
        this.gameState.matched = [];
        this.gameState.moves = 0;
        this.gameState.score = 0;
        this.gameState.isProcessing = false;
        this.gameState.startTime = Date.now();
        this.gameState.elapsedTime = 0;
        
        // Inizializza il timer
        this.startTimer();
        
        this.updateDisplay();
        this.renderGameBoard();
        this.updatePairsDisplay();
        
        // Aggiorna la griglia in base al livello
        const board = document.getElementById('gameBoard');
        board.className = `game-board ${this.gameState.level}`;
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
        
        this.gameState.cards.forEach((symbol, index) => {
            const card = this.createCard(symbol, index);
            board.appendChild(card);
        });
    }
    
    // Crea una singola carta
    createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.onclick = () => this.flipCard(index);
        
        card.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${symbol}</div>
        `;
        
        return card;
    }
    
    // Gira una carta
    flipCard(index) {
        // Blocca qualsiasi azione durante il processing
        if (this.gameState.isProcessing) return;
        
        // Impedisci di cliccare carte già girate o già accoppiate
        if (this.gameState.flipped.includes(index) || this.gameState.matched.includes(index)) return;
        
        // Impedisci di cliccare più di due carte contemporaneamente
        if (this.gameState.flipped.length >= 2) return;
        
        // Gira la carta
        const card = document.querySelector(`[data-index="${index}"]`);
        card.classList.add('flipped');
        this.gameState.flipped.push(index);
        
        // Controlla se sono state girate due carte
        if (this.gameState.flipped.length === 2) {
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
        const totalPairs = this.gameState.cards.length / 2;
        const foundPairs = this.gameState.matched.length / 2;
        document.getElementById('pairs').textContent = `${foundPairs}/${totalPairs}`;
    }
    
    // Mostra la vittoria
    showVictory() {
        // Ferma il timer
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        document.getElementById('finalMoves').textContent = this.gameState.moves;
        document.getElementById('finalScore').textContent = this.gameState.score;
        document.getElementById('finalTime').textContent = this.formatTime(this.gameState.elapsedTime);
        document.getElementById('victoryModal').style.display = 'flex';
    }
    
    // Inizializza il timer di gioco
    startTimer() {
        this.gameState.timerInterval = setInterval(() => {
            this.gameState.elapsedTime = Math.floor((Date.now() - this.gameState.startTime) / 1000);
            this.updateDisplay();
        }, 1000);
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
    game = new MemoryGame();
});
