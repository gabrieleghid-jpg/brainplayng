/**
 * Configurazione Gioco di Combattimento - Stile Slay the Spire
 * Costanti e parametri di bilanciamento
 */

// Costanti di Gioco
const BATTLE_CONFIG = {
    // Statistiche Giocatore
    PLAYER: {
        MAX_HEALTH: 75,
        MAX_CONCENTRATION: 3,
        STARTING_ENERGY: 3,
        BLOCK_PER_TURN: 5
    },
    
    // Sistema Danni
    DAMAGE: {
        CORRECT_ANSWER: 8,
        WRONG_ANSWER_PENALTY: 3,
        DIFFICULTY_MULTIPLIER: 1.5,
        COMBO_BONUS: 2
    },
    
    // Sistema Carte
    CARDS: {
        HAND_SIZE: 5,
        DRAW_PER_TURN: 5,
        MAX_HAND_SIZE: 10
    },
    
    // Sistema Mostri
    MONSTERS: {
        BASE_HEALTH: 20,
        HEALTH_SCALING: 5,
        INTENT_VARIETY: 3
    },
    
    // Mappa del Gioco
    MAP: {
        ACTS: 3,
        FLOORS_PER_ACT: 15,
        BOSS_FLOOR: 15,
        SHOP_FLOORS: [3, 8, 12]
    },
    
    // Ricompense
    REWARDS: {
        VICTORY_CREDITS: 15,
        BOSS_CREDITS: 50,
        CARD_REWARD_CHANCE: 0.7
    }
};

// Tipi di Carte
const CARD_TYPES = {
    ATTACK: 'attack',
    SKILL: 'skill',
    POWER: 'power',
    CURSE: 'curse'
};

// Rarità Carte
const CARD_RARITY = {
    BASIC: 'basic',
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare'
};

// Intent Mostri
const MONSTER_INTENTS = {
    ATTACK: 'attack',
    DEFEND: 'defend',
    BUFF: 'buff',
    DEBUFF: 'debuff'
};

// Categorie Didattiche
const SUBJECT_CATEGORIES = {
    MATEMATICA: 'matematica',
    SCIENZE: 'scienze',
    STORIA: 'storia',
    LETTERE: 'lettere',
    GEOGRAFIA: 'geografia',
    INFORMATICA: 'informatica'
};

// Difficoltà Domande
const QUESTION_DIFFICULTY = {
    FACILE: 1,
    MEDIO: 2,
    DIFFICILE: 3,
    ESPERTO: 4
};
