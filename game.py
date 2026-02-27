# Responsabile: Game Developer - Modulo gioco di memoria
# Implementa il gioco di memoria interattivo con punteggi e livelli

from flask import Blueprint, render_template, request, jsonify, session
import random
import json
from datetime import datetime

game_bp = Blueprint('game', __name__)

# Configurazione gioco
CARD_SYMBOLS = [
    '🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎻',
    '🎲', '🎳', '�', '�🎪', '🎭', '🎮', '🎨', '🎸',
    '🎺', '🎻', '🎲', '🎳', '🎰', '🎱', '🎲', '🎳',
    '🎯', '🎪', '🎭', '🎮', '🎨', '🎸'
]
LEVEL_CONFIG = {
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
}

@game_bp.route('/memory-game')
def memory_game():
    """Pagina principale del gioco di memoria"""
    return render_template('game/memory_game.html')

@game_bp.route('/api/new-game')
def new_game():
    """API per iniziare una nuova partita"""
    level = request.args.get('level', 'facile')
    config = LEVEL_CONFIG[level]
    pairs = config['pairs']
    
    # Crea carte duplicate
    symbols = CARD_SYMBOLS[:pairs]
    cards = symbols * 2
    random.shuffle(cards)
    
    # Inizializza sessione gioco
    session['game_state'] = {
        'cards': cards,
        'flipped': [],
        'matched': [],
        'moves': 0,
        'start_time': datetime.now().isoformat(),
        'level': level,
        'score': 0,
        'config': config
    }
    
    return jsonify({
        'cards': cards,
        'level': level,
        'pairs': pairs,
        'grid_cols': config['grid_cols'],
        'grid_rows': config['grid_rows'],
        'max_width': config['max_width']
    })

@game_bp.route('/api/flip-card', methods=['POST'])
def flip_card():
    """API per girare una carta"""
    data = request.get_json()
    card_index = data['index']
    
    game_state = session.get('game_state', {})
    
    # Controlla se la carta è già girata o matchata
    if card_index in game_state.get('flipped', []) or card_index in game_state.get('matched', []):
        return jsonify({'error': 'Carta non valida'}), 400
    
    # Aggiungi carta alle girate
    game_state.setdefault('flipped', []).append(card_index)
    game_state['moves'] += 1
    
    # Controlla se ci sono due carte girate
    if len(game_state['flipped']) == 2:
        card1, card2 = game_state['flipped']
        
        # Controlla se le carte corrispondono
        if game_state['cards'][card1] == game_state['cards'][card2]:
            game_state.setdefault('matched', []).extend([card1, card2])
            game_state['flipped'] = []
            
            # Calcola punteggio
            time_bonus = LEVEL_CONFIG[game_state['level']]['time_bonus']
            game_state['score'] += time_bonus - (game_state['moves'] * 2)
            
            # Controlla vittoria
            if len(game_state['matched']) == len(game_state['cards']):
                end_time = datetime.now()
                start_time = datetime.fromisoformat(game_state['start_time'])
                duration = (end_time - start_time).total_seconds()
                
                return jsonify({
                    'matched': True,
                    'game_won': True,
                    'score': game_state['score'],
                    'moves': game_state['moves'],
                    'time': duration
                })
        else:
            # Le carte non corrispondono, verranno rigirate dopo un delay
            pass
    
    session['game_state'] = game_state
    
    return jsonify({
        'flipped': game_state['flipped'],
        'matched': game_state['matched'],
        'moves': game_state['moves'],
        'score': game_state['score']
    })

@game_bp.route('/api/reset-flipped')
def reset_flipped():
    """API per resettare le carte girate che non corrispondono"""
    game_state = session.get('game_state', {})
    game_state['flipped'] = []
    session['game_state'] = game_state
    
    return jsonify({'success': True})

@game_bp.route('/api/leaderboard')
def leaderboard():
    """API per ottenere la classifica"""
    # Qui potresti implementare un database reale
    # Per ora restituiamo dati di esempio
    return jsonify([
        {'name': 'Player1', 'score': 850, 'level': 'difficile', 'time': 45},
        {'name': 'Player2', 'score': 720, 'level': 'medio', 'time': 38},
        {'name': 'Player3', 'score': 650, 'level': 'facile', 'time': 25}
    ])
