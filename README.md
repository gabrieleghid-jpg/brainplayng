# brainplaying — Progetto Web

Piattaforma di studio con login, registrazione e accesso ospite.

## Struttura del progetto

```
studyflow/
├── index.html              ← Pagina di login/registrazione
├── css/
│   ├── global.css          ← Variabili CSS, reset, utility globali
│   └── login.css           ← Stili specifici del login
├── js/
│   └── auth.js             ← Logica di autenticazione e validazione
├── pages/
│   └── dashboard.html      ← Dashboard (placeholder — da espandere)
└── assets/                 ← Immagini, icone, font locali (aggiungi qui)
```

## Come avviare

**Opzione A — Live Server (consigliato per VS Code):**
1. Installa l'estensione **Live Server** in VS Code
2. Apri la cartella `studyflow/` in VS Code
3. Tasto destro su `index.html` → "Open with Live Server"

**Opzione B — Server locale con Python:**
```bash
cd studyflow
python -m http.server 3000
# Poi vai su http://localhost:3000
```

**Opzione C — Node.js (http-server):**
```bash
npx http-server studyflow -p 3000
```

> ⚠️ Non aprire `index.html` direttamente con doppio click (file://), 
> alcuni browser bloccano le richieste fetch da protocollo file.

## Credenziali di test

Nella versione mock (senza backend), qualsiasi email valida con password ≥ 6 caratteri funzionerà come login.

## Come connettere un backend reale

In `js/auth.js`, cerca le due funzioni:
- `simulateLogin()` → sostituisci con `fetch('/api/auth/login', ...)`
- `simulateRegister()` → sostituisci con `fetch('/api/auth/register', ...)`

## Prossimi step suggeriti

- [ ] Pagina reset password (`pages/reset-password.html`)
- [ ] Dashboard completa con materie e flashcard
- [ ] Sistema di notifiche e progressi
- [ ] Modalità scura
- [ ] Backend con Node.js/Express o Supabase
