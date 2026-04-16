from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging
import json

# Carica le variabili d'ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configura logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurazione API
HUGGINGFACE_API_TOKEN = os.getenv('HUGGINGFACE_API_TOKEN')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# URL dei modelli
HUGGINGFACE_API_URL_TEXT = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1'
HUGGINGFACE_API_URL_VISION = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large'
OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/api/generate-text', methods=['POST'])
def generate_text():
    """Endpoint per generazione testo con IA"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt mancante'}), 400
        
        # Prova prima con OpenAI se disponibile
        if OPENAI_API_KEY and OPENAI_API_KEY != 'your_openai_key_here':
            return generate_with_openai(prompt)
        elif HUGGINGFACE_API_TOKEN and HUGGINGFACE_API_TOKEN != 'your_hf_token_here':
            return generate_with_huggingface(prompt)
        else:
            return jsonify({
                'error': 'Nessuna API key configurata',
                'details': 'Configura OPENAI_API_KEY o HUGGINGFACE_API_TOKEN nelle variabili d\'ambiente'
            }), 500
            
    except Exception as e:
        logger.error(f"Errore in generate_text: {str(e)}")
        return jsonify({
            'error': 'Errore durante la generazione del testo',
            'details': str(e)
        }), 500

def generate_with_openai(prompt):
    """Genera testo usando OpenAI GPT-4o"""
    try:
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'gpt-4o',
            'messages': [
                {
                    'role': 'system',
                    'content': 'Sei un assistente esperto che genera sempre risposte in formato JSON valido.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'max_tokens': 1500,
            'temperature': 0.7
        }
        
        response = requests.post(OPENAI_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        generated_text = result['choices'][0]['message']['content']
        
        # Prova a parsare il JSON
        try:
            return jsonify({'result': json.loads(generated_text)})
        except json.JSONDecodeError:
            # Se non è JSON, restituisci il testo grezzo
            return jsonify({'result': {'text': generated_text}})
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Errore chiamata OpenAI: {str(e)}")
        return jsonify({
            'error': 'Errore nella chiamata a OpenAI',
            'details': str(e)
        }), 500

def generate_with_huggingface(prompt):
    """Genera testo usando Hugging Face Mistral"""
    try:
        headers = {
            'Authorization': f'Bearer {HUGGINGFACE_API_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'inputs': prompt,
            'parameters': {
                'max_new_tokens': 1500,
                'temperature': 0.7,
                'return_full_text': False
            }
        }
        
        response = requests.post(HUGGINGFACE_API_URL_TEXT, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        generated_text = result[0].get('generated_text', '{}')
        
        # Prova a parsare il JSON con fallback multipli
        try:
            return jsonify({'result': json.loads(generated_text)})
        except json.JSONDecodeError:
            try:
                # Estrai JSON dal testo
                import re
                json_match = re.search(r'\{[\s\S]*\}', generated_text)
                if json_match:
                    return jsonify({'result': json.loads(json_match[0])})
            except:
                pass
            
            # Fallback: restituisci testo grezzo
            return jsonify({'result': {'text': generated_text}})
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Errore chiamata Hugging Face: {str(e)}")
        return jsonify({
            'error': 'Errore nella chiamata a Hugging Face',
            'details': str(e)
        }), 500

@app.route('/api/search', methods=['POST'])
def search_duckduckgo():
    """Endpoint per ricerca DuckDuckGo"""
    try:
        data = request.json
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query di ricerca mancante'}), 400
        
        # Using DuckDuckGo API
        search_url = f"https://api.duckduckgo.com/?q={query}&format=json&pretty=1"
        
        response = requests.get(search_url)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract relevant information from search results
        search_results = data.get('RelatedTopics', [])
        abstract_text = data.get('Abstract', '')
        abstract_source = data.get('AbstractSource', '')
        
        # Extract related topics text
        related_topics_text = '\n'.join([
            topic.get('Text', '') for topic in search_results[:3] if topic and topic.get('Text')
        ])
        
        return jsonify({
            'abstract': abstract_text,
            'source': abstract_source,
            'relatedTopics': related_topics_text
        })
        
    except Exception as e:
        logger.error(f"Errore in search_duckduckgo: {str(e)}")
        return jsonify({
            'error': 'Errore durante la ricerca',
            'details': str(e)
        }), 500

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    """Endpoint per analisi immagini"""
    try:
        if not HUGGINGFACE_API_TOKEN or HUGGINGFACE_API_TOKEN == 'your_hf_token_here':
            return jsonify({
                'error': 'API Hugging Face non configurata',
                'details': 'Configura HUGGINGFACE_API_TOKEN nelle variabili d\'ambiente'
            }), 500
        
        data = request.json
        image_data = data.get('image', '')
        
        if not image_data:
            return jsonify({'error': 'Dati immagine mancanti'}), 400
        
        headers = {
            'Authorization': f'Bearer {HUGGINGFACE_API_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        # Converti base64 in binario per l'API
        import base64
        from io import BytesIO
        
        # Rimuovi il prefisso data:image/...;base64,
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        response = requests.post(
            HUGGINGFACE_API_URL_VISION,
            headers=headers,
            data=image_bytes
        )
        response.raise_for_status()
        
        result = response.json()
        caption = result[0].get('generated_text', 'Immagine analizzata')
        
        return jsonify({'result': {'caption': caption}})
        
    except Exception as e:
        logger.error(f"Errore in analyze_image: {str(e)}")
        return jsonify({
            'error': 'Errore durante l\'analisi dell\'immagine',
            'details': str(e)
        }), 500

@app.route('/health')
def health_check():
    """Endpoint per controllo salute"""
    return jsonify({
        'status': 'healthy',
        'apis': {
            'huggingface': bool(HUGGINGFACE_API_TOKEN and HUGGINGFACE_API_TOKEN != 'your_hf_token_here'),
            'openai': bool(OPENAI_API_KEY and OPENAI_API_KEY != 'your_openai_key_here')
        }
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
