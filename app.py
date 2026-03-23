# Responsabile: Team Lead - File principale del progetto Flask
# Collega tutti i moduli e avvia l'applicazione web

from flask import Flask, render_template, redirect, url_for, session
from auth import auth_bp
from core_logic import core_bp
from game import game_bp
from ai.api import ai_bp

app = Flask(__name__)
app.secret_key = 'brainplayng-secret-key-2024'

# Registrazione dei blueprint modulari
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(core_bp)
app.register_blueprint(game_bp, url_prefix='/game')
app.register_blueprint(ai_bp)

@app.route('/')
def index():
    """Homepage principale - richiede autenticazione"""
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    return render_template('index-new.html')

@app.route('/leaderboard')
def leaderboard():
    """Pagina dedicata alle classifiche - richiede autenticazione"""
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    return render_template('leaderboard.html')

@app.route('/game/memory-ia')
def memory_ia():
    """Pagina Memory Game generato da IA - richiede autenticazione"""
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    return render_template('game/memory-ia.html')

@app.route('/ai/schema-generator')
def schema_generator():
    """Pagina generatore schemi IA - richiede autenticazione"""
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    return render_template('ai/schema_generator.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
