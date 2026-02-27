# Responsabile: GABRIELE - API per Sistema IA
# Endpoint RESTful per la generazione di schemi con intelligenza artificiale

from flask import Blueprint, request, jsonify, session
from .schema_generator import AISchemaGenerator, SchemaConfig, SchemaType, Difficulty
import json
from datetime import datetime

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

# Inizializza il generatore IA
ai_generator = AISchemaGenerator()

@ai_bp.route('/generate-schema', methods=['POST'])
def generate_schema():
    """API principale per generare schemi personalizzati"""
    # Permetti accesso anche senza autenticazione per demo
    # if 'user_id' not in session:
    #     return jsonify({'error': 'Autenticazione richiesta'}), 401
    
    try:
        data = request.get_json()
        
        # Validazione input
        if not data or 'schema_type' not in data:
            return jsonify({'error': 'schema_type richiesto'}), 400
        
        # Creazione configurazione
        config = SchemaConfig(
            schema_type=SchemaType(data['schema_type']),
            difficulty=Difficulty(data.get('difficulty', 'medium')),
            subject=data.get('subject'),
            age_group=data.get('age_group'),
            learning_objectives=data.get('learning_objectives'),
            custom_params=data.get('custom_params')
        )
        
        # Generazione schema
        schema = ai_generator.generate_schema(config)
        
        # Log della generazione (demo mode)
        user_id = session.get('user_id', 'demo_user')
        print(f"[{datetime.now()}] Schema generato: {config.schema_type.value} - {config.difficulty.value} - Utente: {user_id}")
        
        return jsonify({
            'success': True,
            'schema': schema,
            'config': {
                'schema_type': config.schema_type.value,
                'difficulty': config.difficulty.value,
                'subject': config.subject,
                'custom_params': config.custom_params
            }
        })
        
    except ValueError as e:
        return jsonify({'error': f'Configurazione non valida: {str(e)}'}), 400
    except Exception as e:
        print(f"Errore generazione schema: {e}")
        return jsonify({'error': 'Errore interno durante la generazione'}), 500

@ai_bp.route('/schema-types')
def get_schema_types():
    """Restituisce i tipi di schemi disponibili"""
    return jsonify({
        'schema_types': [
            {
                'value': 'memory',
                'name': 'Memory Game',
                'description': 'Gioco di memoria con carte',
                'supported_difficulties': ['easy', 'medium', 'hard'],
                'custom_params': ['theme', 'adaptive_difficulty']
            },
            {
                'value': 'quiz',
                'name': 'Quiz Game',
                'description': 'Domande a risposta multipla',
                'supported_difficulties': ['easy', 'medium', 'hard'],
                'custom_params': ['category', 'time_limit', 'adaptive_difficulty']
            },
            {
                'value': 'puzzle',
                'name': 'Puzzle Game',
                'description': 'Puzzle logici e di ragionamento',
                'supported_difficulties': ['easy', 'medium', 'hard'],
                'custom_params': ['puzzle_type', 'hints_enabled']
            },
            {
                'value': 'math',
                'name': 'Math Exercises',
                'description': 'Esercizi di matematica personalizzati',
                'supported_difficulties': ['easy', 'medium', 'hard'],
                'custom_params': ['operations', 'number_range', 'adaptive_difficulty']
            },
            {
                'value': 'logic',
                'name': 'Logic Problems',
                'description': 'Problemi di logica e ragionamento',
                'supported_difficulties': ['easy', 'medium', 'hard'],
                'custom_params': ['logic_types', 'explanation_level']
            },
            {
                'value': 'language',
                'name': 'Language Learning',
                'description': 'Esercizi di apprendimento linguistico',
                'supported_difficulties': ['easy', 'medium', 'hard'],
                'custom_params': ['language', 'exercise_types', 'difficulty_level']
            },
            {
                'value': 'science',
                'name': 'Science Learning',
                'description': 'Esercizi scientifici multidisciplinari',
                'supported_difficulties': ['easy', 'medium', 'hard'],
                'custom_params': ['branch', 'experiment_type', 'theory_level']
            }
        ]
    })

@ai_bp.route('/themes/<schema_type>')
def get_themes(schema_type):
    """Restituisce i temi disponibili per un tipo di schema"""
    themes = {
        'memory': [
            {'value': 'animals', 'name': 'Animali', 'description': 'Simboli di animali emoji'},
            {'value': 'food', 'name': 'Cibo', 'description': 'Simboli di cibo e bevande'},
            {'value': 'sports', 'name': 'Sport', 'description': 'Simboli sportivi e attrezzature'},
            {'value': 'technology', 'name': 'Tecnologia', 'description': 'Dispositivi elettronici e informatica'},
            {'value': 'education', 'name': 'Educazione', 'description': 'Materiali scolastici e cancelleria'},
            {'value': 'nature', 'name': 'Natura', 'description': 'Piante, fiori e elementi naturali'},
            {'value': 'emotions', 'name': 'Emozioni', 'description': 'Faccine ed espressioni emotive'},
            {'value': 'vehicles', 'name': 'Veicoli', 'description': 'Mezzi di trasporto'},
            {'value': 'music', 'name': 'Musica', 'description': 'Strumenti musicali e note'}
        ],
        'quiz': [
            {'value': 'mathematics', 'name': 'Matematica', 'description': 'Problemi matematici e calcoli'},
            {'value': 'science', 'name': 'Scienze', 'description': 'Domande su fisica, chimica, biologia'},
            {'value': 'history', 'name': 'Storia', 'description': 'Eventi storici e personaggi famosi'},
            {'value': 'geography', 'name': 'Geografia', 'description': 'Geografia mondiale e capitali'}
        ],
        'puzzle': [
            {'value': 'sequence', 'name': 'Sequenza', 'description': 'Completa sequenze numeriche/logiche'},
            {'value': 'logic', 'name': 'Logica', 'description': 'Problemi di logica pura'},
            {'value': 'pattern', 'name': 'Pattern', 'description': 'Riconosci e completa pattern'},
            {'value': 'spatial', 'name': 'Spaziale', 'description': 'Puzzle di visualizzazione spaziale'},
            {'value': 'numerical', 'name': 'Numerico', 'description': 'Enigmi e problemi numerici'}
        ]
    }
    
    return jsonify({
        'schema_type': schema_type,
        'themes': themes.get(schema_type, [])
    })

@ai_bp.route('/validate-config', methods=['POST'])
def validate_config():
    """Valida una configurazione schema prima della generazione"""
    # Permetti accesso anche senza autenticazione per demo
    # if 'user_id' not in session:
    #     return jsonify({'error': 'Autenticazione richiesta'}), 401
    
    try:
        data = request.get_json()
        config = SchemaConfig(
            schema_type=SchemaType(data['schema_type']),
            difficulty=Difficulty(data.get('difficulty', 'medium')),
            subject=data.get('subject'),
            age_group=data.get('age_group'),
            learning_objectives=data.get('learning_objectives'),
            custom_params=data.get('custom_params')
        )
        
        # Simulazione generazione per validazione
        test_schema = ai_generator.generate_schema(config)
        
        return jsonify({
            'valid': True,
            'estimated_complexity': test_schema.get('metadata', {}).get('complexity_score', 0),
            'estimated_time': estimate_generation_time(config),
            'warnings': validate_parameters(config)
        })
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'error': str(e)
        }), 400

@ai_bp.route('/generation-stats')
def get_generation_stats():
    """Restituisce statistiche sulle generazioni dell'utente"""
    # Permetti accesso anche senza autenticazione per demo
    # if 'user_id' not in session:
    #     return jsonify({'error': 'Autenticazione richiesta'}), 401
    
    # In produzione, questi dati verrebbero da un database
    return jsonify({
        'total_generated': 0,  # Da implementare con tracking
        'by_type': {
            'memory': 0,
            'quiz': 0,
            'puzzle': 0,
            'math': 0,
            'logic': 0,
            'language': 0,
            'science': 0
        },
        'by_difficulty': {
            'easy': 0,
            'medium': 0,
            'hard': 0
        },
        'last_generation': None
    })

@ai_bp.route('/adaptive-suggestions')
def get_adaptive_suggestions():
    """Suggerimenti adattivi basati sul profilo utente"""
    # Permetti accesso anche senza autenticazione per demo
    # if 'user_id' not in session:
    #     return jsonify({'error': 'Autenticazione richiesta'}), 401
    
    # Logica di suggerimento basata su dati utente
    suggestions = [
        {
            'type': 'schema',
            'schema_type': 'memory',
            'difficulty': 'medium',
            'reason': 'Hai completato con successo giochi facili, prova il livello medio',
            'confidence': 0.8
        },
        {
            'type': 'theme',
            'schema_type': 'memory',
            'theme': 'animals',
            'reason': 'Gli animali sono popolari tra utenti con il tuo profilo',
            'confidence': 0.7
        }
    ]
    
    return jsonify({
        'suggestions': suggestions,
        'based_on': 'user_profile_and_performance'
    })

def estimate_generation_time(config: SchemaConfig) -> str:
    """Stima il tempo di generazione"""
    base_time = {
        SchemaType.MEMORY: 0.5,
        SchemaType.QUIZ: 1.0,
        SchemaType.PUZZLE: 1.5,
        SchemaType.MATH: 0.3,
        SchemaType.LOGIC: 2.0,
        SchemaType.LANGUAGE: 1.2,
        SchemaType.SCIENCE: 1.8
    }
    
    difficulty_multiplier = {
        Difficulty.EASY: 0.8,
        Difficulty.MEDIUM: 1.0,
        Difficulty.HARD: 1.5
    }
    
    time_seconds = base_time.get(config.schema_type, 1.0) * difficulty_multiplier[config.difficulty]
    return f"{time_seconds:.1f} secondi"

def validate_parameters(config: SchemaConfig) -> list:
    """Valida i parametri e restituisce avvisi"""
    warnings = []
    
    if config.custom_params:
        # Validazione parametri personalizzati
        if config.custom_params.get('adaptive_difficulty') and config.difficulty == Difficulty.HARD:
            warnings.append("La difficoltà adattiva potrebbe essere troppo intensa al livello difficile")
        
        if config.schema_type == SchemaType.MEMORY and config.custom_params.get('theme') == 'mixed':
            warnings.append("Tema misto potrebbe ridurre la coesione visiva")
    
    return warnings
