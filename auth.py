# Responsabile: COLLABORATORE 1 - Autenticazione
# Gestione login, registrazione e tutto ciò che avviene prima dell'accesso

from flask import Blueprint, render_template, request, redirect, url_for, session, flash
import hashlib
import json
import os
import datetime

auth_bp = Blueprint('auth', __name__)

# Database utenti semplificato (in produzione usare database reale)
USERS_FILE = 'users.json'

def load_users():
    """Carica gli utenti dal file JSON"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    """Salva gli utenti nel file JSON"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

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
                session['user_id'] = username
                session['username'] = username
                flash('Login successful!', 'success')
                return redirect(url_for('core.dashboard'))
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
            'created_at': str(datetime.datetime.now()),
            'games_played': 0,
            'high_score': 0
        }
        
        save_users(users)
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('auth.login'))
    
    return render_template('auth/register.html')

@auth_bp.route('/logout')
def logout():
    """Logout dell'utente"""
    session.clear()
    flash('You have been logged out!', 'info')
    return redirect(url_for('auth.login'))

@auth_bp.route('/profile')
def profile():
    """Profilo utente"""
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    
    users = load_users()
    user_data = users.get(session['user_id'], {})
    
    return render_template('auth/profile.html', user=user_data)

@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    """Recupero password"""
    if request.method == 'POST':
        email = request.form.get('email')
        # Implementazione base - in produzione inviare email
        flash('Password reset instructions sent to your email!', 'info')
        return redirect(url_for('auth.login'))
    
    return render_template('auth/forgot_password.html')
