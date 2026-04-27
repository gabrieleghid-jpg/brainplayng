// Game Avatar System - Avatar personalizzabile con grafica da gioco
class GameAvatarSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.equippedItems = {};
        this.avatarParts = new Map();
        this.init();
    }

    init() {
        this.setupCanvas();
        this.loadAvatarAssets();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas = document.getElementById('gameAvatarCanvas');
        if (!this.canvas) {
            console.error('Game avatar canvas not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 300;
        this.canvas.height = 400;
    }

    loadAvatarAssets() {
        // Definizione parti avatar con grafica da gioco
        this.avatarParts = new Map([
            // BODY BASE
            ['body', {
                draw: (ctx, x, y) => {
                    // Corpo base
                    ctx.fillStyle = '#fdbcb4';
                    ctx.beginPath();
                    ctx.ellipse(x, y + 100, 60, 80, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Spalle
                    ctx.beginPath();
                    ctx.ellipse(x - 50, y + 60, 30, 40, -Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(x + 50, y + 60, 30, 40, Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }],

            // HEAD BASE
            ['head', {
                draw: (ctx, x, y) => {
                    // Testa
                    ctx.fillStyle = '#fdbcb4';
                    ctx.beginPath();
                    ctx.ellipse(x, y, 45, 50, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Collo
                    ctx.fillRect(x - 15, y + 45, 30, 25);
                }
            }],

            // EYES
            ['eyes', {
                draw: (ctx, x, y) => {
                    // Occhi base
                    ctx.fillStyle = '#333';
                    ctx.beginPath();
                    ctx.ellipse(x - 15, y - 5, 8, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y - 5, 8, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Occhi luminosi
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.ellipse(x - 13, y - 7, 3, 4, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(x + 17, y - 7, 3, 4, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }],

            // MOUTH
            ['mouth', {
                draw: (ctx, x, y) => {
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(x, y + 15, 15, 0, Math.PI);
                    ctx.stroke();
                }
            }],

            // HAIR BASE
            ['hair', {
                draw: (ctx, x, y) => {
                    ctx.fillStyle = '#8B4513';
                    ctx.beginPath();
                    ctx.ellipse(x, y - 35, 50, 35, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Ciuffi laterali
                    ctx.beginPath();
                    ctx.ellipse(x - 35, y - 20, 20, 30, -Math.PI/4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(x + 35, y - 20, 20, 30, Math.PI/4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }]
        ]);
    }

    setupEventListeners() {
        // Event listeners per interazioni avatar
        window.addEventListener('avatarEquipItem', (e) => {
            this.equipItem(e.detail.itemId);
        });

        window.addEventListener('avatarUnequipItem', (e) => {
            this.unequipItem(e.detail.itemId);
        });
    }

    // Disegna avatar completo
    drawAvatar() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Background
        this.drawBackground();

        const centerX = this.canvas.width / 2;
        const centerY = 100;

        // Disegna parti base
        this.drawPart('body', centerX, centerY);
        this.drawPart('head', centerX, centerY);
        this.drawPart('hair', centerX, centerY);
        this.drawPart('eyes', centerX, centerY);
        this.drawPart('mouth', centerX, centerY);

        // Disegna accessori equipaggiati
        this.drawEquippedAccessories(centerX, centerY);
    }

    drawBackground() {
        // Sfondo gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#e3f2fd');
        gradient.addColorStop(1, '#bbdefb');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPart(partId, x, y) {
        const part = this.avatarParts.get(partId);
        if (part && part.draw) {
            part.draw(this.ctx, x, y);
        }
    }

    drawEquippedAccessories(centerX, centerY) {
        Object.keys(this.equippedItems).forEach(itemId => {
            const accessory = this.getAccessoryDefinition(itemId);
            if (accessory && accessory.draw) {
                accessory.draw(this.ctx, centerX, centerY);
            }
        });
    }

    getAccessoryDefinition(itemId) {
        // Definizioni accessori con grafica da gioco
        const accessories = {
            // VESTITI
            'outfit-space': {
                draw: (ctx, x, y) => {
                    // Tuta astronauta
                    ctx.fillStyle = '#f0f0f0';
                    ctx.beginPath();
                    ctx.ellipse(x, y + 100, 65, 85, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Dettagli tuta
                    ctx.strokeStyle = '#d0d0d0';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x - 65, y + 100);
                    ctx.lineTo(x + 65, y + 100);
                    ctx.stroke();
                    
                    // Casco
                    ctx.fillStyle = 'rgba(224, 224, 224, 0.8)';
                    ctx.beginPath();
                    ctx.ellipse(x, y, 48, 52, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Visiera
                    ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
                    ctx.fillRect(x - 40, y - 20, 80, 40);
                }
            },

            'outfit-ninja': {
                draw: (ctx, x, y) => {
                    // Abito ninja
                    ctx.fillStyle = '#1a1a1a';
                    ctx.beginPath();
                    ctx.ellipse(x, y + 100, 62, 82, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Cintura rossa
                    ctx.fillStyle = '#dc143c';
                    ctx.fillRect(x - 30, y + 90, 60, 8);
                    
                    // Maschera
                    ctx.fillStyle = 'rgba(42, 42, 42, 0.9)';
                    ctx.fillRect(x - 25, y - 10, 50, 20);
                }
            },

            'outfit-royal': {
                draw: (ctx, x, y) => {
                    // Abito regale
                    ctx.fillStyle = '#4b0082';
                    ctx.beginPath();
                    ctx.ellipse(x, y + 100, 62, 82, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Mantello
                    ctx.fillStyle = '#8b008b';
                    ctx.beginPath();
                    ctx.moveTo(x - 70, y + 60);
                    ctx.lineTo(x + 70, y + 60);
                    ctx.lineTo(x + 80, y + 200);
                    ctx.lineTo(x - 80, y + 200);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Riflessi dorati
                    ctx.strokeStyle = '#ffd700';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.ellipse(x, y + 100, 60, 80, 0, 0, Math.PI * 2);
                    ctx.stroke();
                }
            },

            // CAPPELLI
            'hat-wizard': {
                draw: (ctx, x, y) => {
                    // Cappello mago
                    ctx.fillStyle = '#4b0082';
                    ctx.beginPath();
                    ctx.moveTo(x - 30, y - 40);
                    ctx.lineTo(x - 10, y - 80);
                    ctx.lineTo(x + 10, y - 80);
                    ctx.lineTo(x + 30, y - 40);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Stella e luna
                    ctx.fillStyle = '#ffd700';
                    this.drawStar(ctx, x, y - 60, 8);
                    this.drawMoon(ctx, x + 15, y - 55, 6);
                }
            },

            'hat-crown': {
                draw: (ctx, x, y) => {
                    // Corona
                    ctx.fillStyle = '#ffd700';
                    ctx.beginPath();
                    ctx.moveTo(x - 35, y - 30);
                    ctx.lineTo(x - 25, y - 50);
                    ctx.lineTo(x - 15, y - 35);
                    ctx.lineTo(x - 5, y - 55);
                    ctx.lineTo(x + 5, y - 35);
                    ctx.lineTo(x + 15, y - 55);
                    ctx.lineTo(x + 25, y - 35);
                    ctx.lineTo(x + 35, y - 50);
                    ctx.lineTo(x + 35, y - 30);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Gemme
                    ctx.fillStyle = '#ff0000';
                    this.drawGem(ctx, x - 25, y - 40, 4);
                    this.drawGem(ctx, x, y - 45, 5);
                    this.drawGem(ctx, x + 25, y - 40, 4);
                }
            },

            'hat-halo': {
                draw: (ctx, x, y) => {
                    // Aureola
                    ctx.strokeStyle = '#ffff00';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.ellipse(x, y - 60, 25, 8, 0, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Luminosità
                    ctx.shadowColor = '#ffff00';
                    ctx.shadowBlur = 20;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            },

            'hat-baseball': {
                draw: (ctx, x, y) => {
                    // Berretto baseball
                    ctx.fillStyle = '#dc143c';
                    ctx.beginPath();
                    ctx.ellipse(x, y - 45, 40, 20, 0, 0, Math.PI);
                    ctx.fill();
                    
                    // Visiera
                    ctx.fillStyle = '#000';
                    ctx.fillRect(x - 45, y - 35, 90, 8);
                    
                    // Logo
                    ctx.fillStyle = '#fff';
                    ctx.font = '12px Arial';
                    ctx.fillText('BP', x - 8, y - 40);
                }
            },

            // ACCESSORI
            'accessory-glasses': {
                draw: (ctx, x, y) => {
                    // Occhiali da sole
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 3;
                    
                    // Lenti
                    ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
                    ctx.beginPath();
                    ctx.ellipse(x - 15, y - 5, 12, 15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y - 5, 12, 15, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Ponte
                    ctx.beginPath();
                    ctx.moveTo(x - 3, y - 5);
                    ctx.lineTo(x + 3, y - 5);
                    ctx.stroke();
                }
            },

            'accessory-necklace': {
                draw: (ctx, x, y) => {
                    // Collana
                    ctx.strokeStyle = '#c0c0c0';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.arc(x, y + 40, 25, Math.PI, 0);
                    ctx.stroke();
                    
                    // Amuleto
                    ctx.fillStyle = '#9400d3';
                    ctx.beginPath();
                    ctx.ellipse(x, y + 65, 15, 20, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Simbolo magico
                    ctx.fillStyle = '#ffd700';
                    ctx.font = '16px Arial';
                    ctx.fillText('✦', x - 8, y + 70);
                }
            },

            // SFONDI
            'bg-space': {
                draw: (ctx, x, y) => {
                    // Sfondo spazio
                    const gradient = ctx.createRadialGradient(x, y, 50, x, y, 200);
                    gradient.addColorStop(0, '#000428');
                    gradient.addColorStop(1, '#004e92');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    
                    // Stelle
                    ctx.fillStyle = '#fff';
                    for (let i = 0; i < 50; i++) {
                        const starX = Math.random() * ctx.canvas.width;
                        const starY = Math.random() * ctx.canvas.height;
                        const starSize = Math.random() * 2;
                        ctx.beginPath();
                        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            },

            'bg-sunset': {
                draw: (ctx, x, y) => {
                    // Sfondo tramonto
                    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
                    gradient.addColorStop(0, '#ff6b6b');
                    gradient.addColorStop(0.5, '#feca57');
                    gradient.addColorStop(1, '#48dbfb');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    
                    // Sole
                    ctx.fillStyle = '#ff9ff3';
                    ctx.beginPath();
                    ctx.arc(ctx.canvas.width - 50, 50, 30, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        return accessories[itemId];
    }

    // Funzioni helper per disegnare elementi
    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const innerAngle = angle + Math.PI / 5;
            
            if (i === 0) {
                ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
            } else {
                ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
            }
            ctx.lineTo(x + Math.cos(innerAngle) * size/2, y + Math.sin(innerAngle) * size/2);
        }
        ctx.closePath();
        ctx.fill();
    }

    drawMoon(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGem(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
        ctx.fill();
    }

    // Equipaggiamento oggetti
    equipItem(itemId) {
        this.equippedItems[itemId] = true;
        this.drawAvatar();
        this.saveEquippedItems();
    }

    unequipItem(itemId) {
        delete this.equippedItems[itemId];
        this.drawAvatar();
        this.saveEquippedItems();
    }

    // Salvataggio/caricamento
    saveEquippedItems() {
        try {
            localStorage.setItem('bp_game_avatar_equipped', JSON.stringify(this.equippedItems));
        } catch (error) {
            console.error('Error saving equipped items:', error);
        }
    }

    loadEquippedItems() {
        try {
            const saved = localStorage.getItem('bp_game_avatar_equipped');
            this.equippedItems = saved ? JSON.parse(saved) : {};
            this.drawAvatar();
        } catch (error) {
            console.error('Error loading equipped items:', error);
            this.equippedItems = {};
        }
    }

    // Refresh completo
    refresh() {
        this.loadEquippedItems();
        this.drawAvatar();
    }

    // Reset avatar
    reset() {
        this.equippedItems = {};
        this.saveEquippedItems();
        this.drawAvatar();
    }

    // Get equipped items
    getEquippedItems() {
        return { ...this.equippedItems };
    }
}

// Export per uso globale
window.GameAvatarSystem = GameAvatarSystem;
