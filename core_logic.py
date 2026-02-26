# Responsabile: GABRIELE - Core Logic
# Logica principale per la creazione dei giochi e generazione schemi tramite IA

from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
import json
import random

core_bp = Blueprint('core', __name__)

@core_bp.route('/dashboard')
def dashboard():
    """Dashboard principale dopo il login"""
    if 'user_id' not in session:
        return redirect('/auth/login')
    return render_template('dashboard.html')

@core_bp.route('/api/generate-game', methods=['POST'])
def generate_game():
    """API per generare un nuovo gioco tramite IA"""
    if 'user_id' not in session:
        return jsonify({'error': 'Non autorizzato'}), 401
    
    data = request.get_json()
    game_type = data.get('game_type', 'memory')
    difficulty = data.get('difficulty', 'medium')
    
    # Logica di generazione gioco (da implementare)
    game_data = {
        'game_id': f"game_{random.randint(1000, 9999)}",
        'type': game_type,
        'difficulty': difficulty,
        'schema': generate_game_schema(game_type, difficulty)
    }
    
    return jsonify(game_data)

def generate_game_schema(game_type, difficulty):
    """Genera lo schema del gioco in base al tipo e difficoltà"""
    # Implementazione base - da espandere con logica IA
    if game_type == 'memory':
        return {
            'cards': generate_memory_cards(difficulty),
            'grid_size': get_grid_size(difficulty)
        }
    elif game_type == 'quiz':
        return {
            'questions': generate_quiz_questions(difficulty),
            'time_limit': get_time_limit(difficulty)
        }
    return {}

def generate_memory_cards(difficulty):
    """Genera le carte per il gioco di memoria"""
    num_pairs = {'easy': 4, 'medium': 8, 'hard': 12}.get(difficulty, 8)
    cards = []
    symbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻']
    
    for i in range(num_pairs):
        symbol = symbols[i % len(symbols)]
        cards.extend([{'id': i*2, 'symbol': symbol}, {'id': i*2+1, 'symbol': symbol}])
    
    random.shuffle(cards)
    return cards

def generate_quiz_questions(difficulty):
    """Genera domande per il quiz"""
    num_questions = {'easy': 5, 'medium': 10, 'hard': 15}.get(difficulty, 10)
    questions = []
    
    for i in range(num_questions):
        questions.append({
            'id': i,
            'question': f'Domanda {i+1}',
            'options': ['Opzione A', 'Opzione B', 'Opzione C', 'Opzione D'],
            'correct': random.randint(0, 3)
        })
    
    return questions

def get_grid_size(difficulty):
    """Restituisce la dimensione della griglia per il gioco di memoria"""
    return {'easy': '3x2', 'medium': '4x4', 'hard': '6x4'}.get(difficulty, '4x4')

def get_time_limit(difficulty):
    """Restituisce il limite di tempo per il quiz"""
    return {'easy': 300, 'medium': 180, 'hard': 120}.get(difficulty, 180)
