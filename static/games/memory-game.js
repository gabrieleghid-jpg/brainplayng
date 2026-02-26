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
            isProcessing: false
        };
        
        // Configurazione gioco
        this.CARD_SYMBOLS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻'];
        this.LEVEL_CONFIG = {
            'facile': {'pairs': 4, 'time_bonus': 100},
            'medio': {'pairs': 6, 'time_bonus': 150},
            'difficile': {'pairs': 8, 'time_bonus': 200}
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
        const pairs = this.LEVEL_CONFIG[this.gameState.level]['pairs'];
        
        // Crea carte duplicate
        const symbols = this.CARD_SYMBOLS.slice(0, pairs);
        this.gameState.cards = [...symbols, ...symbols];
        
        // Mischia le carte
        this.shuffleArray(this.gameState.cards);
        
        // Resetta lo stato
        this.gameState.flipped = [];
        this.gameState.matched = [];
        this.gameState.moves = 0;
        this.gameState.score = 0;
        this.gameState.isProcessing = false;
        
        this.updateDisplay();
        this.renderGameBoard();
        this.updatePairsDisplay();
        
        // Aggiorna la griglia in base al livello
        const board = document.getElementById('gameBoard');
        board.className = `game-board ${this.gameState.level}`;
    }
    
    // Algoritmo Fisher-Yates per mescolare array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
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
        if (this.gameState.isProcessing) return;
        if (this.gameState.flipped.includes(index) || this.gameState.matched.includes(index)) return;
        if (this.gameState.flipped.length >= 2) return;
        
        // Conta la mossa solo quando si clicca una carta
        this.gameState.moves++;
        this.updateDisplay();
        
        const card = document.querySelector(`[data-index="${index}"]`);
        card.classList.add('flipped');
        this.gameState.flipped.push(index);
        
        if (this.gameState.flipped.length === 2) {
            this.gameState.isProcessing = true;
            this.checkMatch();
        }
    }
    
    // Controlla se le carte corrispondono
    checkMatch() {
        const [card1, card2] = this.gameState.flipped;
        
        if (this.gameState.cards[card1] === this.gameState.cards[card2]) {
            // Le carte corrispondono
            setTimeout(() => {
                this.handleMatch(card1, card2);
            }, 600);
        } else {
            // Le carte non corrispondono, rigirale
            setTimeout(() => {
                this.handleMismatch(card1, card2);
            }, 1000);
        }
    }
    
    // Gestisce le carte corrispondenti
    handleMatch(card1, card2) {
        this.gameState.matched.push(card1, card2);
        this.gameState.flipped = [];
        
        // Aggiungi animazione di match
        document.querySelector(`[data-index="${card1}"]`).classList.add('matched');
        document.querySelector(`[data-index="${card2}"]`).classList.add('matched');
        
        // Calcola punteggio
        const timeBonus = this.LEVEL_CONFIG[this.gameState.level]['time_bonus'];
        this.gameState.score += timeBonus - (this.gameState.moves * 2);
        
        this.updateDisplay();
        this.updatePairsDisplay();
        
        // Controlla vittoria
        if (this.gameState.matched.length === this.gameState.cards.length) {
            this.showVictory();
        }
        
        this.gameState.isProcessing = false;
    }
    
    // Gestisce le carte non corrispondenti
    handleMismatch(card1, card2) {
        document.querySelector(`[data-index="${card1}"]`).classList.remove('flipped');
        document.querySelector(`[data-index="${card2}"]`).classList.remove('flipped');
        this.gameState.flipped = [];
        this.gameState.isProcessing = false;
    }
    
    // Aggiorna il display
    updateDisplay() {
        document.getElementById('moves').textContent = this.gameState.moves;
        document.getElementById('score').textContent = this.gameState.score;
    }
    
    // Aggiorna il display delle coppie
    updatePairsDisplay() {
        const totalPairs = this.gameState.cards.length / 2;
        const foundPairs = this.gameState.matched.length / 2;
        document.getElementById('pairs').textContent = `${foundPairs}/${totalPairs}`;
    }
    
    // Mostra la vittoria
    showVictory() {
        document.getElementById('finalMoves').textContent = this.gameState.moves;
        document.getElementById('finalScore').textContent = this.gameState.score;
        document.getElementById('finalTime').textContent = Math.floor(this.gameState.moves * 2);
        document.getElementById('victoryModal').style.display = 'flex';
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
