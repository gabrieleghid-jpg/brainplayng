# Responsabile: Game Developer - Gestore Centralizzato Giochi
# Modulo dedicato esclusivamente alla gestione dei giochi e schemi

from flask import Blueprint, render_template, request, jsonify, session
import json
import random
import os
from datetime import datetime

# Blueprint dedicato ai giochi
games_bp = Blueprint('games', __name__)

# Percorsi file di configurazione
GAMES_CONFIG_FILE = 'games/games_config.json'
USER_PROGRESS_FILE = 'games/user_progress.json'

class GamesManager:
    """Classe centrale per la gestione di tutti i giochi"""
    
    def __init__(self):
        self.games_config = self.load_games_config()
        self.symbols_pool = self.load_symbols_pool()
    
    def load_games_config(self):
        """Carica la configurazione dei giochi"""
        if os.path.exists(GAMES_CONFIG_FILE):
            with open(GAMES_CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return self.get_default_config()
    
    def load_symbols_pool(self):
        """Carica il pool di simboli per i giochi"""
        return {
            'emoji': [
                '🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻',
                '🎲', '🎳', '🎰', '🎱', '🎯', '🎪', '🎭', '🎮',
                '🎨', '🎸', '🎺', '🎻', '🎲', '🎳', '🎰', '🎱',
                '🎯', '🎪', '🎭', '🎮', '🎨', '🎸', '🎺', '🎻',
                '🌟', '⭐', '💫', '✨', '🌙', '☀️', '🌈', '⚡',
                '🔥', '💧', '🌊', '🌸', '🌺', '🌻', '🌷', '🌹'
            ],
            'numbers': list(range(1, 51)),
            'letters': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            'shapes': ['●', '■', '▲', '◆', '★', '♥', '♦', '♣', '♠']
        }
    
    def get_default_config(self):
        """Configurazione di default per i giochi"""
        return {
            'memory_game': {
                'name': 'Memory Game',
                'description': 'Trova tutte le coppie di carte',
                'difficulties': {
                    'easy': {
                        'pairs': 6,
                        'grid_cols': 4,
                        'grid_rows': 3,
                        'time_bonus': 100,
                        'max_width': '450px'
                    },
                    'medium': {
                        'pairs': 8,
                        'grid_cols': 4,
                        'grid_rows': 4,
                        'time_bonus': 150,
                        'max_width': '500px'
                    },
                    'hard': {
                        'pairs': 15,
                        'grid_cols': 6,
                        'grid_rows': 5,
                        'time_bonus': 200,
                        'max_width': '700px'
                    }
                },
                'symbols_type': 'emoji',
                'enabled': True
            },
            'quiz_game': {
                'name': 'Quiz Game',
                'description': 'Rispondi alle domande',
                'difficulties': {
                    'easy': {'questions': 5, 'time_limit': 300},
                    'medium': {'questions': 10, 'time_limit': 180},
                    'hard': {'questions': 15, 'time_limit': 120}
                },
                'enabled': False
            },
            'puzzle_game': {
                'name': 'Puzzle Game',
                'description': 'Risolvi i puzzle logici',
                'difficulties': {
                    'easy': {'pieces': 9, 'time_limit': 600},
                    'medium': {'pieces': 16, 'time_limit': 480},
                    'hard': {'pieces': 25, 'time_limit': 360}
                },
                'enabled': False
            }
        }
    
    def get_game_symbols(self, game_type, count):
        """Ottiene i simboli per un gioco specifico"""
        config = self.games_config.get(game_type, {})
        symbols_type = config.get('symbols_type', 'emoji')
        
        if symbols_type in self.symbols_pool:
            pool = self.symbols_pool[symbols_type]
            if len(pool) >= count:
                return random.sample(pool, count)
            else:
                # Se il pool è più piccolo, ripeti i simboli
                return (pool * ((count // len(pool)) + 1))[:count]
        
        return list(range(1, count + 1))  # Fallback numeri
    
    def shuffle_cards(self, cards):
        """Mescola le carte usando Fisher-Yates migliorato"""
        shuffled = cards.copy()
        for i in range(len(shuffled) - 1, 0, -1):
            j = random.randint(0, i)
            shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
        return shuffled
    
    def calculate_score(self, game_type, difficulty, moves, time_taken, matches):
        """Calcola il punteggio per un gioco"""
        config = self.games_config.get(game_type, {})
        diff_config = config.get('difficulties', {}).get(difficulty, {})
        
        base_score = diff_config.get('time_bonus', 100)
        move_penalty = moves * 2
        time_penalty = time_taken // 10  # 1 punto ogni 10 secondi
        match_bonus = matches * 10
        
        score = max(10, base_score - move_penalty - time_penalty + match_bonus)
        return score
    
    def save_user_progress(self, user_id, game_data):
        """Salva il progresso dell'utente"""
        progress = self.load_user_progress()
        
        if user_id not in progress:
            progress[user_id] = {}
        
        game_type = game_data['game_type']
        if game_type not in progress[user_id]:
            progress[user_id][game_type] = {
                'best_scores': [],
                'total_games': 0,
                'total_time': 0,
                'achievements': []
            }
        
        # Aggiorna statistiche
        user_game_data = progress[user_id][game_type]
        user_game_data['best_scores'].append({
            'score': game_data['score'],
            'moves': game_data['moves'],
            'time': game_data['time'],
            'difficulty': game_data['difficulty'],
            'date': datetime.now().isoformat()
        })
        user_game_data['total_games'] += 1
        user_game_data['total_time'] += game_data['time']
        
        # Mantieni solo i migliori 10 punteggi
        user_game_data['best_scores'] = sorted(
            user_game_data['best_scores'], 
            key=lambda x: x['score'], 
            reverse=True
        )[:10]
        
        self.save_progress_to_file(progress)
    
    def load_user_progress(self):
        """Carica il progresso degli utenti"""
        if os.path.exists(USER_PROGRESS_FILE):
            with open(USER_PROGRESS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    
    def save_progress_to_file(self, progress):
        """Salva il progresso su file"""
        os.makedirs(os.path.dirname(USER_PROGRESS_FILE), exist_ok=True)
        with open(USER_PROGRESS_FILE, 'w', encoding='utf-8') as f:
            json.dump(progress, f, indent=2, ensure_ascii=False)
    
    def get_leaderboard(self, game_type, limit=10):
        """Ottiene la classifica per un gioco"""
        progress = self.load_user_progress()
        leaderboard = []
        
        for user_id, user_data in progress.items():
            if game_type in user_data:
                best_scores = user_data[game_type].get('best_scores', [])
                if best_scores:
                    leaderboard.append({
                        'user_id': user_id,
                        'score': best_scores[0]['score'],
                        'moves': best_scores[0]['moves'],
                        'time': best_scores[0]['time'],
                        'difficulty': best_scores[0]['difficulty']
                    })
        
        return sorted(leaderboard, key=lambda x: x['score'], reverse=True)[:limit]

# Istanza globale del games manager
games_manager = GamesManager()

# Rotte principali
@games_bp.route('/')
def games_hub():
    """Pagina principale con tutti i giochi disponibili"""
    return render_template('games/games_hub.html', games=games_manager.games_config)

@games_bp.route('/<game_type>')
def game_page(game_type):
    """Pagina specifica per un gioco"""
    if game_type not in games_manager.games_config:
        return "Gioco non trovato", 404
    
    game_config = games_manager.games_config[game_type]
    if not game_config.get('enabled', False):
        return "Gioco non disponibile", 403
    
    template_name = f'games/{game_type}.html'
    return render_template(template_name, game_config=game_config, game_type=game_type)

# API per i giochi
@games_bp.route('/api/<game_type>/new-game')
def new_game(game_type):
    """API per iniziare una nuova partita"""
    if game_type not in games_manager.games_config:
        return jsonify({'error': 'Game not found'}), 404
    
    game_config = games_manager.games_config[game_type]
    difficulty = request.args.get('difficulty', 'easy')
    
    if difficulty not in game_config.get('difficulties', {}):
        difficulty = 'easy'
    
    diff_config = game_config['difficulties'][difficulty]
    
    # Inizializza sessione gioco
    session['current_game'] = {
        'game_type': game_type,
        'difficulty': difficulty,
        'start_time': datetime.now().isoformat(),
        'moves': 0,
        'score': 0,
        'matches': 0
    }
    
    if game_type == 'memory_game':
        pairs = diff_config['pairs']
        symbols = games_manager.get_game_symbols(game_type, pairs)
        cards = symbols * 2
        shuffled_cards = games_manager.shuffle_cards(cards)
        
        return jsonify({
            'cards': shuffled_cards,
            'pairs': pairs,
            'grid_cols': diff_config['grid_cols'],
            'grid_rows': diff_config['grid_rows'],
            'max_width': diff_config['max_width']
        })
    
    return jsonify({'message': 'Game initialized', 'config': diff_config})

@games_bp.route('/api/<game_type>/end-game', methods=['POST'])
def end_game(game_type):
    """API per terminare una partita e salvare i risultati"""
    if 'current_game' not in session:
        return jsonify({'error': 'No active game'}), 400
    
    game_session = session['current_game']
    data = request.get_json()
    
    # Calcola tempo di gioco
    start_time = datetime.fromisoformat(game_session['start_time'])
    end_time = datetime.now()
    time_taken = int((end_time - start_time).total_seconds())
    
    # Prepara dati per il salvataggio
    game_data = {
        'game_type': game_type,
        'difficulty': game_session['difficulty'],
        'score': data.get('score', game_session['score']),
        'moves': data.get('moves', game_session['moves']),
        'time': time_taken,
        'matches': data.get('matches', game_session['matches']),
        'completed': data.get('completed', False)
    }
    
    # Salva progresso utente
    user_id = session.get('user_id', 'guest')
    games_manager.save_user_progress(user_id, game_data)
    
    # Pulisci sessione
    session.pop('current_game', None)
    
    return jsonify({
        'message': 'Game ended successfully',
        'final_score': game_data['score'],
        'time': time_taken
    })

@games_bp.route('/api/<game_type>/leaderboard')
def get_leaderboard(game_type):
    """API per ottenere la classifica di un gioco"""
    limit = int(request.args.get('limit', 10))
    leaderboard = games_manager.get_leaderboard(game_type, limit)
    return jsonify(leaderboard)

@games_bp.route('/api/<game_type>/progress')
def get_user_progress(game_type):
    """API per ottenere il progresso dell'utente"""
    user_id = session.get('user_id', 'guest')
    progress = games_manager.load_user_progress()
    
    if user_id in progress and game_type in progress[user_id]:
        return jsonify(progress[user_id][game_type])
    
    return jsonify({
        'best_scores': [],
        'total_games': 0,
        'total_time': 0,
        'achievements': []
    })
