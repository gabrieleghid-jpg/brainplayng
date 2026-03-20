# BrainPlayNG - Piattaforma di Studio con IA

Una piattaforma web innovativa che unisce studio e gioco attraverso schemi personalizzati generati da Intelligenza Artificiale per un apprendimento efficace e coinvolgente.

## 🏗️ Struttura del Progetto

Il progetto è organizzato in modo modulare per facilitare il lavoro di squadra:

## 🚀 Avvio del Progetto

### Prerequisiti
- Python 3.8+
- Flask
- Altre dipendenze in `requirements.txt`

### Installazione
```bash
# Clona il repository
git clone <repository-url>
cd brainplayng

# Installa le dipendenze
pip install -r requirements.txt

# Avvia l'applicazione
python app.py
```

L'applicazione sarà disponibile su `http://localhost:5000`

## 📁 Struttura delle Cartelle

```
brainplayng/
├── app.py                 # File principale che collega tutti i moduli
├── core_logic.py          # Logica principale (GABRIELE)
├── auth.py               # Autenticazione (COLLABORATORE 1)
├── templates/
│   ├── index.html        # Homepage (COLLABORATORE 2)
│   └── auth/             # Template autenticazione (COLLABORATORE 1)
│       ├── login.html
│       ├── register.html
│       ├── profile.html
│       └── forgot_password.html
├── static/
│   ├── style.css         # Stili principali (COLLABORATORE 2)
│   └── script.js         # JavaScript frontend
├── users.json            # Database utenti (sviluppo)
├── requirements.txt      # Dipendenze Python
├── .gitignore           # File da ignorare su Git
└── README.md            # Questo file
```

## 🔧 Tecnologie Utilizzate

- **Backend:** Flask (Python)
- **Frontend:** HTML5, CSS3, JavaScript
- **Database:** JSON file (sviluppo) - da migrare a PostgreSQL/MySQL in produzione
- **Styling:** CSS3 con variabili CSS, Grid e Flexbox
- **Authentication:** Session-based con hashing SHA-256

## 🎮 Funzionalità Principali

### 🤖 Generazione IA
- Schemi di apprendimento personalizzati
- Adattamento automatico della difficoltà
- Generazione dinamica di contenuti

### 🎯 Giochi Disponibili
- **Memory Game:** Carte abbinate con simboli educativi
- **Quiz Game:** Domande a risposta multipla
- **Puzzle Game:** Schemi logici da completare

### 👥 Gestione Utenti
- Registrazione e login sicuri
- Profili personalizzati
- Tracking dei progressi
- Classifiche e achievement

## 🎨 Design Guidelines

### Palette Colori
- **Primario:** `#6366f1` (Indigo)
- **Secondario:** `#22d3ee` (Cyan)
- **Accento:** `#f59e0b` (Amber)
- **Testo:** `#1f2937` (Gray Dark)

### Tipografia
- **Font:** Inter (Google Fonts)
- **Pesi:** 300, 400, 500, 600, 700

### Layout
- **Mobile-first:** Responsive design
- **Grid System:** CSS Grid e Flexbox
- **Animazioni:** Transizioni smooth e micro-interazioni

## 🔐 Sicurezza

- Hashing password con SHA-256
- Sessioni sicure
- Validazione input utente
- Protezione CSRF (da implementare)

## 🚀 Deployment

### Sviluppo
```bash
python app.py
```

### Produzione (consigliato)
```bash
# Usare Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📋 TODO List

### High Priority
- [ ] Implementare integrazione IA reale
- [ ] Migliorare sistema di autenticazione
- [ ] Aggiungere validazione form lato client

### Medium Priority
- [ ] Creare template auth completi
- [ ] Implementare JavaScript frontend
- [ ] Aggiungere test unitari

### Low Priority
- [ ] Setup database produzione
- [ ] Ottimizzazione performance
- [ ] Documentazione API

## 🤝 Come Contribuire

1. Fork del repository
2. Creare branch feature (`git checkout -b feature/amazing-feature`)
3. Commit delle modifiche (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Aprire Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT - vedere il file LICENSE per dettagli.

## 📞 Contatti

- **Email:** info@brainplayng.com
- **Sito Web:** https://brainplayng.com
- **GitHub:** https://github.com/brainplayng

---

## 👥 Team di Sviluppo

### 👤 **Gabriele Ghidoni** - Core Logic
**Responsabilità:** Logica principale per la creazione dei giochi e generazione schemi tramite IA
**File:** `core_logic.py`
- Gestione della dashboard principale
- API per generazione giochi (`/api/generate-game`)
- Logica di generazione schemi per memory, quiz e altri giochi
- Implementazione algoritmi IA per personalizzazione

### 👤 **Federico Finorio** - Autenticazione
**Responsabilità:** Login, registrazione e tutto ciò che avviene prima dell'accesso
**File:** `auth.py` e cartella `templates/auth/`
- Sistema di login e registrazione
- Gestione sessioni utente
- Profili utente
- Recupero password
- Template per pagine di autenticazione

### 👤 **Christopher Petrosino** - Home & Design
**Responsabilità:** Homepage e design grafico
**File:** `templates/index.html` e `static/style.css`
- Homepage moderna e responsive
- Design pulito e intuitivo
- Animazioni e interazioni
- Layout mobile-friendly

**Nota per il team:** Ogni sviluppatore dovrebbe lavorare principalmente sui propri file ma sentirsi libero di fare suggerimenti per migliorare le altre parti del progetto. La comunicazione è fondamentale per il successo del progetto!
