// Enhanced Avatar Renderer Module - Supporto completo cosmetici
class EnhancedAvatarRenderer {
    constructor() {
        this.canvas = null;
        this.equippedItems = {};
        this.cosmeticEffects = new Map();
        this.animations = new Map();
        this.init();
    }

    init() {
        this.canvas = document.getElementById('avatarCanvas');
        if (!this.canvas) {
            console.error('Avatar canvas not found');
            return;
        }
        
        this.loadCosmeticDefinitions();
        this.setupAnimationSystem();
    }

    loadCosmeticDefinitions() {
        // Definizioni per ogni tipo di cosmetico
        this.cosmeticDefinitions = {
            // SKINS
            'skin-neon': {
                type: 'skin',
                effects: {
                    bodyFill: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
                    glow: true,
                    glowColor: '#00ffff'
                }
            },
            'skin-galaxy': {
                type: 'skin',
                effects: {
                    bodyFill: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)',
                    stars: true,
                    glow: true,
                    glowColor: '#4a69bd'
                }
            },
            'skin-dragon': {
                type: 'skin',
                effects: {
                    bodyFill: 'linear-gradient(45deg, #ff6b35, #f77737, #ff4500)',
                    scales: true,
                    scalesColor: '#ff4500',
                    glow: true,
                    glowColor: '#ff6347'
                }
            },

            // OUTFITS
            'outfit-space': {
                type: 'outfit',
                effects: {
                    bodyFill: '#f0f0f0',
                    helmet: true,
                    helmetColor: '#e0e0e0',
                    visor: true,
                    visorColor: '#4a90e2'
                }
            },
            'outfit-ninja': {
                type: 'outfit',
                effects: {
                    bodyFill: '#1a1a1a',
                    belt: true,
                    beltColor: '#dc143c',
                    mask: true,
                    maskColor: '#2a2a2a'
                }
            },
            'outfit-royal': {
                type: 'outfit',
                effects: {
                    bodyFill: '#4b0082',
                    cape: true,
                    capeColor: '#8b008b',
                    trim: true,
                    trimColor: '#ffd700'
                }
            },

            // HATS
            'hat-wizard': {
                type: 'hat',
                effects: {
                    hatShape: 'wizard',
                    hatColor: '#4b0082',
                    stars: true,
                    starsColor: '#ffd700'
                }
            },
            'hat-crown': {
                type: 'hat',
                effects: {
                    hatShape: 'crown',
                    hatColor: '#ffd700',
                    gems: true,
                    gemsColor: '#ff0000'
                }
            },
            'hat-halo': {
                type: 'hat',
                effects: {
                    hatShape: 'halo',
                    haloColor: '#ffff00',
                    glow: true,
                    glowColor: '#ffffff'
                }
            },

            // ACCESSORIES
            'accessory-glasses': {
                type: 'face',
                effects: {
                    glasses: true,
                    glassesColor: '#333333',
                    lenses: true,
                    lensesColor: '#87ceeb'
                }
            },
            'accessory-earrings': {
                type: 'neck',
                effects: {
                    earrings: true,
                    earringsColor: '#ffd700',
                    gems: true,
                    gemsColor: '#ff69b4'
                }
            },
            'accessory-necklace': {
                type: 'neck',
                effects: {
                    necklace: true,
                    necklaceColor: '#c0c0c0',
                    pendant: true,
                    pendantColor: '#9400d3'
                }
            },

            // BACKGROUNDS
            'bg-space': {
                type: 'background',
                effects: {
                    backgroundFill: 'linear-gradient(135deg, #000428, #004e92)',
                    stars: true,
                    starsDensity: 'medium',
                    nebula: true,
                    nebulaColor: '#ff00ff'
                }
            },
            'bg-sunset': {
                type: 'background',
                effects: {
                    backgroundFill: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb)',
                    sun: true,
                    sunColor: '#ff9ff3',
                    clouds: true,
                    cloudsColor: '#ffffff'
                }
            },
            'bg-aurora': {
                type: 'background',
                effects: {
                    backgroundFill: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
                    aurora: true,
                    auroraColors: ['#00ff00', '#ff00ff', '#00ffff'],
                    stars: true,
                    starsDensity: 'low'
                }
            },

            // FRAMES
            'frame-gold': {
                type: 'frame',
                effects: {
                    frameStyle: 'ornate',
                    frameColor: '#ffd700',
                    frameWidth: 'medium',
                    corners: true,
                    cornerStyle: 'classic'
                }
            },
            'frame-neon': {
                type: 'frame',
                effects: {
                    frameStyle: 'modern',
                    frameColor: '#00ffff',
                    frameWidth: 'thin',
                    glow: true,
                    glowColor: '#ff00ff',
                    animated: true
                }
            },
            'frame-dragon': {
                type: 'frame',
                effects: {
                    frameStyle: 'mythic',
                    frameColor: '#8b0000',
                    frameWidth: 'thick',
                    dragons: true,
                    dragonColor: '#ff4500',
                    flames: true,
                    flameColor: '#ff6347'
                }
            }
        };
    }

    setupAnimationSystem() {
        // Sistema di animazioni per emote e effetti
        this.animations.set('emote-dance', {
            name: 'dance',
            duration: 3000,
            keyframes: [
                { time: 0, transform: 'rotate(0deg) scale(1)' },
                { time: 25, transform: 'rotate(-10deg) scale(1.1)' },
                { time: 50, transform: 'rotate(10deg) scale(1.1)' },
                { time: 75, transform: 'rotate(-10deg) scale(1.1)' },
                { time: 100, transform: 'rotate(0deg) scale(1)' }
            ]
        });

        this.animations.set('emote-wave', {
            name: 'wave',
            duration: 2000,
            keyframes: [
                { time: 0, armRotation: 0 },
                { time: 25, armRotation: 45 },
                { time: 50, armRotation: -30 },
                { time: 75, armRotation: 45 },
                { time: 100, armRotation: 0 }
            ]
        });

        this.animations.set('emote-backflip', {
            name: 'backflip',
            duration: 1500,
            keyframes: [
                { time: 0, transform: 'rotateY(0deg) translateY(0px)' },
                { time: 25, transform: 'rotateY(90deg) translateY(-20px)' },
                { time: 50, transform: 'rotateY(180deg) translateY(-40px)' },
                { time: 75, transform: 'rotateY(270deg) translateY(-20px)' },
                { time: 100, transform: 'rotateY(360deg) translateY(0px)' }
            ]
        });
    }

    // Applica oggetto equipaggiato
    applyCosmetic(itemId) {
        const cosmetic = this.cosmeticDefinitions[itemId];
        if (!cosmetic) {
            console.warn(`Cosmetic ${itemId} not found`);
            return false;
        }

        this.equippedItems[cosmetic.type] = itemId;
        this.applyCosmeticEffects(cosmetic);
        this.updateAvatar();
        return true;
    }

    // Rimuovi oggetto equipaggiato
    removeCosmetic(itemId) {
        const cosmetic = this.cosmeticDefinitions[itemId];
        if (!cosmetic) return false;

        delete this.equippedItems[cosmetic.type];
        this.removeCosmeticEffects(cosmetic);
        this.updateAvatar();
        return true;
    }

    // Applica effetti del cosmetico
    applyCosmeticEffects(cosmetic) {
        const effects = cosmetic.effects;
        
        switch(cosmetic.type) {
            case 'skin':
                this.applySkinEffects(effects);
                break;
            case 'outfit':
                this.applyOutfitEffects(effects);
                break;
            case 'hat':
                this.applyHatEffects(effects);
                break;
            case 'face':
            case 'neck':
                this.applyAccessoryEffects(effects);
                break;
            case 'background':
                this.applyBackgroundEffects(effects);
                break;
            case 'frame':
                this.applyFrameEffects(effects);
                break;
        }
    }

    // Rimuovi effetti del cosmetico
    removeCosmeticEffects(cosmetic) {
        const effects = cosmetic.effects;
        
        switch(cosmetic.type) {
            case 'skin':
                this.removeSkinEffects(effects);
                break;
            case 'outfit':
                this.removeOutfitEffects(effects);
                break;
            case 'hat':
                this.removeHatEffects(effects);
                break;
            case 'face':
            case 'neck':
                this.removeAccessoryEffects(effects);
                break;
            case 'background':
                this.removeBackgroundEffects(effects);
                break;
            case 'frame':
                this.removeFrameEffects(effects);
                break;
        }
    }

    // SKIN EFFECTS
    applySkinEffects(effects) {
        const head = this.canvas.querySelector('#avatarHead');
        if (head && effects.bodyFill) {
            head.setAttribute('fill', effects.bodyFill);
        }

        if (effects.glow) {
            this.addGlowEffect('#avatarHead', effects.glowColor);
        }

        if (effects.scales) {
            this.addScalesEffect('#avatarHead', effects.scalesColor);
        }

        if (effects.stars) {
            this.addStarsEffect('#avatarHead');
        }
    }

    removeSkinEffects(effects) {
        const head = this.canvas.querySelector('#avatarHead');
        if (head) {
            head.setAttribute('fill', '#fdbcb4'); // Default skin color
        }

        this.removeGlowEffect('#avatarHead');
        this.removeScalesEffect('#avatarHead');
        this.removeStarsEffect('#avatarHead');
    }

    // OUTFIT EFFECTS
    applyOutfitEffects(effects) {
        const shirt = this.canvas.querySelector('#avatarShirt');
        if (shirt && effects.bodyFill) {
            shirt.setAttribute('fill', effects.bodyFill);
        }

        if (effects.helmet) {
            this.addHelmetEffect(effects.helmetColor, effects.visorColor);
        }

        if (effects.cape) {
            this.addCapeEffect(effects.capeColor, effects.trimColor);
        }

        if (effects.belt) {
            this.addBeltEffect(effects.beltColor);
        }

        if (effects.mask) {
            this.addMaskEffect(effects.maskColor);
        }
    }

    removeOutfitEffects(effects) {
        const shirt = this.canvas.querySelector('#avatarShirt');
        if (shirt) {
            shirt.setAttribute('fill', '#4a90e2'); // Default shirt color
        }

        this.removeHelmetEffect();
        this.removeCapeEffect();
        this.removeBeltEffect();
        this.removeMaskEffect();
    }

    // HAT EFFECTS
    applyHatEffects(effects) {
        const hatContainer = this.canvas.querySelector('#hatContainer');
        if (!hatContainer) {
            this.createHatContainer();
        }

        let hatHTML = '';
        
        switch(effects.hatShape) {
            case 'wizard':
                hatHTML = `
                    <path d="M 35 25 Q 35 10, 50 8 Q 65 10, 65 25 L 60 35 Q 50 30, 40 35 Z" 
                          fill="${effects.hatColor}" stroke="#333" stroke-width="1"/>
                    ${effects.stars ? this.generateStars(effects.starsColor) : ''}
                `;
                break;
            case 'crown':
                hatHTML = `
                    <path d="M 30 25 L 35 15 L 40 20 L 45 12 L 50 20 L 55 12 L 60 20 L 65 15 L 70 25 L 65 30 L 35 30 Z" 
                          fill="${effects.hatColor}" stroke="#333" stroke-width="1"/>
                    ${effects.gems ? this.generateGems(effects.gemsColor) : ''}
                `;
                break;
            case 'halo':
                hatHTML = `
                    <circle cx="50" cy="15" r="8" fill="none" stroke="${effects.haloColor}" stroke-width="3" opacity="0.8"/>
                    ${effects.glow ? this.addGlowToElement('halo', effects.glowColor) : ''}
                `;
                break;
        }

        const container = this.canvas.querySelector('#hatContainer');
        if (container) {
            container.innerHTML = hatHTML;
        }
    }

    removeHatEffects(effects) {
        const hatContainer = this.canvas.querySelector('#hatContainer');
        if (hatContainer) {
            hatContainer.innerHTML = '';
        }
    }

    // ACCESSORY EFFECTS
    applyAccessoryEffects(effects) {
        if (effects.glasses) {
            this.addGlassesEffect(effects.glassesColor, effects.lensesColor);
        }

        if (effects.earrings) {
            this.addEarringsEffect(effects.earringsColor, effects.gemsColor);
        }

        if (effects.necklace) {
            this.addNecklaceEffect(effects.necklaceColor, effects.pendantColor);
        }
    }

    removeAccessoryEffects(effects) {
        this.removeGlassesEffect();
        this.removeEarringsEffect();
        this.removeNecklaceEffect();
    }

    // BACKGROUND EFFECTS
    applyBackgroundEffects(effects) {
        const background = document.getElementById('avatarBackground');
        if (background && effects.backgroundFill) {
            background.style.background = effects.backgroundFill;
        }

        if (effects.stars) {
            this.addBackgroundStars(effects.starsDensity || 'medium');
        }

        if (effects.nebula) {
            this.addNebulaEffect(effects.nebulaColor);
        }

        if (effects.sun) {
            this.addSunEffect(effects.sunColor);
        }

        if (effects.clouds) {
            this.addCloudsEffect(effects.cloudsColor);
        }

        if (effects.aurora) {
            this.addAuroraEffect(effects.auroraColors);
        }
    }

    removeBackgroundEffects(effects) {
        const background = document.getElementById('avatarBackground');
        if (background) {
            background.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'; // Default
        }

        this.removeBackgroundStars();
        this.removeNebulaEffect();
        this.removeSunEffect();
        this.removeCloudsEffect();
        this.removeAuroraEffect();
    }

    // FRAME EFFECTS
    applyFrameEffects(effects) {
        const frameBorder = document.getElementById('avatarFrameBorder');
        if (!frameBorder) return;

        let frameStyle = '';
        
        switch(effects.frameStyle) {
            case 'ornate':
                frameStyle = `
                    border: ${this.getFrameWidth(effects.frameWidth)} solid ${effects.frameColor};
                    border-radius: 15px;
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
                    ${effects.corners ? this.addCornerStyle(effects.cornerStyle) : ''}
                `;
                break;
            case 'modern':
                frameStyle = `
                    border: ${this.getFrameWidth(effects.frameWidth)} solid ${effects.frameColor};
                    border-radius: 10px;
                    ${effects.glow ? `box-shadow: 0 0 15px ${effects.glowColor};` : ''}
                    ${effects.animated ? 'animation: framePulse 2s infinite;' : ''}
                `;
                break;
            case 'mythic':
                frameStyle = `
                    border: ${this.getFrameWidth(effects.frameWidth)} solid ${effects.frameColor};
                    border-radius: 5px;
                    ${effects.dragons ? this.addDragonDecorations(effects.dragonColor) : ''}
                    ${effects.flames ? this.addFlameEffects(effects.flameColor) : ''}
                `;
                break;
        }

        frameBorder.style.cssText = frameStyle;
    }

    removeFrameEffects(effects) {
        const frameBorder = document.getElementById('avatarFrameBorder');
        if (frameBorder) {
            frameBorder.style.cssText = '';
        }
    }

    // Funzioni helper per effetti specifici
    addGlowEffect(selector, color) {
        const element = this.canvas.querySelector(selector);
        if (element) {
            element.style.filter = `drop-shadow(0 0 10px ${color})`;
        }
    }

    removeGlowEffect(selector) {
        const element = this.canvas.querySelector(selector);
        if (element) {
            element.style.filter = '';
        }
    }

    addScalesEffect(selector, color) {
        const element = this.canvas.querySelector(selector);
        if (element) {
            element.style.fill = `url(#scalesPattern)`;
            this.createScalesPattern(color);
        }
    }

    createScalesPattern(color) {
        const defs = this.canvas.querySelector('defs') || this.createDefs();
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.id = 'scalesPattern';
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('width', '10');
        pattern.setAttribute('height', '10');
        
        pattern.innerHTML = `
            <circle cx="5" cy="5" r="4" fill="${color}" opacity="0.7"/>
            <circle cx="0" cy="0" r="4" fill="${color}" opacity="0.7"/>
            <circle cx="10" cy="10" r="4" fill="${color}" opacity="0.7"/>
        `;
        
        defs.appendChild(pattern);
    }

    createDefs() {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        this.canvas.appendChild(defs);
        return defs;
    }

    generateStars(color) {
        return `
            <circle cx="40" cy="18" r="1" fill="${color}"/>
            <circle cx="50" cy="15" r="1.5" fill="${color}"/>
            <circle cx="60" cy="18" r="1" fill="${color}"/>
            <circle cx="45" cy="22" r="0.8" fill="${color}"/>
            <circle cx="55" cy="22" r="0.8" fill="${color}"/>
        `;
    }

    generateGems(color) {
        return `
            <circle cx="40" cy="20" r="2" fill="${color}"/>
            <circle cx="50" cy="18" r="2.5" fill="${color}"/>
            <circle cx="60" cy="20" r="2" fill="${color}"/>
        `;
    }

    createHatContainer() {
        const hatContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        hatContainer.id = 'hatContainer';
        this.canvas.insertBefore(hatContainer, this.canvas.querySelector('#avatarHead'));
    }

    // Emote animations
    playEmote(emoteId) {
        const animation = this.animations.get(emoteId);
        if (!animation) return;

        const avatarElement = this.canvas.parentElement;
        avatarElement.style.animation = 'none';
        
        setTimeout(() => {
            avatarElement.style.animation = `${animation.name} ${animation.duration}ms ease-in-out`;
        }, 10);

        setTimeout(() => {
            avatarElement.style.animation = '';
        }, animation.duration);
    }

    // Update completo avatar
    updateAvatar() {
        if (!this.canvas) return;
        
        // Applica tutti gli oggetti equipaggiati
        Object.values(this.equippedItems).forEach(itemId => {
            const cosmetic = this.cosmeticDefinitions[itemId];
            if (cosmetic) {
                this.applyCosmeticEffects(cosmetic);
            }
        });
    }

    // Get equipped items
    getEquippedItems() {
        return { ...this.equippedItems };
    }

    // Reset all cosmetics
    resetAllCosmetics() {
        this.equippedItems = {};
        this.resetToDefault();
    }

    resetToDefault() {
        // Reset to default appearance
        const head = this.canvas.querySelector('#avatarHead');
        const shirt = this.canvas.querySelector('#avatarShirt');
        
        if (head) head.setAttribute('fill', '#fdbcb4');
        if (shirt) shirt.setAttribute('fill', '#4a90e2');
        
        // Remove all effects
        this.removeGlowEffect('#avatarHead');
        this.removeHatEffects({});
        this.removeAccessoryEffects({});
        this.removeBackgroundEffects({});
        this.removeFrameEffects({});
        
        // Clear containers
        const hatContainer = this.canvas.querySelector('#hatContainer');
        const accessoriesContainer = this.canvas.querySelector('#accessoriesContainer');
        
        if (hatContainer) hatContainer.innerHTML = '';
        if (accessoriesContainer) accessoriesContainer.innerHTML = '';
    }

    // Get frame width
    getFrameWidth(width) {
        const widths = {
            thin: '2px',
            medium: '4px',
            thick: '6px'
        };
        return widths[width] || '4px';
    }
}

// Export for global use
window.EnhancedAvatarRenderer = EnhancedAvatarRenderer;
