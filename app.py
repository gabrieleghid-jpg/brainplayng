# Responsabile: Team Lead - File principale del progetto Flask
# Collega tutti i moduli e avvia l'applicazione web

from flask import Flask, render_template
from auth import auth_bp
from core_logic import core_bp

app = Flask(__name__)
app.secret_key = 'brainplayng-secret-key-2024'

# Registrazione dei blueprint modulari
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(core_bp)

@app.route('/')
def index():
    """Homepage principale della piattaforma"""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
