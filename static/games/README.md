# 🎮 Sistema di Minigiochi - BrainPlayNG

## 📁 Struttura Directory

```
static/games/
├── memory-game.js          # Logica JavaScript del Memory Game
├── memory-game.css         # Stili CSS del Memory Game
├── games-config.json       # Configurazione centrale dei giochi
└── README.md              # Documentazione (questo file)
```

## 🎯 File Creati

### 1. `memory-game.js`
- **Responsabilità**: Logica completa del gioco di memoria
- **Classe**: `MemoryGame` con metodi per:
  - Inizializzazione gioco
  - Gestione carte e animazioni
  - Calcolo punteggi
  - Gestione stati di gioco
- **Funzionalità**:
  - 3 livelli di difficoltà
  - Sistema di punteggio dinamico
  - Animazioni fluide
  - Gestione vittoria/classifica

### 2. `memory-game.css`
- **Responsabilità**: Stili specifici del Memory Game
- **Sezioni**:
  - Layout responsive
  - Animazioni 3D delle carte
  - Design modale vittoria
  - Stili classifica
  - Media queries per mobile

### 3. `games-config.json`
- **Responsabilità**: Configurazione centralizzata
- **Contenuto**:
  - Dettagli giochi disponibili
  - Impostazioni globali
  - Categorie giochi
  - Percorsi file e route

### 4. `memory_game.html` (modificato)
- **Ora utilizza**: File CSS e JS esterni
- **Vantaggi**:
  - Codice più pulito
  - Manutenzione facilitata
  - Performance migliorate
  - Cache browser ottimizzata

## 🚀 Come Aggiungere Nuovi Giochi

### 1. Creare File del Gioco
```javascript
// static/games/nome-gioco.js
class NomeGioco {
    constructor() {
        // Inizializzazione
    }
    
    // Metodi del gioco
}
```

```css
/* static/games/nome-gioco.css */
/* Stili specifici del gioco */
```

### 2. Aggiornare Configurazione
```json
// games-config.json
{
  "games": {
    "nome-gioco": {
      "name": "Nome Gioco",
      "description": "Descrizione",
      "category": "puzzle",
      "files": {
        "js": "nome-gioco.js",
        "css": "nome-gioco.css"
      }
    }
  }
}
```

### 3. Creare Template HTML
```html
<!-- templates/game/nome_gioco.html -->
<link rel="stylesheet" href="{{ url_for('static', filename='games/nome-gioco.css') }}">
<script src="{{ url_for('static', filename='games/nome-gioco.js') }}"></script>
```

## 🎮 Categorie Giochi Disponibili

- 🧩 **Puzzle**: Giochi di logica e risoluzione enigmi
- ⚡ **Azione**: Giochi veloci e reattivi
- ♟️ **Strategia**: Giochi che richiedono pianificazione
- 📝 **Quiz**: Sfide di conoscenza e apprendimento

## 📊 Configurazione Globale

- `defaultDifficulty`: Livello di difficoltà predefinito
- `maxScore`: Punteggio massimo consentito
- `leaderboardEntries`: Numero di voci in classifica
- `animationDuration`: Durata animazioni (ms)
- `cardFlipDelay`: Delay rigiro carte (ms)

## 🔧 Manutenzione

### Per aggiornare un gioco:
1. Modificare i file JS/CSS corrispondenti
2. Aggiornare `games-config.json` se necessario
3. Testare le modifiche

### Per aggiungere funzionalità:
1. Estendere la classe JavaScript del gioco
2. Aggiungere stili CSS corrispondenti
3. Documentare le nuove opzioni in config

## 🎨 Best Practices

- **Modularità**: Ogni gioco ha i suoi file separati
- **Configurazione**: Impostazioni centralizzate in JSON
- **Responsività**: Design mobile-first
- **Performance**: File separati per cache ottimizzata
- **Documentazione**: Commenti chiari e README dettagliati
