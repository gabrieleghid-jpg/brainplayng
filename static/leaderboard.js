// Responsabile: GABRIELE - Sistema Classifiche
// JavaScript per le classifiche globali con dati reali utenti

// Funzione per mostrare le classifiche globali
function showGlobalLeaderboard() {
    // Crea un modal per le classifiche
    const modal = document.createElement('div');
    modal.className = 'leaderboard-modal';
    modal.innerHTML = `
        <div class="leaderboard-overlay" onclick="closeLeaderboard()"></div>
        <div class="leaderboard-content">
            <div class="leaderboard-header">
                <h2>🏆 Classifiche Globali</h2>
                <button class="close-btn" onclick="closeLeaderboard()">&times;</button>
            </div>
            <div class="leaderboard-info">
                <p>I 100 migliori giocatori per punteggio più alto</p>
            </div>
            <div class="leaderboard-body">
                <div id="global-leaderboard" class="leaderboard-tab active">
                    <div class="leaderboard-loading">
                        <div class="spinner"></div>
                        <p>Caricamento classifiche...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Aggiungi stili CSS
    const style = document.createElement('style');
    style.textContent = `
        .leaderboard-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .leaderboard-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .leaderboard-content {
            position: relative;
            background: white;
            border-radius: 1rem;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }
        
        .leaderboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .leaderboard-header h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .leaderboard-info {
            padding: 1rem 1.5rem;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        .leaderboard-header .close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .leaderboard-header .close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }
        
        .leaderboard-body {
            max-height: 500px;
            overflow-y: auto;
        }
        
        .leaderboard-tab {
            display: block;
            padding: 0;
        }
        
        .leaderboard-loading {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            margin: 0 auto 1rem;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .leaderboard-entry {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #f3f4f6;
            transition: all 0.3s ease;
        }
        
        .leaderboard-entry:hover {
            background: #f9fafb;
        }
        
        .leaderboard-rank {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.125rem;
            margin-right: 1.5rem;
            flex-shrink: 0;
        }
        
        .leaderboard-rank.gold {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
        }
        
        .leaderboard-rank.silver {
            background: linear-gradient(135deg, #e5e7eb, #9ca3af);
            color: white;
            box-shadow: 0 4px 15px rgba(156, 163, 175, 0.4);
        }
        
        .leaderboard-rank.bronze {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
        }
        
        .leaderboard-rank.other {
            background: #f3f4f6;
            color: #6b7280;
            border: 2px solid #e5e7eb;
        }
        
        .leaderboard-info-section {
            flex: 1;
            min-width: 0;
        }
        
        .leaderboard-name {
            font-weight: 700;
            color: #1f2937;
            font-size: 1.125rem;
            margin-bottom: 0.25rem;
            text-transform: capitalize;
        }
        
        .leaderboard-details {
            font-size: 0.875rem;
            color: #6b7280;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .leaderboard-detail-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .leaderboard-score {
            font-size: 1.5rem;
            font-weight: 800;
            color: #667eea;
            margin-left: 1rem;
            flex-shrink: 0;
            min-width: 80px;
            text-align: right;
        }
        
        .no-players {
            text-align: center;
            padding: 3rem;
            color: #6b7280;
        }
        
        .no-players i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
    `;
    
    // Aggiungi al documento
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Carica dati reali delle classifiche
    loadRealLeaderboardData();
}

// Funzione per chiudere le classifiche
function closeLeaderboard() {
    const modal = document.querySelector('.leaderboard-modal');
    if (modal) {
        modal.remove();
    }
}

// Funzione per caricare dati reali delle classifiche
function loadRealLeaderboardData() {
    // Mostra loading
    const loadingContainer = document.querySelector('.leaderboard-loading');
    if (loadingContainer) {
        loadingContainer.style.display = 'block';
    }
    
    // Chiama API reale
    fetch('/api/ai/leaderboard')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.leaderboard.length > 0) {
                renderRealLeaderboard(data.leaderboard, data.total_players);
            } else {
                showNoPlayersMessage();
            }
        })
        .catch(error => {
            console.error('Errore caricamento classifiche:', error);
            showNoPlayersMessage();
        });
}

// Funzione per renderizzare le classifiche reali
function renderRealLeaderboard(players, totalPlayers) {
    const container = document.getElementById('global-leaderboard');
    if (!container) return;
    
    if (players.length === 0) {
        showNoPlayersMessage();
        return;
    }
    
    const html = players.map((player, index) => {
        const rank = index + 1;
        let rankClass = 'other';
        if (rank === 1) rankClass = 'gold';
        else if (rank === 2) rankClass = 'silver';
        else if (rank === 3) rankClass = 'bronze';
        
        // Formatta dettagli
        const gamesPlayed = player.games_played || 0;
        const score = player.high_score || 0;
        const lastLogin = player.last_login ? new Date(player.last_login).toLocaleDateString('it-IT') : 'Mai';
        
        return `
            <div class="leaderboard-entry">
                <div class="leaderboard-rank ${rankClass}">${rank}</div>
                <div class="leaderboard-info-section">
                    <div class="leaderboard-name">${player.username}</div>
                    <div class="leaderboard-details">
                        <div class="leaderboard-detail-item">
                            <i class="fas fa-gamepad"></i>
                            <span>${gamesPlayed} partite</span>
                        </div>
                        <div class="leaderboard-detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>Ultimo: ${lastLogin}</span>
                        </div>
                    </div>
                </div>
                <div class="leaderboard-score">${score.toLocaleString('it-IT')}</div>
            </div>
        `;
    }).join('');
    
    // Aggiungi info footer
    const footerHtml = `
        <div style="padding: 1rem 1.5rem; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 0.875rem;">
            <strong>${players.length}</strong> di <strong>${totalPlayers}</strong> giocatori totali
        </div>
    `;
    
    container.innerHTML = html + footerHtml;
}

// Funzione per mostrare messaggio nessun giocatore
function showNoPlayersMessage() {
    const container = document.getElementById('global-leaderboard');
    if (!container) return;
    
    container.innerHTML = `
        <div class="no-players">
            <i class="fas fa-trophy"></i>
            <h3>Nessun giocatore trovato</h3>
            <p>Sii il primo a giocare e a entrare in classifica!</p>
            <div style="margin-top: 1.5rem;">
                <a href="/game/memory-game" class="btn btn-primary">
                    <i class="fas fa-gamepad"></i> Gioca Ora
                </a>
            </div>
        </div>
    `;
}
