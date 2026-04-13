# Sistema Avanzato di Generazione Schemi con Dialogo Interattivo
# Crea schemi personalizzati attraverso un dialogo intelligente con l'utente

from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, field, asdict
from enum import Enum
import json
import random
from datetime import datetime

class DialogPhase(Enum):
    """Fasi del dialogo di generazione schemi"""
    INITIAL = "initial"  # Raccoglie informazioni base
    DISCOVERY = "discovery"  # Scopre il contesto dell'argomento
    ASSESSMENT = "assessment"  # Valuta il livello di conoscenza
    CUSTOMIZATION = "customization"  # Personalizza il tipo di schema
    GENERATION = "generation"  # Genera lo schema finale
    COMPLETE = "complete"  # Dialogo completato

@dataclass
class DialogContext:
    """Contesto del dialogo"""
    session_id: str
    subject: str = ""
    age_group: str = ""
    knowledge_level: str = ""  # beginner, intermediate, advanced
    learning_style: str = ""  # visual, auditory, kinesthetic, reading
    learning_objectives: List[str] = field(default_factory=list)
    topic_context: Dict[str, Any] = field(default_factory=dict)
    custom_preferences: Dict[str, Any] = field(default_factory=dict)
    current_phase: DialogPhase = DialogPhase.INITIAL
    dialog_history: List[Dict[str, str]] = field(default_factory=list)

class AdvancedSchemaGenerator:
    """Sistema avanzato di generazione schemi con dialogo interattivo"""
    
    def __init__(self):
        self.dialog_questions = self._init_dialog_questions()
        self.schema_templates = self._init_schema_templates()
        
    def _init_dialog_questions(self) -> Dict[str, List[Dict[str, Any]]]:
        """Inizializza le domande per il dialogo"""
        return {
            DialogPhase.INITIAL.value: [
                {
                    "id": "subject_detail",
                    "type": "text",
                    "question": "Perfetto! Dimmi di più su '{subject}'. Quali aspetti specifici vuoi approfondire?",
                    "placeholder": "Es: Storia della Rivoluzione Francese, Fotosintesi, Grammatica italiana...",
                    "importance": 3,
                    "min_length": 5,
                    "context": "Raccoglie dettagli specifici sull'argomento"
                },
                {
                    "id": "current_knowledge",
                    "type": "multiple_choice",
                    "question": "Quale è il tuo attuale livello di conoscenza su questo argomento?",
                    "options": ["Non so nulla", "Ho nozioni base", "Ho buone conoscenze", "Sono esperto"],
                    "importance": 2,
                    "context": "Valuta il punto di partenza"
                }
            ],
            DialogPhase.DISCOVERY.value: [
                {
                    "id": "learning_goal",
                    "type": "text",
                    "question": "Cosa vorresti essere in grado di fare/spiegare dopo aver usato questo schema?",
                    "placeholder": "Es: Comprendere i principali eventi, Saper risolvere esercizi, Parlare con fluidità...",
                    "importance": 3,
                    "context": "Definisce gli obiettivi di apprendimento"
                },
                {
                    "id": "learning_context",
                    "type": "multiple_choice",
                    "question": "In quale contesto studi questo argomento?",
                    "options": ["Scuola/Università", "Auto-apprendimento", "Preparazione esame", "Curiosità personale"],
                    "importance": 2,
                    "context": "Comprende il contesto di studio"
                },
                {
                    "id": "time_available",
                    "type": "multiple_choice",
                    "question": "Quanto tempo puoi dedicare allo studio giornalmente?",
                    "options": ["Meno di 15 minuti", "15-30 minuti", "30-60 minuti", "Più di un'ora"],
                    "importance": 2,
                    "context": "Adatta il carico di lavoro"
                }
            ],
            DialogPhase.ASSESSMENT.value: [
                {
                    "id": "learning_style",
                    "type": "multiple_choice",
                    "question": "Quale metodo ti aiuta maggiormente ad imparare?",
                    "options": [
                        "Schemi e diagrammi visuali",
                        "Note e testo scritto",
                        "Discussioni e spiegazioni",
                        "Pratica e esercizi interattivi"
                    ],
                    "importance": 3,
                    "context": "Identifica lo stile di apprendimento"
                },
                {
                    "id": "preferred_content",
                    "type": "multiple_choice",
                    "question": "Quale tipo di contenuto preferisci?",
                    "options": [
                        "Spiegazioni concise",
                        "Approfondimenti dettagliati",
                        "Quiz e domande",
                        "Esempi pratici e casi studio"
                    ],
                    "importance": 2,
                    "context": "Personalizza il formato dello schema"
                },
                {
                    "id": "challenge_level",
                    "type": "multiple_choice",
                    "question": "Qual è il tuo livello di difficoltà preferito?",
                    "options": ["Base e fondamentale", "Intermedio con approfondimento", "Avanzato e sfidante"],
                    "importance": 2,
                    "context": "Imposta il livello di difficoltà"
                }
            ],
            DialogPhase.CUSTOMIZATION.value: [
                {
                    "id": "schema_type",
                    "type": "multiple_choice",
                    "question": "Quale formato di schema preferisci?",
                    "options": [
                        "Mappa mentale interattiva",
                        "Quiz progressivi",
                        "Schemi sinottici",
                        "Flashcard",
                        "Timeline (per storia/cronologia)",
                        "Comparazioni e contrasti"
                    ],
                    "importance": 3,
                    "context": "Seleziona il tipo di schema"
                },
                {
                    "id": "schema_elements",
                    "type": "multiple_choice",
                    "question": "Quali elementi vorresti includere? (scegli più opzioni)",
                    "options": [
                        "Definizioni e concetti chiave",
                        "Esempi pratici",
                        "Domande di verifiche",
                        "Immagini e diagrammi",
                        "Mnemoniche e trucchi mnemonici",
                        "Fonti e approfondimenti"
                    ],
                    "importance": 2,
                    "context": "Personalizza gli elementi dello schema"
                }
            ]
        }
    
    def _init_schema_templates(self) -> Dict[str, Dict[str, Any]]:
        """Inizializza i template per i diversi schemi"""
        return {
            "mind_map": {
                "type": "mind_map",
                "icon": "🧠",
                "description": "Mappa mentale interattiva con concetti collegati",
                "structure": ["central_concept", "main_branches", "sub_branches", "details"],
                "content_elements": ["definitions", "keywords", "relationships", "examples"]
            },
            "quiz": {
                "type": "quiz",
                "icon": "❓",
                "description": "Serie di domande che si adattano al tuo livello",
                "structure": ["easy_questions", "medium_questions", "hard_questions"],
                "content_elements": ["questions", "options", "explanations", "hints"]
            },
            "timeline": {
                "type": "timeline",
                "icon": "⏳",
                "description": "Timeline interattiva con eventi cronologici",
                "structure": ["chronological_events", "key_moments", "connections", "impact"],
                "content_elements": ["dates", "descriptions", "images", "significance"]
            },
            "comparison": {
                "type": "comparison",
                "icon": "⚖️",
                "description": "Confronto tra concetti, periodi storici o entità",
                "structure": ["items", "criteria", "differences", "similarities"],
                "content_elements": ["features", "advantages", "disadvantages", "contexts"]
            },
            "flashcard": {
                "type": "flashcard",
                "icon": "🎴",
                "description": "Flashcard interattive per memorizzazione",
                "structure": ["front", "back", "categories", "difficulty"],
                "content_elements": ["terms", "definitions", "examples", "images"]
            },
            "synopsis": {
                "type": "synopsis",
                "icon": "📄",
                "description": "Schema sinottico strutturato in tabella",
                "structure": ["main_categories", "subcategories", "details", "examples"],
                "content_elements": ["headings", "bullet_points", "explanations", "cross_references"]
            }
        }
    
    def get_next_dialog_question(self, context: DialogContext) -> Optional[Dict[str, Any]]:
        """Restituisce la prossima domanda del dialogo"""
        phase = context.current_phase.value
        questions = self.dialog_questions.get(phase, [])
        
        if not questions:
            return None
        
        # Filtra le domande già fatte
        asked_ids = [item.get("id") for item in context.dialog_history if item.get("type") == "question"]
        unanswered = [q for q in questions if q["id"] not in asked_ids]
        
        if not unanswered:
            return None
        
        # Ordina per importanza e restituisci la prossima
        next_question = max(unanswered, key=lambda x: x.get("importance", 1))
        return next_question
    
    def process_answer(self, context: DialogContext, question_id: str, answer: Any) -> Dict[str, Any]:
        """Processa la risposta dell'utente e aggiorna il contesto"""
        context.dialog_history.append({
            "type": "answer",
            "question_id": question_id,
            "answer": answer,
            "timestamp": datetime.now().isoformat()
        })
        
        # Aggiorna il contesto in base al tipo di risposta
        if question_id == "subject_detail":
            context.topic_context["details"] = answer
        elif question_id == "current_knowledge":
            context.knowledge_level = answer.lower()
        elif question_id == "learning_goal":
            context.learning_objectives.append(answer)
        elif question_id == "learning_context":
            context.custom_preferences["study_context"] = answer
        elif question_id == "time_available":
            context.custom_preferences["daily_time"] = answer
        elif question_id == "learning_style":
            context.learning_style = answer.lower()
        elif question_id == "preferred_content":
            context.custom_preferences["content_type"] = answer
        elif question_id == "challenge_level":
            context.custom_preferences["difficulty"] = answer.lower()
        elif question_id == "schema_type":
            context.custom_preferences["schema_type"] = answer.lower()
        elif question_id == "schema_elements":
            context.custom_preferences["elements"] = answer
        
        # Determina la prossima fase
        current_phase_questions = self.dialog_questions.get(context.current_phase.value, [])
        asked_count = len([h for h in context.dialog_history if h.get("type") == "answer"])
        
        if asked_count >= len(current_phase_questions):
            # Passa alla fase successiva
            phases = [p for p in DialogPhase]
            current_index = phases.index(context.current_phase)
            if current_index < len(phases) - 1:
                context.current_phase = phases[current_index + 1]
        
        return {
            "success": True,
            "next_phase": context.current_phase.value,
            "messages": self._generate_contextual_message(context, question_id, answer)
        }
    
    def _generate_contextual_message(self, context: DialogContext, question_id: str, answer: str) -> List[str]:
        """Genera messaggi contestuali basati sulla risposta"""
        messages = []
        
        if question_id == "subject_detail":
            messages.append(f"Interessante! Stai approfondendo '{context.subject}', specificamente '{answer}'")
            messages.append("Questo mi aiuta a personalizzare lo schema perfetto per te.")
        elif question_id == "current_knowledge":
            if "non so" in answer.lower():
                messages.append("Perfetto! Partiremo da zero con spiegazioni dettagliate.")
            elif "base" in answer.lower():
                messages.append("Bene! Costruiremo su quelle basi con elementi intermedi.")
            elif "buone" in answer.lower() or "avanzate" in answer.lower():
                messages.append("Grazie! Creeremo uno schema avanzato con approfondimenti.")
        elif question_id == "learning_goal":
            messages.append(f"Obiettivo chiaro: {answer}")
            messages.append("Lo schema sarà costruito per aiutarti a raggiungerlo efficacemente.")
        elif question_id == "learning_style":
            messages.append(f"Preferisci '{answer}'! Adatterò lo schema a questo stile.")
        
        return messages
    
    def generate_schema(self, context: DialogContext) -> Dict[str, Any]:
        """Genera lo schema finale basato sul dialogo completato"""
        # Determina il tipo di schema preferito
        schema_type = context.custom_preferences.get("schema_type", "mind_map")
        template = self.schema_templates.get(schema_type, self.schema_templates["mind_map"])
        
        # Crea lo schema personalizzato
        schema = {
            "id": context.session_id,
            "timestamp": datetime.now().isoformat(),
            "subject": context.subject,
            "type": schema_type,
            "template": template,
            "context": asdict(context),
            "content": self._generate_schema_content(context, template),
            "metadata": {
                "knowledge_level": context.knowledge_level,
                "learning_style": context.learning_style,
                "difficulty": context.custom_preferences.get("difficulty", "intermediate"),
                "learning_objectives": context.learning_objectives,
            }
        }
        
        return schema
    
    def _generate_schema_content(self, context: DialogContext, template: Dict[str, Any]) -> Dict[str, Any]:
        """Genera il contenuto specifico dello schema"""
        schema_type = template["type"]
        
        if schema_type == "mind_map":
            return self._generate_mind_map_content(context)
        elif schema_type == "quiz":
            return self._generate_quiz_content(context)
        elif schema_type == "timeline":
            return self._generate_timeline_content(context)
        elif schema_type == "comparison":
            return self._generate_comparison_content(context)
        elif schema_type == "flashcard":
            return self._generate_flashcard_content(context)
        else:
            return self._generate_synopsis_content(context)
    
    def _generate_mind_map_content(self, context: DialogContext) -> Dict[str, Any]:
        """Genera contenuto per mappa mentale"""
        return {
            "central_concept": context.subject,
            "main_branches": [
                {
                    "name": "Definizioni Fondamentali",
                    "icon": "📖",
                    "subbranches":["Concetti chiave", "Terminologia", "Significati"]
                },
                {
                    "name": "Applicazioni Pratiche",
                    "icon": "💡",
                    "subbranches": ["Esempi reali", "Casi studio", "Utilizzi"]
                },
                {
                    "name": "Struttura e Organizzazione",
                    "icon": "🔗",
                    "subbranches": ["Relazioni", "Connessioni", "Gerarchia"]
                },
                {
                    "name": "Approfondimenti",
                    "icon": "📚",
                    "subbranches": ["Curiosità", "Estensioni", "Aree correlate"]
                }
            ]
        }
    
    def _generate_quiz_content(self, context: DialogContext) -> Dict[str, Any]:
        """Genera contenuto per quiz"""
        difficulty = context.custom_preferences.get("difficulty", "intermediate").lower()
        num_questions = {"base": 5, "intermedio": 10, "avanzato": 15}.get(difficulty, 10)
        
        return {
            "total_questions": num_questions,
            "difficulty_levels": {
                "easy": {"count": num_questions // 3, "points": 1},
                "medium": {"count": num_questions // 3, "points": 2},
                "hard": {"count": num_questions // 3 + (num_questions % 3), "points": 3}
            },
            "question_types": ["multiple_choice", "true_false", "fill_blank", "essay"],
            "adaptive": True,
            "time_limit": 60 if difficulty == "facile" else 90 if difficulty == "intermedio" else 120
        }
    
    def _generate_timeline_content(self, context: DialogContext) -> Dict[str, Any]:
        """Genera contenuto per timeline"""
        return {
            "title": f"Timeline: {context.subject}",
            "events": [],
            "markers": 10,
            "interactive": True,
            "show_connections": True,
            "detail_level": context.custom_preferences.get("difficulty", "intermediate")
        }
    
    def _generate_comparison_content(self, context: DialogContext) -> Dict[str, Any]:
        """Genera contenuto per comparazione"""
        return {
            "title": f"Comparazione: {context.subject}",
            "items": [],
            "criteria": ["Caratteristiche", "Vantaggi", "Svantaggi", "Contesto d'uso"],
            "display_format": "table",
            "highlight_differences": True
        }
    
    def _generate_flashcard_content(self, context: DialogContext) -> Dict[str, Any]:
        """Genera contenuto per flashcard"""
        return {
            "title": f"Flashcard: {context.subject}",
            "cards": [],
            "shuffle": True,
            "review_mode": True,
            "spaced_repetition": True,
            "difficulty_adjustment": True
        }
    
    def _generate_synopsis_content(self, context: DialogContext) -> Dict[str, Any]:
        """Genera contenuto per schema sinottico"""
        return {
            "title": f"Schema Sinottico: {context.subject}",
            "categories": [],
            "hierarchical": True,
            "include_examples": True,
            "columns": ["Concetto", "Descrizione", "Esempi", "Note"]
        }


# Funzioni helper
def create_dialog_context(session_id: str, subject: str, age_group: str = "") -> DialogContext:
    """Crea un nuovo contesto di dialogo"""
    return DialogContext(
        session_id=session_id,
        subject=subject,
        age_group=age_group,
        current_phase=DialogPhase.INITIAL
    )


def get_schema_recommendations(context: DialogContext) -> Dict[str, Any]:
    """Fornisce raccomandazioni di schema basate sul contesto"""
    generator = AdvancedSchemaGenerator()
    recommendations = []
    
    for schema_name, template in generator.schema_templates.items():
        score = calculate_schema_score(context, schema_name)
        recommendations.append({
            "name": schema_name,
            "template": template,
            "relevance_score": score
        })
    
    # Ordina per rilevanza
    recommendations.sort(key=lambda x: x["relevance_score"], reverse=True)
    return {"recommendations": recommendations[:3]}


def calculate_schema_score(context: DialogContext, schema_type: str) -> float:
    """Calcola il punteggio di rilevanza di uno schema"""
    score = 0.0
    
    # Fattori di scoring
    learning_style = context.learning_style.lower()
    content_type = context.custom_preferences.get("content_type", "").lower()
    
    if schema_type == "mind_map" and "diagrammi" in learning_style:
        score += 0.3
    if schema_type == "flashcard" and "memorizzazione" in content_type:
        score += 0.3
    if schema_type == "quiz" and "domande" in content_type:
        score += 0.3
    if schema_type == "timeline" and "cronologia" in context.subject.lower():
        score += 0.2
    
    # Bonus per difficoltà
    if context.knowledge_level == "beginner" and schema_type in ["synopsis", "flashcard"]:
        score += 0.2
    elif context.knowledge_level == "advanced" and schema_type in ["quiz", "mind_map"]:
        score += 0.2
    
    return min(score, 1.0)  # Massimo 100%
