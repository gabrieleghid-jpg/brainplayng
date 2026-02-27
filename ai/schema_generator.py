# Responsabile: GABRIELE - Sistema IA per Generazione Schemi
# Modulo avanzato per la creazione di schemi di apprendimento personalizzati

import random
import json
import math
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

class SchemaType(Enum):
    """Tipi di schemi generabili dall'IA"""
    MEMORY = "memory"
    QUIZ = "quiz"
    PUZZLE = "puzzle"
    MATH = "math"
    LOGIC = "logic"
    LANGUAGE = "language"
    SCIENCE = "science"

class Difficulty(Enum):
    """Livelli di difficoltà"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

@dataclass
class SchemaConfig:
    """Configurazione per la generazione di schemi"""
    schema_type: SchemaType
    difficulty: Difficulty
    subject: Optional[str] = None
    age_group: Optional[str] = None
    learning_objectives: Optional[List[str]] = None
    custom_params: Optional[Dict[str, Any]] = None

class AISchemaGenerator:
    """Sistema IA avanzato per la generazione di schemi di apprendimento"""
    
    def __init__(self):
        self.symbol_pools = {
            'animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵'],
            'food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅'],
            'sports': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏'],
            'technology': ['💻', '📱', '⌨️', '🖥️', '🖨️', '🖱️', '🖲', '💾', '💿', '📀', '🧮', '🖼️', '📷', '📹', '📼', '🔍'],
            'education': ['📚', '📖', '📝', '✏️', '📐', '📏', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '📌', '🔒', '🔓'],
            'nature': ['🌳', '🌲', '🌴', '🌵', '🌾', '🌿', '🍀', '🌱', '🌼', '🌻', '🌹', '🥀', '🌺', '🌸', '💐', '🌷'],
            'emotions': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩'],
            'vehicles': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵'],
            'music': ['🎵', '🎶', '🎼', '🎤', '🎧', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🥁', '🎹', '🎵', '🎶', '🎼']
        }
        
        self.quiz_categories = {
            'mathematics': {
                'easy': ['2+2', '5-3', '4×2', '10÷2', '7+1', '8-4'],
                'medium': ['15+23', '45-17', '12×8', '144÷12', '67+89', '156-78'],
                'hard': ['234+567', '891-234', '45×67', '2025÷45', '1234+5678', '9876-4321']
            },
            'science': {
                'easy': ['H2O è?', '2+2', 'Sole è?', 'Terra?', 'Acqua?', 'Aria?'],
                'medium': ['Formula CO2?', 'Velocità luce?', 'Gravità?', 'DNA?', 'Fotosintesi?'],
                'hard': ['Costante Planck?', 'Relatività?', 'Meccanica quantistica?', 'Teoria stringhe?']
            },
            'history': {
                'easy': ['Anno 1492?', 'Roma?', 'Leonardo?', 'Monna Lisa?', 'Colombo?'],
                'medium': ['Guerra mondiale 1?', 'Rivoluzione francese?', 'Rinascimento?', 'Illuminismo?'],
                'hard': ['Trattato Versailles?', 'Caduta Impero Romano?', 'Riforma Protestante?']
            },
            'geography': {
                'easy': ['Capitale Italia?', 'Continente Asia?', 'Oceano Atlantico?', 'Monte Everest?'],
                'medium': ['Fiume più lungo?', 'Deserto più grande?', 'Paese più popoloso?'],
                'hard': ['Coordinate Greenwich?', 'Fuso orario internazionale?', 'Linea data internazionale?']
            }
        }
        
        self.puzzle_patterns = {
            'sequence': self._generate_sequence_puzzle,
            'logic': self._generate_logic_puzzle,
            'pattern': self._generate_pattern_puzzle,
            'spatial': self._generate_spatial_puzzle,
            'numerical': self._generate_numerical_puzzle
        }

    def generate_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera uno schema basato sulla configurazione"""
        if config.schema_type == SchemaType.MEMORY:
            return self._generate_memory_schema(config)
        elif config.schema_type == SchemaType.QUIZ:
            return self._generate_quiz_schema(config)
        elif config.schema_type == SchemaType.PUZZLE:
            return self._generate_puzzle_schema(config)
        elif config.schema_type == SchemaType.MATH:
            return self._generate_math_schema(config)
        elif config.schema_type == SchemaType.LOGIC:
            return self._generate_logic_schema(config)
        elif config.schema_type == SchemaType.LANGUAGE:
            return self._generate_language_schema(config)
        elif config.schema_type == SchemaType.SCIENCE:
            return self._generate_science_schema(config)
        else:
            raise ValueError(f"Schema type {config.schema_type} not supported")

    def _generate_memory_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera schema per gioco di memoria"""
        difficulty_settings = {
            Difficulty.EASY: {'pairs': 6, 'grid_cols': 4, 'grid_rows': 3},
            Difficulty.MEDIUM: {'pairs': 8, 'grid_cols': 4, 'grid_rows': 4},
            Difficulty.HARD: {'pairs': 15, 'grid_cols': 6, 'grid_rows': 5}
        }
        
        settings = difficulty_settings[config.difficulty]
        
        # Selezione intelligente dei simboli
        if config.custom_params and 'theme' in config.custom_params:
            theme = config.custom_params['theme']
            symbols = self.symbol_pools.get(theme, list(self.symbol_pools.values())[0])
        else:
            # Mix intelligente di categorie
            symbols = []
            for category in list(self.symbol_pools.values())[:3]:
                symbols.extend(random.sample(category, min(5, len(category))))
            symbols = symbols[:settings['pairs']]
        
        # Generazione carte con logica avanzata
        cards = []
        for i in range(settings['pairs']):
            symbol = symbols[i % len(symbols)]
            cards.extend([
                {'id': i*2, 'symbol': symbol, 'type': 'pair', 'pair_id': i},
                {'id': i*2+1, 'symbol': symbol, 'type': 'pair', 'pair_id': i}
            ])
        
        # Shuffle con algoritmo Fisher-Yates migliorato
        random.shuffle(cards)
        
        return {
            'type': 'memory',
            'difficulty': config.difficulty.value,
            'cards': cards,
            'grid': {
                'cols': settings['grid_cols'],
                'rows': settings['grid_rows']
            },
            'metadata': {
                'pairs': settings['pairs'],
                'theme': config.custom_params.get('theme', 'mixed') if config.custom_params else 'mixed',
                'generated_at': datetime.now().isoformat(),
                'complexity_score': self._calculate_complexity_score(config)
            }
        }

    def _generate_quiz_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera schema per quiz personalizzato"""
        category = config.custom_params.get('category', 'mathematics') if config.custom_params else 'mathematics'
        difficulty = config.difficulty.value
        
        if category not in self.quiz_categories:
            category = 'mathematics'
        
        questions_pool = self.quiz_categories[category][difficulty]
        num_questions = {
            Difficulty.EASY: 5,
            Difficulty.MEDIUM: 10,
            Difficulty.HARD: 15
        }[config.difficulty]
        
        questions = []
        for i in range(num_questions):
            question_text = random.choice(questions_pool)
            
            # Generazione opzioni intelligenti
            correct_answer = self._get_correct_answer(question_text, category)
            wrong_answers = self._generate_wrong_answers(question_text, category, correct_answer)
            
            options = [correct_answer] + wrong_answers
            random.shuffle(options)
            
            questions.append({
                'id': i,
                'question': question_text,
                'options': options,
                'correct': options.index(correct_answer),
                'category': category,
                'difficulty': difficulty,
                'points': self._calculate_question_points(category, difficulty)
            })
        
        return {
            'type': 'quiz',
            'difficulty': difficulty,
            'questions': questions,
            'metadata': {
                'category': category,
                'total_questions': num_questions,
                'time_limit': self._get_time_limit(config.difficulty),
                'generated_at': datetime.now().isoformat()
            }
        }

    def _generate_puzzle_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera schema per puzzle logico"""
        puzzle_type = config.custom_params.get('puzzle_type', 'sequence') if config.custom_params else 'sequence'
        
        if puzzle_type not in self.puzzle_patterns:
            puzzle_type = 'sequence'
        
        generator = self.puzzle_patterns[puzzle_type]
        puzzle_data = generator(config)
        
        return {
            'type': 'puzzle',
            'difficulty': config.difficulty.value,
            'puzzle_type': puzzle_type,
            'data': puzzle_data,
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'hints': self._generate_hints(puzzle_type, puzzle_data)
            }
        }

    def _generate_math_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera schema per esercizi di matematica"""
        operations = ['+', '-', '×', '÷']
        difficulty_ranges = {
            Difficulty.EASY: (1, 20),
            Difficulty.MEDIUM: (10, 100),
            Difficulty.HARD: (50, 500)
        }
        
        min_val, max_val = difficulty_ranges[config.difficulty]
        num_exercises = 10
        
        exercises = []
        for i in range(num_exercises):
            op = random.choice(operations)
            a = random.randint(min_val, max_val)
            b = random.randint(min_val, max_val) if op != '÷' else random.randint(1, min_val)
            
            if op == '+':
                result = a + b
            elif op == '-':
                result = a - b
            elif op == '×':
                result = a * b
            elif op == '÷':
                a = b * random.randint(2, 10)  # Ensure divisible
                result = a // b
            
            exercises.append({
                'id': i,
                'exercise': f'{a} {op} {b} = ?',
                'answer': result,
                'operation': op,
                'difficulty': config.difficulty.value
            })
        
        return {
            'type': 'math',
            'difficulty': config.difficulty.value,
            'exercises': exercises,
            'metadata': {
                'operations': operations,
                'range': [min_val, max_val],
                'generated_at': datetime.now().isoformat()
            }
        }

    def _generate_logic_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera schema per esercizi di logica"""
        logic_types = ['syllogism', 'pattern', 'deduction', 'classification']
        num_exercises = 8
        
        exercises = []
        for i in range(num_exercises):
            logic_type = random.choice(logic_types)
            
            if logic_type == 'syllogism':
                exercise = self._generate_syllogism()
            elif logic_type == 'pattern':
                exercise = self._generate_pattern_logic()
            elif logic_type == 'deduction':
                exercise = self._generate_deduction()
            else:  # classification
                exercise = self._generate_classification()
            
            exercises.append({
                'id': i,
                'type': logic_type,
                'question': exercise['question'],
                'answer': exercise['answer'],
                'explanation': exercise.get('explanation', '')
            })
        
        return {
            'type': 'logic',
            'difficulty': config.difficulty.value,
            'exercises': exercises,
            'metadata': {
                'logic_types': logic_types,
                'generated_at': datetime.now().isoformat()
            }
        }

    def _generate_language_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera schema per esercizi di lingua"""
        language = config.custom_params.get('language', 'italian') if config.custom_params else 'italian'
        exercise_types = ['grammar', 'vocabulary', 'comprehension', 'translation']
        
        exercises = []
        for i in range(6):
            ex_type = random.choice(exercise_types)
            
            if ex_type == 'grammar':
                exercise = self._generate_grammar_exercise(language)
            elif ex_type == 'vocabulary':
                exercise = self._generate_vocabulary_exercise(language)
            elif ex_type == 'comprehension':
                exercise = self._generate_comprehension_exercise(language)
            else:  # translation
                exercise = self._generate_translation_exercise(language)
            
            exercises.append({
                'id': i,
                'type': ex_type,
                'question': exercise['question'],
                'answer': exercise['answer'],
                'language': language
            })
        
        return {
            'type': 'language',
            'difficulty': config.difficulty.value,
            'exercises': exercises,
            'metadata': {
                'language': language,
                'exercise_types': exercise_types,
                'generated_at': datetime.now().isoformat()
            }
        }

    def _generate_science_schema(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera schema per esercizi scientifici"""
        science_branches = ['physics', 'chemistry', 'biology', 'astronomy', 'earth_science']
        branch = config.custom_params.get('branch', random.choice(science_branches)) if config.custom_params else random.choice(science_branches)
        
        exercises = []
        for i in range(8):
            exercise = self._generate_science_exercise(branch, config.difficulty)
            exercises.append({
                'id': i,
                'branch': branch,
                'question': exercise['question'],
                'answer': exercise['answer'],
                'difficulty': config.difficulty.value
            })
        
        return {
            'type': 'science',
            'difficulty': config.difficulty.value,
            'branch': branch,
            'exercises': exercises,
            'metadata': {
                'branches': science_branches,
                'generated_at': datetime.now().isoformat()
            }
        }

    # Metodi helper per la generazione di puzzle
    def _generate_sequence_puzzle(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera puzzle di sequenza numerica/logica"""
        sequence_length = 5 if config.difficulty == Difficulty.EASY else 8
        start = random.randint(1, 20)
        pattern = random.choice(['+2', '×2', '+3', 'fibonacci', 'primes'])
        
        sequence = [start]
        for i in range(1, sequence_length):
            if pattern == '+2':
                sequence.append(sequence[-1] + 2)
            elif pattern == '×2':
                sequence.append(sequence[-1] * 2)
            elif pattern == '+3':
                sequence.append(sequence[-1] + 3)
            elif pattern == 'fibonacci':
                if len(sequence) >= 2:
                    sequence.append(sequence[-1] + sequence[-2])
                else:
                    sequence.append(sequence[-1] + 1)
            elif pattern == 'primes':
                next_prime = self._next_prime(sequence[-1])
                sequence.append(next_prime)
        
        # Nascondi l'ultimo elemento
        answer = sequence[-1]
        sequence[-1] = '?'
        
        return {
            'sequence': sequence,
            'answer': answer,
            'pattern': pattern,
            'type': 'sequence'
        }

    def _generate_logic_puzzle(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera puzzle di logica pura"""
        puzzles = [
            {
                'question': 'Ci sono 5 persone in una stanza. 2 escono, 3 entrano. Quante persone ci sono?',
                'answer': 6,
                'explanation': '5 - 2 + 3 = 6 persone'
            },
            {
                'question': 'Un padre ha 4 figli. Ogni figlio ha 1 sorella. Quante figlie ha il padre?',
                'answer': 1,
                'explanation': 'Tutti i figli condividono la stessa sorella'
            }
        ]
        
        puzzle = random.choice(puzzles)
        return {
            'question': puzzle['question'],
            'answer': puzzle['answer'],
            'explanation': puzzle['explanation'],
            'type': 'logic'
        }

    def _generate_pattern_puzzle(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera puzzle di riconoscimento pattern"""
        patterns = ['ABAB', 'AABB', 'ABCABC', '123123', '△○△○']
        pattern = random.choice(patterns)
        
        # Genera sequenza con pattern interrotto
        sequence = list(pattern) * 2
        missing_index = random.randint(len(pattern), len(sequence) - 1)
        answer = sequence[missing_index]
        sequence[missing_index] = '?'
        
        return {
            'sequence': ''.join(sequence),
            'answer': answer,
            'pattern': pattern,
            'type': 'pattern'
        }

    def _generate_spatial_puzzle(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera puzzle spaziale/visivo"""
        return {
            'question': 'Quanti cubi ci sono in questa struttura 3x3x3?',
            'answer': 27,
            'type': 'spatial',
            'description': 'Immagina un cubo 3x3x3 fatto di cubi unitari'
        }

    def _generate_numerical_puzzle(self, config: SchemaConfig) -> Dict[str, Any]:
        """Genera puzzle numerico"""
        return {
            'question': 'Se 2+3=10, 7+2=63, 6+5=66, allora 4+8=?',
            'answer': 48,
            'explanation': 'Formula: (a+b)×a = risultato. Quindi (4+8)×4 = 48',
            'type': 'numerical'
        }

    # Metodi helper per quiz e altre funzionalità
    def _get_correct_answer(self, question: str, category: str) -> str:
        """Ottiene la risposta corretta per una domanda"""
        # Database di risposte corrette espanso
        answers = {
            # Matematica
            '2+2': '4',
            '5-3': '2', 
            '4×2': '8',
            '10÷2': '5',
            '15+23': '38',
            '45-17': '28',
            '12×8': '96',
            '144÷12': '12',
            '67+89': '156',
            '156-78': '78',
            '234+567': '801',
            '891-234': '657',
            '45×67': '3015',
            '2025÷45': '45',
            
            # Scienze
            'H2O è?': 'Acqua',
            'Sole è?': 'Stella',
            'Terra?': 'Pianeta',
            'Acqua?': 'H2O',
            'Aria?': 'Miscela di gas',
            'Formula CO2?': 'CO2',
            'Velocità luce?': '300.000 km/s',
            'Gravità?': '9,8 m/s²',
            'DNA?': 'Acido Desossiribonucleico',
            'Fotosintesi?': 'Processo delle piante',
            'Costante Planck?': '6,626×10⁻³⁴ J·s',
            'Relatività?': 'E=mc²',
            'Meccanica quantistica?': 'Teoria quantistica',
            'Teoria stringhe?': 'Teoria delle corde',
            
            # Storia
            'Anno 1492?': 'Scoperta America',
            'Roma?': 'Capitale Italia',
            'Leonardo?': 'Leonardo da Vinci',
            'Monna Lisa?': 'Dipinto di Leonardo',
            'Colombo?': 'Scopritore America',
            'Guerra mondiale 1?': '1914-1918',
            'Rivoluzione francese?': '1789',
            'Rinascimento?': 'XIV-XVI secolo',
            'Illuminismo?': 'Secolo dei Lumi',
            'Trattato Versailles?': '1919',
            'Caduta Impero Romano?': '476 d.C.',
            'Riforma Protestante?': '1517',
            
            # Geografia
            'Capitale Italia?': 'Roma',
            'Continente Asia?': 'Asia',
            'Oceano Atlantico?': 'Oceano Atlantico',
            'Monte Everest?': 'Himalaya',
            'Fiume più lungo?': 'Nilo',
            'Deserto più grande?': 'Sahara',
            'Paese più popoloso?': 'Cina',
            'Coordinate Greenwich?': '0° longitudine',
            'Fuso orario internazionale?': 'UTC',
            'Linea data internazionale?': '180° longitudine'
        }
        return answers.get(question, 'Risposta non disponibile')

    def _generate_wrong_answers(self, question: str, category: str, correct: str) -> List[str]:
        """Genera risposte sbagliate plausibili"""
        wrong_answers = []
        
        if category == 'mathematics':
            if correct.isdigit():
                correct_num = int(correct)
                # Genera risposte vicine ma sbagliate
                wrong_answers = [
                    str(correct_num + 1),
                    str(correct_num - 1) if correct_num > 1 else str(correct_num + 2),
                    str(correct_num + 10),
                    str(correct_num * 2) if correct_num < 10 else str(correct_num // 2)
                ]
            else:
                # Per espressioni complesse
                wrong_answers = ['Risposta errata', 'Calcolo sbagliato', 'Non so', 'Forse così']
                
        elif category == 'science':
            science_wrong = {
                'Acqua': ['Vino', 'Latte', 'Succo', 'Olio'],
                'Stella': ['Pianeta', 'Satellite', 'Cometa', 'Asteroide'],
                'Pianeta': ['Stella', 'Galassia', 'Nebulosa', 'Asteroidi'],
                'H2O': ['CO2', 'O2', 'N2', 'He'],
                'Miscela di gas': ['Elemento puro', 'Composto', 'Soluzione', 'Sospensione'],
                'CO2': ['H2O', 'O2', 'N2', 'CH4'],
                '300.000 km/s': ['150.000 km/s', '1.000.000 km/s', '50.000 km/s', '10.000 km/s'],
                '9,8 m/s²': ['1,6 m/s²', '25 m/s²', '0 m/s²', '100 m/s²'],
                'Acido Desossiribonucleico': ['Acido Ribonucleico', 'Proteina', 'Lipide', 'Glucosio'],
                'Processo delle piante': ['Processo animale', 'Reazione chimica', 'Fusione nucleare', 'Decomposizione']
            }
            wrong_answers = science_wrong.get(correct, ['Opzione B', 'Opzione C', 'Opzione D'])
            
        elif category == 'history':
            history_wrong = {
                'Scoperta America': ['Scoperta Australia', 'Scoperta Africa', 'Scoperta Asia', 'Scoperta Europa'],
                'Capitale Italia': ['Milano', 'Napoli', 'Torino', 'Firenze'],
                'Leonardo da Vinci': ['Michelangelo', 'Raffaello', 'Donatello', 'Botticelli'],
                'Dipinto di Leonardo': ['Statua di Michelangelo', 'Affresco di Raffaello', 'Mosaico di Giotto', 'Scultura di Donatello'],
                'Scopritore America': ['Marco Polo', 'Vasco de Gama', 'Ferdinando Magellano', 'Cristoforo Colombo'],
                '1914-1918': ['1939-1945', '1850-1860', '2001-2010', '1790-1800'],
                '1789': ['1848', '1517', '476', '1492'],
                'XIV-XVI secolo': ['XVII-XVIII secolo', 'XI-XIII secolo', 'XIX-XX secolo', 'XXI secolo'],
                'Secolo dei Lumi': ['Medioevo', 'Rinascimento', 'Età Vittoriana', 'Post-modernismo'],
                '1919': ['1945', '1815', '1789', '2001'],
                '476 d.C.': ['1453', '1066', '1492', '1789'],
                '1517': ['1648', '1215', '1054', '1962']
            }
            wrong_answers = history_wrong.get(correct, ['Anno sbagliato', 'Secolo errato', 'Data non corretta', 'Periodo diverso'])
            
        elif category == 'geography':
            geography_wrong = {
                'Roma': ['Milano', 'Napoli', 'Torino', 'Venezia'],
                'Asia': ['Europa', 'Africa', 'America', 'Oceania'],
                'Oceano Atlantico': ['Oceano Pacifico', 'Mar Mediterraneo', 'Mar Rosso', 'Oceano Indiano'],
                'Himalaya': ['Alpi', 'Ande', 'Rocky Mountains', 'Appennini'],
                'Nilo': ['Amazonas', 'Mississippi', 'Danubio', 'Po'],
                'Sahara': ['Gobi', 'Kalahari', 'Arabico', 'Antartide'],
                'Cina': ['India', 'Stati Uniti', 'Brasile', 'Russia'],
                '0° longitudine': ['90° E', '180° E', '45° W', '90° W'],
                'UTC': ['GMT+1', 'EST', 'JST', 'AEST'],
                '180° longitudine': ['0° longitudine', '90° E', '45° W', 'Equatore']
            }
            wrong_answers = geography_wrong.get(correct, ['Luogo sbagliato', 'Posizione errata', 'Coordinate non corrette', 'Località diversa'])
        
        else:
            # Fallback generico
            wrong_answers = ['Risposta plausibile 1', 'Risposta plausibile 2', 'Risposta plausibile 3']
        
        # Assicurati di avere 3 risposte sbagliate
        while len(wrong_answers) < 3:
            wrong_answers.append(f'Alternativa {len(wrong_answers) + 1}')
        
        return wrong_answers[:3]

    def _calculate_question_points(self, category: str, difficulty: str) -> int:
        """Calcola i punti per una domanda"""
        base_points = {'easy': 10, 'medium': 20, 'hard': 30}
        category_multiplier = {'mathematics': 1.0, 'science': 1.2, 'history': 1.1, 'geography': 1.1}
        
        return int(base_points[difficulty] * category_multiplier.get(category, 1.0))

    def _get_time_limit(self, difficulty: Difficulty) -> int:
        """Ottiene il limite di tempo per il quiz"""
        return {Difficulty.EASY: 300, Difficulty.MEDIUM: 180, Difficulty.HARD: 120}[difficulty]

    def _calculate_complexity_score(self, config: SchemaConfig) -> float:
        """Calcola uno score di complessità per lo schema"""
        base_score = {Difficulty.EASY: 1.0, Difficulty.MEDIUM: 2.0, Difficulty.HARD: 3.0}[config.difficulty]
        
        # Aggiungi fattori personalizzati
        if config.custom_params:
            if config.custom_params.get('adaptive_difficulty'):
                base_score *= 1.2
            if config.custom_params.get('multi_modal'):
                base_score *= 1.1
        
        return round(base_score, 2)

    def _generate_hints(self, puzzle_type: str, puzzle_data: Dict) -> List[str]:
        """Genera suggerimenti per i puzzle"""
        hints = {
            'sequence': ['Cerca il pattern matematico', 'Prova a moltiplicare o aggiungere', 'Considera sequenze famose'],
            'logic': ['Leggi attentamente la domanda', 'Pensa fuori dagli schemi', 'Considera tutte le possibilità'],
            'pattern': ['Cerca ripetizioni', 'Identifica l\'unità base', 'Estendi il pattern']
        }
        return hints.get(puzzle_type, ['Analizza il problema', 'Pensa logicamente'])

    def _next_prime(self, n: int) -> int:
        """Trova il prossimo numero primo"""
        def is_prime(num):
            if num < 2:
                return False
            for i in range(2, int(num**0.5) + 1):
                if num % i == 0:
                    return False
            return True
        
        candidate = n + 1
        while not is_prime(candidate):
            candidate += 1
        return candidate

    def _generate_syllogism(self) -> Dict[str, str]:
        """Genera un sillogismo"""
        syllogisms = [
            {
                'question': 'Tutti gli uomini sono mortali. Socrate è un uomo. Quindi?',
                'answer': 'Socrate è mortale',
                'explanation': 'Sillogismo classico: Se tutti A sono B, e C è A, allora C è B'
            }
        ]
        return random.choice(syllogisms)

    def _generate_pattern_logic(self) -> Dict[str, str]:
        """Genera esercizio di pattern logico"""
        return {
            'question': 'Se ROSSO è a VERDE come GIALLO è a ?',
            'answer': 'BLU',
            'explanation': 'Sequenza colori dell\'arcobaleno'
        }

    def _generate_deduction(self) -> Dict[str, str]:
        """Genera esercizio di deduzione"""
        return {
            'question': 'Tre scatole A, B, C. Una contiene il premio. A: "Non sono qui", B: "Il premio è qui", C: "A mente. Solo una è vera. Dove è il premio?',
            'answer': 'Scatola C',
            'explanation': 'Se A mente, il premio è in B o C. Se B mente, il premio è in A o C. Solo C può essere vera'
        }

    def _generate_classification(self) -> Dict[str, str]:
        """Genera esercizio di classificazione"""
        return {
            'question': 'Quale di questi non appartiene al gruppo: Cane, Gatto, Auto, Uccello?',
            'answer': 'Auto',
            'explanation': 'Auto è l\'unico mezzo di trasporto, gli altri sono animali'
        }

    def _generate_grammar_exercise(self, language: str) -> Dict[str, str]:
        """Genera esercizio di grammatica"""
        exercises = [
            {'question': 'Scegli la forma corretta: (Io/Me) vado al cinema', 'answer': 'Io'},
            {'question': 'Completa: Lui ___ (andare/andare) a scuola', 'answer': 'va'},
        ]
        return random.choice(exercises)

    def _generate_vocabulary_exercise(self, language: str) -> Dict[str, str]:
        """Genera esercizio di vocabolario"""
        exercises = [
            {'question': 'Sinonimo di "bello": ?', 'answer': 'bello/bravo'},
            {'question': 'Contrario di "grande": ?', 'answer': 'piccolo'},
        ]
        return random.choice(exercises)

    def _generate_comprehension_exercise(self, language: str) -> Dict[str, str]:
        """Genera esercizio di comprensione"""
        text = "Marco va al mercato. Compra frutta e verdura. Paga 10 euro."
        return {
            'question': f'Testo: "{text}" - Cosa compra Marco?',
            'answer': 'Frutta e verdura'
        }

    def _generate_translation_exercise(self, language: str) -> Dict[str, str]:
        """Genera esercizio di traduzione"""
        translations = [
            {'question': 'Traduci "Hello" in italiano', 'answer': 'Ciao'},
            {'question': 'Traduci "Thank you" in italiano', 'answer': 'Grazie'},
        ]
        return random.choice(translations)

    def _generate_science_exercise(self, branch: str, difficulty: Difficulty) -> Dict[str, str]:
        """Genera esercizio scientifico"""
        exercises = {
            'physics': [
                {'question': 'Qual è la formula della forza?', 'answer': 'F = ma'},
                {'question': 'Cosa misura il voltmetro?', 'answer': 'Tensione elettrica'}
            ],
            'chemistry': [
                {'question': 'Qual è il simbolo chimico dell\'oro?', 'answer': 'Au'},
                {'question': 'H2O è?', 'answer': 'Acqua'}
            ],
            'biology': [
                {'question': 'Qual è l\'organo che pompa il sangue?', 'answer': 'Cuore'},
                {'question': 'Quante catene del DNA?', 'answer': '2'}
            ],
            'astronomy': [
                {'question': 'Quale pianeta è più vicino al Sole?', 'answer': 'Mercurio'},
                {'question': 'Quante lune ha la Terra?', 'answer': '1'}
            ],
            'earth_science': [
                {'question': 'Qual è il ciclo dell\'acqua?', 'answer': 'Evaporazione, condensazione, precipitazione'},
                {'question': 'Cosa causa i terremoti?', 'answer': 'Movimento delle placche tettoniche'}
            ]
        }
        
        branch_exercises = exercises.get(branch, exercises['physics'])
        return random.choice(branch_exercises)

# Istanza globale del generatore
schema_generator = AISchemaGenerator()
