# Responsabile: COLLABORATORE 1 - Autenticazione
# Gestione login, registrazione e tutto ciò che avviene prima dell'accesso

from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
import hashlib
import json
import os
import datetime
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# Database utenti semplificato (in produzione usare database reale)
USERS_FILE = 'data/users.dat'
GAMES_HISTORY_FILE = 'data/games_history.dat'

def login_required(f):
    """Decorator per richiedere l'autenticazione (utente o ospite)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

def user_login_required(f):
    """Decorator per richiedere l'autenticazione solo per utenti registrati (non ospiti)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('auth.login'))
        if session.get('is_guest', False):
            flash('Questa funzionalità richiede un account registrato.', 'error')
            return redirect(url_for('auth.register'))
        return f(*args, **kwargs)
    return decorated_function

def load_users():
    """Carica gli utenti dal file DAT"""
    try:
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    except Exception as e:
        print(f"Errore nel caricare utenti: {e}")
        return {}

def save_users(users):
    """Salva gli utenti nel file DAT"""
    try:
        # Assicurati che la directory esista
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Errore nel salvare utenti: {e}")
        return False

def load_games_history():
    """Carica lo storico dei giochi"""
    try:
        if os.path.exists(GAMES_HISTORY_FILE):
            with open(GAMES_HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}
    except Exception as e:
        print(f"Errore nel caricare lo storico giochi: {e}")
        return {}

def save_games_history(history):
    """Salva lo storico dei giochi"""
    try:
        os.makedirs(os.path.dirname(GAMES_HISTORY_FILE), exist_ok=True)
        with open(GAMES_HISTORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Errore nel salvare lo storico giochi: {e}")
        return False

def add_game_to_history(user_id, game_type, game_data):
    """Aggiunge una partita allo storico dell'utente"""
    history = load_games_history()
    
    if user_id not in history:
        history[user_id] = []
    
    game_entry = {
        'id': len(history[user_id]) + 1,
        'type': game_type,
        'date': datetime.datetime.now().isoformat(),
        **game_data
    }
    
    history[user_id].append(game_entry)
    
    # Mantieni solo le ultime 100 partite per utente
    if len(history[user_id]) > 100:
        history[user_id] = history[user_id][-100:]
    
    save_games_history(history)
    
    # Aggiorna le statistiche dell'utente
    users = load_users()
    if user_id in users:
        users[user_id]['games_played'] = users[user_id].get('games_played', 0) + 1
        
        # Aggiorna high score se necessario
        score = game_data.get('score', 0)
        if score > users[user_id].get('high_score', 0):
            users[user_id]['high_score'] = score
        
        users[user_id]['last_login'] = datetime.datetime.now().isoformat()
        save_users(users)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Pagina di login"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        users = load_users()
        
        if username in users:
            # Hash della password per confronto
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            if users[username]['password'] == password_hash:
                # Aggiorna ultimo login
                users[username]['last_login'] = datetime.datetime.now().isoformat()
                save_users(users)
                
                session['user_id'] = username
                session['username'] = username
                session['email'] = users[username]['email']
                flash('Bentornato! Login effettuato con successo.', 'success')
                return redirect(url_for('index'))
            else:
                flash('Password incorrect!', 'error')
        else:
            flash('Username not found!', 'error')
    
    return render_template('auth/login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """Pagina di registrazione"""
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        # Validazione base
        if not username or not email or not password:
            flash('All fields are required!', 'error')
            return render_template('auth/register.html')
        
        if password != confirm_password:
            flash('Passwords do not match!', 'error')
            return render_template('auth/register.html')
        
        users = load_users()
        
        if username in users:
            flash('Username already exists!', 'error')
            return render_template('auth/register.html')
        
        # Hash della password
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Salvataggio nuovo utente
        users[username] = {
            'email': email,
            'password': password_hash,
            'created_at': datetime.datetime.now().isoformat(),
            'games_played': 0,
            'high_score': 0,
            'last_login': None,
            'is_active': True
        }
        
        if save_users(users):
            flash('Registrazione completata! Ora puoi accedere.', 'success')
            return redirect(url_for('index'))
        else:
            flash('Errore durante la registrazione. Riprova.', 'error')
            return render_template('auth/register.html')
    
    return render_template('auth/register.html')

@auth_bp.route('/guest_login')
def guest_login():
    """Login come ospite senza account"""
    # Crea una sessione per l'ospite
    session['user_id'] = 'guest'
    session['username'] = 'Ospite'
    session['email'] = 'guest@brainplaying.local'
    session['is_guest'] = True
    
    flash('Sei entrato come ospite! Puoi usare tutte le funzionalità.', 'success')
    return redirect(url_for('index'))

@auth_bp.route('/logout')
def logout():
    """Logout dell'utente"""
    session.clear()
    flash('You have been logged out!', 'info')
    return redirect(url_for('auth.login'))

@auth_bp.route('/profile')
def profile():
    """Profilo utente - può mostrare il proprio profilo o quello di altri utenti"""
    # Se l'utente non è loggato, crea un profilo ospite
    if 'user_id' not in session:
        # Crea un utente ospite
        guest_user = {
            'username': 'Ospite',
            'email': 'ospite@brainplayng.com',
            'created_at': datetime.datetime.now().isoformat(),
            'last_login': datetime.datetime.now().isoformat(),
            'high_score': 0,
            'games_played': 0,
            'is_guest': True
        }
        return render_template('auth/profile.html', user=guest_user, is_own_profile=True)
    
    # Verifica se si sta visualizzando il profilo di un altro utente
    target_username = request.args.get('user')
    
    users = load_users()
    
    # Se non è specificato un utente, mostra il proprio profilo
    if not target_username:
        user_data = users.get(session['user_id'], {})
        is_own_profile = True
    else:
        # Mostra il profilo dell'utente specificato
        user_data = users.get(target_username)
        is_own_profile = (target_username == session['user_id'])
        
        # Se l'utente non esiste, mostra errore
        if not user_data:
            flash('Utente non trovato.', 'error')
            return redirect(url_for('leaderboard'))
    
    return render_template('auth/profile.html', user=user_data, is_own_profile=is_own_profile)

@auth_bp.route('/api/user/stats')
def api_user_stats():
    """API per ottenere le statistiche dell'utente corrente"""
    if 'user_id' not in session:
        # Ritorna statistiche vuote per ospiti
        return jsonify({
            'success': True,
            'stats': {
                'games_played': 0,
                'high_score': 0,
                'total_time': '--',
                'achievements': 0
            },
            'games': []
        })
    
    users = load_users()
    user_data = users.get(session['user_id'], {})
    
    # Carica lo storico dei giochi
    games_history = load_games_history()
    user_games = games_history.get(session['user_id'], [])
    
    return jsonify({
        'success': True,
        'stats': {
            'games_played': user_data.get('games_played', 0),
            'high_score': user_data.get('high_score', 0),
            'total_time': '--',  # Da implementare
            'achievements': 0  # Da implementare
        },
        'games': user_games[-10:]  # Ultimi 10 giochi
    })

@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """Recupero password"""
    if request.method == 'POST':
        email = request.form.get('email')
        # Implementazione base - in produzione inviare email
        flash('Password reset instructions sent to your email!', 'info')
        return redirect(url_for('auth.login'))
    
    return render_template('auth/forgot-password.html')

@auth_bp.route('/api/user/games-history')
@login_required
def api_games_history():
    """API per ottenere lo storico giochi dell'utente"""
    user_id = session['user_id']
    history = load_games_history()
    user_games = history.get(user_id, [])
    
    # Ordina per data decrescente
    user_games.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    return jsonify(user_games)

@auth_bp.route('/api/user/add-game', methods=['POST'])
@login_required
def api_add_game():
    """API per aggiungere una partita allo storico"""
    user_id = session['user_id']
    
    try:
        data = request.get_json()
        game_type = data.get('type', 'unknown')
        game_data = data.get('data', {})
        
        add_game_to_history(user_id, game_type, game_data)
        
        return jsonify({'success': True, 'message': 'Game added to history'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400
