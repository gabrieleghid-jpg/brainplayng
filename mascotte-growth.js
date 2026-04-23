// Sistema di Crescita della Mascotte BrainPlayng
class MascotteGrowthSystem {
    constructor() {
        this.levels = [
            { level: 1, credits: 0, icon: '🥚', name: 'Uovo', color: '#f0f0f0' },
            { level: 2, credits: 10, icon: '🌱', name: 'Germoglio', color: '#90EE90' },
            { level: 3, credits: 25, icon: '🌿', name: 'Piantina', color: '#228B22' },
            { level: 4, credits: 50, icon: '🌳', name: 'Alberello', color: '#006400' },
            { level: 5, credits: 100, icon: '🌲', name: 'Albero', color: '#2E8B57' },
            { level: 6, credits: 200, icon: '🦋', name: 'Farfalla', color: '#FF69B4' },
            { level: 7, credits: 350, icon: '🐦', name: 'Uccellino', color: '#87CEEB' },
            { level: 8, credits: 500, icon: '🦅', name: 'Aquila', color: '#4169E1' },
            { level: 9, credits: 750, icon: '🐉', name: 'Drago', color: '#9400D3' },
            { level: 10, credits: 1000, icon: '🌟', name: 'Stella', color: '#FFD700' },
            { level: 11, credits: 1500, icon: '🚀', name: 'Razzo', color: '#FF4500' },
            { level: 12, credits: 2000, icon: '🌌', name: 'Galassia', color: '#191970' },
            { level: 13, credits: 3000, icon: '👽', name: 'Alieno', color: '#00FF00' },
            { level: 14, credits: 5000, icon: '🤖', name: 'Robot', color: '#C0C0C0' },
            { level: 15, credits: 7500, icon: '👑', name: 'Re', color: '#FFD700' },
            { level: 16, credits: 10000, icon: '🏆', name: 'Campione', color: '#FF6347' },
            { level: 17, credits: 15000, icon: '🎖️', name: 'Eroe', color: '#FF1493' },
            { level: 18, credits: 20000, icon: '🌈', name: 'Arcobaleno', color: '#FF0000' },
            { level: 19, credits: 30000, icon: '⚡', name: 'Tuono', color: '#FFFF00' },
            { level: 20, credits: 50000, icon: '🔮', name: 'Mago', color: '#8A2BE2' }
        ];
        
        this.currentLevel = 1;
        this.previousLevel = 1;
        this.init();
    }

    init() {
        this.loadCurrentLevel();
        this.setupGrowthListener();
    }

    loadCurrentLevel() {
        const savedCredits = parseInt(localStorage.getItem('bp_crediti') || '0');
        this.updateLevel(savedCredits);
    }

    setupGrowthListener() {
        // Intercetta ogni cambiamento dei crediti
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = (key, value) => {
            if (key === 'bp_crediti') {
                const newCredits = parseInt(value);
                this.checkForGrowth(newCredits);
            }
            originalSetItem.call(localStorage, key, value);
        };
    }

    updateLevel(credits) {
        let newLevel = 1;
        
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (credits >= this.levels[i].credits) {
                newLevel = this.levels[i].level;
                break;
            }
        }
        
        this.previousLevel = this.currentLevel;
        this.currentLevel = newLevel;
        
        return newLevel;
    }

    checkForGrowth(newCredits) {
        const oldLevel = this.currentLevel;
        const newLevel = this.updateLevel(newCredits);
        
        if (newLevel > oldLevel) {
            this.showGrowthAnimation(oldLevel, newLevel);
            this.playGrowthSound();
            this.showLevelUpNotification(newLevel);
        }
        
        this.updateAllDisplays(newCredits);
    }

    getCurrentLevelInfo() {
        return this.levels.find(level => level.level === this.currentLevel) || this.levels[0];
    }

    showGrowthAnimation(oldLevel, newLevel) {
        const avatarElement = document.getElementById('avatarDisplay') || document.querySelector('.avatar-base');
        if (!avatarElement) return;

        // Animazione di crescita
        avatarElement.style.transform = 'scale(1.2)';
        avatarElement.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            const levelInfo = this.getCurrentLevelInfo();
            avatarElement.textContent = levelInfo.icon;
            avatarElement.style.background = levelInfo.color;
            avatarElement.style.transform = 'scale(1)';
        }, 500);

        // Effetto particelle
        this.createParticleEffect(avatarElement);
    }

    createParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        const particles = 20;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${this.getCurrentLevelInfo().color};
                border-radius: 50%;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                pointer-events: none;
                z-index: 10000;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / particles;
            const velocity = 100 + Math.random() * 100;
            const lifetime = 1000 + Math.random() * 1000;
            
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.cos(angle) * velocity - 50}%, ${Math.sin(angle) * velocity - 50}%) scale(0)`,
                    opacity: 0 
                }
            ], {
                duration: lifetime,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    }

    playGrowthSound() {
        // Suono di crescita (se disponibile)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7LmOYy0hUqy8');
            audio.volume = 0.3;
            audio.play().catch(() => {});
        } catch (e) {
            // Silenzia errori audio
        }
    }

    showLevelUpNotification(newLevel) {
        const levelInfo = this.getCurrentLevelInfo();
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, ${levelInfo.color}, rgba(255,255,255,0.9));
            color: white;
            padding: 2rem 3rem;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            animation: levelUpPulse 2s ease;
            text-align: center;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">${levelInfo.icon}</div>
            <div>LIVELLO ${newLevel}!</div>
            <div style="font-size: 1rem; margin-top: 0.5rem; opacity: 0.9;">${levelInfo.name}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'levelUpFade 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }

    updateAllDisplays(credits) {
        const levelInfo = this.getCurrentLevelInfo();
        
        // Aggiorna avatar in tutte le pagine
        this.updateAvatarDisplay(levelInfo);
        
        // Aggiorna barra di progresso
        this.updateProgressBar(credits, levelInfo);
        
        // Aggiorna testo livello
        this.updateLevelText(levelInfo);
        
        // Aggiorna crediti
        this.updateCreditsDisplay(credits);
    }

    updateAvatarDisplay(levelInfo) {
        // Home page
        const avatarElements = [
            document.getElementById('avatarDisplay'),
            document.querySelector('.avatar-base'),
            document.getElementById('navAvatar')
        ];
        
        avatarElements.forEach(element => {
            if (element) {
                element.textContent = levelInfo.icon;
                element.style.background = levelInfo.color;
                element.style.color = 'white';
            }
        });
    }

    updateProgressBar(credits, levelInfo) {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        const currentLevelCredits = levelInfo.credits;
        const nextLevel = this.levels.find(l => l.level === levelInfo.level + 1);
        const nextLevelCredits = nextLevel ? nextLevel.credits : currentLevelCredits;
        
        const progress = nextLevel ? 
            ((credits - currentLevelCredits) / (nextLevelCredits - currentLevelCredits)) * 100 : 100;
        
        progressBar.style.width = progress + '%';
        
        // Aggiorna testo progresso
        const progressText = progressBar.parentElement?.nextElementSibling;
        if (progressText) {
            if (nextLevel) {
                progressText.textContent = `${credits - currentLevelCredits} / ${nextLevelCredits - currentLevelCredits} crediti`;
            } else {
                progressText.textContent = 'LIVELLO MASSIMO!';
            }
        }
    }

    updateLevelText(levelInfo) {
        const levelElements = [
            document.getElementById('userLevel'),
            document.querySelector('.level-badge')
        ];
        
        levelElements.forEach(element => {
            if (element) {
                element.textContent = `Lv.${levelInfo.level}`;
            }
        });
    }

    updateCreditsDisplay(credits) {
        const creditsElements = [
            document.getElementById('creditiDisplay'),
            document.getElementById('userCredits')
        ];
        
        creditsElements.forEach(element => {
            if (element) {
                element.textContent = credits + ' crediti';
            }
        });
    }

    // Aggiungi CSS per le animazioni
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes levelUpPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            
            @keyframes levelUpFade {
                0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
            
            .avatar-base {
                transition: all 0.5s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
}

// Inizializza il sistema
window.mascotteGrowth = new MascotteGrowthSystem();
window.mascotteGrowth.injectStyles();

// Funzione globale per aggiornare manualmente
window.updateMascotteGrowth = function(credits) {
    window.mascotteGrowth.checkForGrowth(credits);
};

console.log('Sistema di crescita mascotte caricato!');
