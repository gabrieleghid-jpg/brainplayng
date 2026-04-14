# CODICE HTML DA INSERIRE NELLA SEZIONE SCHEMI

## 1. AGGIUNGERE QUESTI TAG NELLA SEZIONE <head> DI home.html:

```html
<link rel="stylesheet" href="css/schemi.css" />
```

## 2. AGGIUNGERE QUESTO SCRIPT PRIMA DELLA CHIUSURA </body>:

```html
<script src="js/schemi.js"></script>
```

## 3. SOSTITUIRE LA SEZIONE "Schemi" NEL MAIN-CONTENT CON QUESTO CODICE:

```html
<section class="main-schemi">
  <h2 style="margin: 0 0 2rem; font-size: 1.8rem; color: var(--text);">Schemi</h2>
  
  <!-- PARTE 1: MURO DELLE IDEE (Schema Cards) -->
  <div class="schemi-grid" id="schemigrid">
    <!-- Schema Card 1 -->
    <div class="schema-card" data-schema-id="mitocondri">
      <div class="schema-card-image">🧬</div>
      <div class="schema-card-content">
        <h3 class="schema-card-title">Schema Mitocondri</h3>
        <p class="schema-card-meta">
          <span>Biologia</span>
          <span>Cellula</span>
        </p>
      </div>
    </div>

    <!-- Schema Card 2 -->
    <div class="schema-card" data-schema-id="fotosintesi">
      <div class="schema-card-image">🌱</div>
      <div class="schema-card-content">
        <h3 class="schema-card-title">Fotosintesi Clorofilliana</h3>
        <p class="schema-card-meta">
          <span>Biologia</span>
          <span>Piante</span>
        </p>
      </div>
    </div>

    <!-- Schema Card 3 -->
    <div class="schema-card" data-schema-id="equazioni">
      <div class="schema-card-image">∑</div>
      <div class="schema-card-content">
        <h3 class="schema-card-title">Equazioni di Secondo Grado</h3>
        <p class="schema-card-meta">
          <span>Matematica</span>
          <span>Algebra</span>
        </p>
      </div>
    </div>

    <!-- Schema Card 4 -->
    <div class="schema-card" data-schema-id="shakespeare">
      <div class="schema-card-image">📖</div>
      <div class="schema-card-content">
        <h3 class="schema-card-title">Shakespeare - Vita e Opere</h3>
        <p class="schema-card-meta">
          <span>Letteratura</span>
          <span>Inglese</span>
        </p>
      </div>
    </div>

    <!-- Schema Card 5 -->
    <div class="schema-card" data-schema-id="sistema-nervoso">
      <div class="schema-card-image">🧠</div>
      <div class="schema-card-content">
        <h3 class="schema-card-title">Sistema Nervoso Umano</h3>
        <p class="schema-card-meta">
          <span>Biologia</span>
          <span>Salute</span>
        </p>
      </div>
    </div>

    <!-- Schema Card 6 -->
    <div class="schema-card" data-schema-id="rivoluzione-francese">
      <div class="schema-card-image">⚔️</div>
      <div class="schema-card-content">
        <h3 class="schema-card-title">Rivoluzione Francese</h3>
        <p class="schema-card-meta">
          <span>Storia</span>
          <span>1789</span>
        </p>
      </div>
    </div>
  </div>

  <!-- PARTE 2: FLASHCARD-SCHEMI (Concetti Interattivi) -->
  <h3 style="margin: 3rem 0 1.5rem; font-size: 1.3rem; color: var(--text);">Flashcard Interattive</h3>
  <div class="flashcards-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
    
    <!-- Flashcard 1: Fotosintesi -->
    <div class="flashcard-schema">
      <div class="flashcard-central">
        <p class="flashcard-title">Processo Biologico</p>
        <p class="flashcard-concept">Fotosintesi</p>
        <p class="flashcard-hint">Clicca per scoprire i concetti collegati</p>
      </div>
      <div class="flashcard-connections">
        <div class="connection-item">
          <span class="connection-icon">☀️</span>
          <p class="connection-label">Energia Solare</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">🍃</span>
          <p class="connection-label">Clorofilla</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">💧</span>
          <p class="connection-label">Acqua</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">CO₂</span>
          <p class="connection-label">Biossido di Carbonio</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">🍬</span>
          <p class="connection-label">Glucosio</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">O₂</span>
          <p class="connection-label">Ossigeno</p>
        </div>
      </div>
    </div>

    <!-- Flashcard 2: Ciclo della Materia -->
    <div class="flashcard-schema">
      <div class="flashcard-central">
        <p class="flashcard-title">Ecologia</p>
        <p class="flashcard-concept">Ciclo del Carbonio</p>
        <p class="flashcard-hint">Clicca per scoprire i concetti collegati</p>
      </div>
      <div class="flashcard-connections">
        <div class="connection-item">
          <span class="connection-icon">🌍</span>
          <p class="connection-label">Atmosfera</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">🌲</span>
          <p class="connection-label">Biosfera</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">⛰️</span>
          <p class="connection-label">Litosfera</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">💨</span>
          <p class="connection-label">Respirazione</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">🔥</span>
          <p class="connection-label">Combustione</p>
        </div>
      </div>
    </div>

    <!-- Flashcard 3: Equazioni Matematiche -->
    <div class="flashcard-schema">
      <div class="flashcard-central">
        <p class="flashcard-title">Algebra</p>
        <p class="flashcard-concept">Teorema di Pitagora</p>
        <p class="flashcard-hint">Clicca per scoprire i concetti collegati</p>
      </div>
      <div class="flashcard-connections">
        <div class="connection-item">
          <span class="connection-icon">📐</span>
          <p class="connection-label">Triangoli</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">∟</span>
          <p class="connection-label">Angoli Retti</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">²</span>
          <p class="connection-label">Quadrati</p>
        </div>
        <div class="connection-item">
          <span class="connection-icon">📏</span>
          <p class="connection-label">Lati</p>
        </div>
      </div>
    </div>

  </div>
</section>
```

## COME AGGIUNGERE NUOVE SCHEMA CARD DINAMICAMENTE:

```javascript
addSchemaCard({
  id: 'mio-schema',
  title: 'Titolo dello Schema',
  subject: 'Materia',
  emoji: '📚',
  tags: ['Tag1', 'Tag2']
});
```

## COME AGGIUNGERE NUOVE FLASHCARD DINAMICAMENTE:

```javascript
addFlashcard({
  title: 'Categoria',
  concept: 'Concetto Centrale',
  connections: [
    { label: 'Concetto 1', icon: '🔹' },
    { label: 'Concetto 2', icon: '🔹' }
  ]
});
```

## CARATTERISTICHE IMPLEMENTATE:

✅ Griglia responsiva per il muro delle idee (stile Pinterest)
✅ Flashcard con reveal interattivo dei concetti collegati
✅ Modal per visualizzare dettagli schema (struttura pronta)
✅ Animazioni fluide e coerenti con il design
✅ Support dark mode
✅ Completamente responsive (mobile, tablet, desktop)
✅ Accessibilità (keyboard support: ESC per chiudere)
✅ JavaScript modulare e facilmente estendibile
