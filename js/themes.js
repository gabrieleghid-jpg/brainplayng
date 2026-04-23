// Sistema Temi Dinamici - Applicabile a tutte le pagine

// CSS per temi dinamici
const themeStyles = `
/* Temi Dinamici */
body.theme-dark-premium {
    background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%) !important;
}

body.theme-dark-premium .nav {
    background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%) !important;
}

body.theme-dark-premium .tool-card {
    background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%) !important;
}

body.theme-dark-premium .hero-card,
body.theme-dark-premium .section-card,
body.theme-dark-premium .profile-card {
    background: #2d2d44 !important;
    color: white !important;
}

body.theme-dark-premium h1,
body.theme-dark-premium h2,
body.theme-dark-premium h3 {
    color: white !important;
}

body.theme-dark-premium p,
body.theme-dark-premium .hero-subtitle {
    color: #ccc !important;
}

body.theme-ocean {
    background: linear-gradient(135deg, #006994 0%, #004d6b 100%) !important;
}

body.theme-ocean .nav {
    background: linear-gradient(135deg, #0088b3 0%, #006994 100%) !important;
}

body.theme-ocean .tool-card {
    background: linear-gradient(135deg, #0088b3 0%, #006994 100%) !important;
}

body.theme-ocean .hero-card,
body.theme-ocean .section-card,
body.theme-ocean .profile-card {
    background: #0088b3 !important;
    color: white !important;
}

body.theme-ocean h1,
body.theme-ocean h2,
body.theme-ocean h3 {
    color: white !important;
}

body.theme-ocean p,
body.theme-ocean .hero-subtitle {
    color: #e6f7ff !important;
}

body.theme-forest {
    background: linear-gradient(135deg, #2d5016 0%, #1a3009 100%) !important;
}

body.theme-forest .nav {
    background: linear-gradient(135deg, #4a7c2e 0%, #2d5016 100%) !important;
}

body.theme-forest .tool-card {
    background: linear-gradient(135deg, #4a7c2e 0%, #2d5016 100%) !important;
}

body.theme-forest .hero-card,
body.theme-forest .section-card,
body.theme-forest .profile-card {
    background: #4a7c2e !important;
    color: white !important;
}

body.theme-forest h1,
body.theme-forest h2,
body.theme-forest h3 {
    color: white !important;
}

body.theme-forest p,
body.theme-forest .hero-subtitle {
    color: #e8f5e8 !important;
}
`;

// Funzione per inizializzare i temi
function initializeThemes() {
    // Aggiungi gli stili dei temi
    if (!document.getElementById('theme-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'theme-styles';
        styleElement.textContent = themeStyles;
        document.head.appendChild(styleElement);
    }

    // Applica il tema salvato
    applySavedTheme();
}

// Funzione per applicare il tema salvato
function applySavedTheme() {
    const activeTheme = localStorage.getItem('activeTheme');
    if (activeTheme) {
        document.body.classList.add(activeTheme);
    }
}

// Funzione per applicare un tema specifico
function applyTheme(theme) {
    // Rimuovi tutti i temi esistenti
    document.body.classList.remove('theme-dark-premium', 'theme-ocean', 'theme-forest');
    
    // Applica il nuovo tema
    document.body.classList.add(theme.className);
    localStorage.setItem('activeTheme', theme.className);
    
    // Mostra notifica se disponibile la funzione
    if (typeof showNotification === 'function') {
        showNotification(`Tema applicato: ${theme.name}!`, 'success');
    }
}

// Inizializza quando il DOM è caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemes);
} else {
    initializeThemes();
}

// Esporta le funzioni per uso globale
window.themeManager = {
    applyTheme,
    applySavedTheme,
    initializeThemes
};
