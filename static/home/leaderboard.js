// Responsabile: Home Developer - Gestione Classifiche
// Sistema per visualizzare e gestire le classifiche dei migliori punteggi

class LeaderboardManager {
    constructor() {
        this.leaderboardData = [];
        this.currentFilter = 'all';
        this.maxEntries = 100;
        this.init();
    }
    
    // Inizializza il sistema di classifiche
    init() {
        this.loadLeaderboardData();
        this.setupEventListeners();
    }
    
    // Carica i dati delle classifiche (da localStorage o API)
    async loadLeaderboardData() {
        try {
            // Prima prova a caricare da localStorage
            const localData = localStorage.getItem('brainplayng_leaderboard');
            if (localData) {
                this.leaderboardData = JSON.parse(localData);
            } else {
                // Se non ci sono dati locali, carica dati di esempio
                this.loadSampleData();
            }
            
            // Ordina per punteggio decrescente
            this.sortLeaderboard();
            
        } catch (error) {
            console.error('Errore nel caricamento delle classifiche:', error);
            this.loadSampleData();
        }
    }
    
    // Carica dati di esempio per la leaderboard
    loadSampleData() {
        const sampleUsers = [
            'Marco_Rossi', 'Laura_Bianchi', 'Giuseppe_Verdi', 'Anna_Neri', 'Paolo_Gialli',
            'Sofia_Blu', 'Alessandro_Rosa', 'Chiara_Viola', 'Francesco_Marrone', 'Valentina_Arancione',
            'Davide_Grigio', 'Elena_Nero', 'Simone_Bianco', 'Giulia_Rossa', 'Matteo_Verde',
            'Federica_Gialla', 'Andrea_Blu', 'Sara_Viola', 'Roberto_Marrone', 'Martina_Arancione',
            'Lorenzo_Grigio', 'Beatrice_Nera', 'Filippo_Bianco', 'Alice_Rossa', 'Niccolò_Verde'
        ];
        
        this.leaderboardData = [];
        
        // Genera 100 punteggi di esempio
        for (let i = 0; i < 100; i++) {
            const user = sampleUsers[i % sampleUsers.length] + (i >= sampleUsers.length ? '_' + Math.floor(i / sampleUsers.length) : '');
            const baseScore = 1000 - (i * 8) + Math.floor(Math.random() * 50);
            
            this.leaderboardData.push({
                id: i + 1,
                username: user,
                score: Math.max(baseScore, 50),
                gamesPlayed: Math.floor(Math.random() * 50) + 10,
                bestGame: ['Memory Game', 'Quiz Matematica', 'Puzzle Logico', 'Word Game'][Math.floor(Math.random() * 4)],
                level: ['Principiante', 'Intermedio', 'Avanzato', 'Esperto'][Math.floor(Math.random() * 4)],
                lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                achievements: Math.floor(Math.random() * 20),
                winRate: Math.floor(Math.random() * 40) + 60
            });
        }
        
        this.saveLeaderboardData();
    }
    
    // Ordina la leaderboard per punteggio
    sortLeaderboard() {
        this.leaderboardData.sort((a, b) => b.score - a.score);
        
        // Aggiorna le posizioni
        this.leaderboardData.forEach((player, index) => {
            player.position = index + 1;
        });
    }
    
    // Salva i dati della leaderboard in localStorage
    saveLeaderboardData() {
        try {
            localStorage.setItem('brainplayng_leaderboard', JSON.stringify(this.leaderboardData));
        } catch (error) {
            console.error('Errore nel salvataggio delle classifiche:', error);
        }
    }
    
    // Aggiunge un nuovo punteggio alla leaderboard
    addScore(username, score, gameName) {
        const existingPlayer = this.leaderboardData.find(p => p.username === username);
        
        if (existingPlayer) {
            // Aggiorna il punteggio se è più alto
            if (score > existingPlayer.score) {
                existingPlayer.score = score;
                existingPlayer.bestGame = gameName;
                existingPlayer.lastPlayed = new Date().toISOString();
                existingPlayer.gamesPlayed++;
            }
        } else {
            // Aggiunge nuovo giocatore
            this.leaderboardData.push({
                id: this.leaderboardData.length + 1,
                username: username,
                score: score,
                gamesPlayed: 1,
                bestGame: gameName,
                level: 'Principiante',
                lastPlayed: new Date().toISOString(),
                achievements: 0,
                winRate: 100
            });
        }
        
        this.sortLeaderboard();
        this.saveLeaderboardData();
    }
    
    // Configura gli event listeners
    setupEventListeners() {
        // Ascolta per l'evento di mostrare la leaderboard
        document.addEventListener('showLeaderboard', () => {
            this.showLeaderboardModal();
        });
        
        // Ascolta per l'aggiornamento dei punteggi
        document.addEventListener('updateScore', (event) => {
            const { username, score, gameName } = event.detail;
            this.addScore(username, score, gameName);
        });
    }
    
    // Mostra il modale della leaderboard
    showLeaderboardModal() {
        const modal = this.createLeaderboardModal();
        document.body.appendChild(modal);
        
        // Aggiungi animazione di entrata
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // Carica i dati nella tabella
        this.populateLeaderboard();
    }
    
    // Crea il modale della leaderboard
    createLeaderboardModal() {
        const modal = document.createElement('div');
        modal.className = 'leaderboard-modal';
        modal.innerHTML = `
            <div class="leaderboard-content">
                <div class="leaderboard-header">
                    <h2>🏆 Classifica Globale</h2>
                    <div class="leaderboard-filters">
                        <button class="filter-btn active" data-filter="all">Tutti</button>
                        <button class="filter-btn" data-filter="week">Settimana</button>
                        <button class="filter-btn" data-filter="month">Mese</button>
                    </div>
                    <button class="close-btn" onclick="this.closest('.leaderboard-modal').remove()">×</button>
                </div>
                
                <div class="leaderboard-stats">
                    <div class="stat-item">
                        <span class="stat-number">${this.leaderboardData.length}</span>
                        <span class="stat-label">Giocatori</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.getTotalScore()}</span>
                        <span class="stat-label">Punteggio Totale</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.getAverageScore()}</span>
                        <span class="stat-label">Media Punteggi</span>
                    </div>
                </div>
                
                <div class="leaderboard-table-container">
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Pos</th>
                                <th>Giocatore</th>
                                <th>Punteggio</th>
                                <th>Giochi</th>
                                <th>Miglior Gioco</th>
                                <th>Livello</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboardBody">
                            <!-- I dati verranno inseriti dinamicamente -->
                        </tbody>
                    </table>
                </div>
                
                <div class="leaderboard-pagination">
                    <button class="pagination-btn" onclick="leaderboardManager.previousPage()">←</button>
                    <span class="page-info">Pagina <span id="currentPage">1</span> di <span id="totalPages">5</span></span>
                    <button class="pagination-btn" onclick="leaderboardManager.nextPage()">→</button>
                </div>
            </div>
        `;
        
        // Aggiungi gli event listener per i filtri
        modal.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
                modal.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.populateLeaderboard();
            });
        });
        
        return modal;
    }
    
    // Popola la tabella della leaderboard
    populateLeaderboard() {
        const tbody = document.getElementById('leaderboardBody');
        if (!tbody) return;
        
        const filteredData = this.getFilteredData();
        const page = this.getCurrentPage();
        const startIndex = (page - 1) * 20;
        const endIndex = Math.min(startIndex + 20, filteredData.length);
        
        tbody.innerHTML = '';
        
        for (let i = startIndex; i < endIndex; i++) {
            const player = filteredData[i];
            const row = this.createPlayerRow(player, i + 1);
            tbody.appendChild(row);
        }
        
        this.updatePagination(filteredData.length);
    }
    
    // Crea una riga per un giocatore
    createPlayerRow(player, position) {
        const row = document.createElement('tr');
        row.className = 'leaderboard-row';
        
        // Aggiungi classi speciali per i primi 3
        if (position <= 3) {
            row.classList.add(`top-${position}`);
        }
        
        // Formatta il nome utente per la visualizzazione
        const displayName = player.username.replace(/_/g, ' ');
        
        row.innerHTML = `
            <td class="position-cell">
                ${position <= 3 ? this.getMedalEmoji(position) : position}
            </td>
            <td class="player-cell">
                <div class="player-info">
                    <span class="player-avatar">👤</span>
                    <span class="player-name">${displayName}</span>
                </div>
            </td>
            <td class="score-cell">
                <span class="score-value">${player.score.toLocaleString()}</span>
                <span class="score-label">pts</span>
            </td>
            <td class="games-cell">${player.gamesPlayed}</td>
            <td class="best-game-cell">${player.bestGame}</td>
            <td class="level-cell">
                <span class="level-badge ${player.level.toLowerCase()}">${player.level}</span>
            </td>
        `;
        
        return row;
    }
    
    // Restituisce l'emoji della medaglia
    getMedalEmoji(position) {
        switch(position) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return position;
        }
    }
    
    // Ottiene i dati filtrati
    getFilteredData() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        switch(this.currentFilter) {
            case 'week':
                return this.leaderboardData.filter(p => new Date(p.lastPlayed) >= weekAgo);
            case 'month':
                return this.leaderboardData.filter(p => new Date(p.lastPlayed) >= monthAgo);
            default:
                return this.leaderboardData;
        }
    }
    
    // Imposta il filtro corrente
    setFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
    }
    
    // Ottiene la pagina corrente
    getCurrentPage() {
        return this.currentPage || 1;
    }
    
    // Navigazione paginazione
    nextPage() {
        const filteredData = this.getFilteredData();
        const totalPages = Math.ceil(filteredData.length / 20);
        
        if (this.getCurrentPage() < totalPages) {
            this.currentPage++;
            this.populateLeaderboard();
        }
    }
    
    previousPage() {
        if (this.getCurrentPage() > 1) {
            this.currentPage--;
            this.populateLeaderboard();
        }
    }
    
    // Aggiorna la paginazione
    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / 20);
        document.getElementById('currentPage').textContent = this.getCurrentPage();
        document.getElementById('totalPages').textContent = totalPages;
    }
    
    // Calcola statistiche
    getTotalScore() {
        return this.leaderboardData.reduce((sum, player) => sum + player.score, 0).toLocaleString();
    }
    
    getAverageScore() {
        if (this.leaderboardData.length === 0) return 0;
        const average = this.leaderboardData.reduce((sum, player) => sum + player.score, 0) / this.leaderboardData.length;
        return Math.round(average).toLocaleString();
    }
}

// Funzione globale per mostrare la leaderboard
function showGlobalLeaderboard() {
    if (!window.leaderboardManager) {
        window.leaderboardManager = new LeaderboardManager();
    }
    
    // Emetti l'evento per mostrare la leaderboard
    document.dispatchEvent(new Event('showLeaderboard'));
}

// Inizializza il manager quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    window.leaderboardManager = new LeaderboardManager();
});
