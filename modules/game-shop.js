// Game Shop Module - Sistema Negozio Completo
class GameShopModule {
    constructor() {
        this.products = this.initializeProducts();
        this.inventory = this.loadInventory();
        this.equipped = this.loadEquipped();
        this.premiumCurrency = this.loadPremiumCurrency();
    }

    // Sistema Rarità
    getRarityConfig() {
        return {
            common: {
                name: 'Comune',
                color: '#9ca3af',
                borderColor: '#6b7280',
                gradient: 'linear-gradient(135deg, #9ca3af, #6b7280)',
                icon: '⚪'
            },
            rare: {
                name: 'Raro',
                color: '#3b82f6',
                borderColor: '#2563eb',
                gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                icon: '🔵'
            },
            epic: {
                name: 'Epico',
                color: '#8b5cf6',
                borderColor: '#7c3aed',
                gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                icon: '🟣'
            },
            legendary: {
                name: 'Leggendario',
                color: '#f59e0b',
                borderColor: '#d97706',
                gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
                icon: '🟡'
            },
            mythic: {
                name: 'Mitico',
                color: '#ef4444',
                borderColor: '#dc2626',
                gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
                icon: '🔴'
            }
        };
    }

    initializeProducts() {
        return {
            // VESTITI
            'outfit-space': {
                id: 'outfit-space',
                name: 'Tuta Astronauta',
                category: 'outfits',
                rarity: 'rare',
                price: 200,
                premiumPrice: 15,
                description: 'Tuta completa da astronauta professionale',
                icon: '👨‍🚀',
                slot: 'body',
                type: 'outfit'
            },
            'outfit-ninja': {
                id: 'outfit-ninja',
                name: 'Equipaggiamento Ninja',
                category: 'outfits',
                rarity: 'epic',
                price: 450,
                premiumPrice: 35,
                description: 'Completo ninja nero con cintura rossa',
                icon: '🥷',
                slot: 'body',
                type: 'outfit'
            },
            'outfit-royal': {
                id: 'outfit-royal',
                name: 'Abito Reale',
                category: 'outfits',
                rarity: 'legendary',
                price: 900,
                premiumPrice: 70,
                description: 'Abito regale con mantello dorato',
                icon: '�',
                slot: 'body',
                type: 'outfit'
            },
            'outfit-casual': {
                id: 'outfit-casual',
                name: 'Outfit Casual',
                category: 'outfits',
                rarity: 'common',
                price: 100,
                premiumPrice: 8,
                description: 'Abito casual comodo per tutti i giorni',
                icon: '�',
                slot: 'body',
                type: 'outfit'
            },
            'outfit-sport': {
                id: 'outfit-sport',
                name: 'Tenuta Sportiva',
                category: 'outfits',
                rarity: 'common',
                price: 120,
                premiumPrice: 10,
                description: 'Tenuta sportiva con logo',
                icon: '🏃',
                slot: 'body',
                type: 'outfit'
            },
            'outfit-formal': {
                id: 'outfit-formal',
                name: 'Abito Formale',
                category: 'outfits',
                rarity: 'rare',
                price: 250,
                premiumPrice: 20,
                description: 'Abito elegante per occasioni speciali',
                icon: '🤵',
                slot: 'body',
                type: 'outfit'
            },

            // CAPPELLI
            'hat-wizard': {
                id: 'hat-wizard',
                name: 'Cappello da Mago',
                category: 'hats',
                rarity: 'rare',
                price: 150,
                premiumPrice: 12,
                description: 'Cappello a punta con stelle e lune',
                icon: '🎩',
                slot: 'head',
                type: 'hat'
            },
            'hat-crown': {
                id: 'hat-crown',
                name: 'Corona Reale',
                category: 'hats',
                rarity: 'epic',
                price: 350,
                premiumPrice: 28,
                description: 'Corona dorata con gemme preziose',
                icon: '👑',
                slot: 'head',
                type: 'hat'
            },
            'hat-halo': {
                id: 'hat-halo',
                name: 'Aureola Angelica',
                category: 'hats',
                rarity: 'legendary',
                price: 600,
                premiumPrice: 45,
                description: 'Aureola luminosa con effetti divini',
                icon: '😇',
                slot: 'head',
                type: 'hat'
            },
            'hat-baseball': {
                id: 'hat-baseball',
                name: 'Berretto da Baseball',
                category: 'hats',
                rarity: 'common',
                price: 80,
                premiumPrice: 6,
                description: 'Berretto da baseball con logo',
                icon: '🧢',
                slot: 'head',
                type: 'hat'
            },
            'hat-beanie': {
                id: 'hat-beanie',
                name: 'Berretto Invernale',
                category: 'hats',
                rarity: 'common',
                price: 90,
                premiumPrice: 7,
                description: 'Berretto caldo per l\'inverno',
                icon: '🧥',
                slot: 'head',
                type: 'hat'
            },
            'hat-pirate': {
                id: 'hat-pirate',
                name: 'Cappello da Pirata',
                category: 'hats',
                rarity: 'epic',
                price: 300,
                premiumPrice: 25,
                description: 'Cappello da pirata con teschio',
                icon: '🏴‍☠️',
                slot: 'head',
                type: 'hat'
            },

            // ACCESSORI
            'accessory-glasses': {
                id: 'accessory-glasses',
                name: 'Occhiali da Sole',
                category: 'accessories',
                rarity: 'common',
                price: 50,
                premiumPrice: 5,
                description: 'Occhiali da sole stile aviatore',
                icon: '🕶️',
                slot: 'face',
                type: 'accessory'
            },
            'accessory-earrings': {
                id: 'accessory-earrings',
                name: 'Orecchini d\'Oro',
                category: 'accessories',
                rarity: 'rare',
                price: 180,
                premiumPrice: 14,
                description: 'Orecchini d\'oro puro con diamanti',
                icon: '💎',
                slot: 'face',
                type: 'accessory'
            },
            'accessory-necklace': {
                id: 'accessory-necklace',
                name: 'Amuleto del Potere',
                category: 'accessories',
                rarity: 'epic',
                price: 320,
                premiumPrice: 25,
                description: 'Amuleto magico con poteri antichi',
                icon: '📿',
                slot: 'neck',
                type: 'accessory'
            },
            'accessory-watch': {
                id: 'accessory-watch',
                name: 'Orologio da Polso',
                category: 'accessories',
                rarity: 'common',
                price: 60,
                premiumPrice: 5,
                description: 'Orologio elegante al polso',
                icon: '⌚',
                slot: 'wrist',
                type: 'accessory'
            },
            'accessory-bracelet': {
                id: 'accessory-bracelet',
                name: 'Braccialetto Sportivo',
                category: 'accessories',
                rarity: 'common',
                price: 40,
                premiumPrice: 4,
                description: 'Braccialetto fitness con display',
                icon: '⌚',
                slot: 'wrist',
                type: 'accessory'
            },
            'accessory-ring': {
                id: 'accessory-ring',
                name: 'Anello Magico',
                category: 'accessories',
                rarity: 'epic',
                price: 280,
                premiumPrice: 22,
                description: 'Anello con poteri magici',
                icon: '💍',
                slot: 'finger',
                type: 'accessory'
            },

            // SFONDI PROFILO
            'bg-space': {
                id: 'bg-space',
                name: 'Sfondo Spazio',
                category: 'backgrounds',
                rarity: 'rare',
                price: 200,
                premiumPrice: 15,
                description: 'Sfondo con nebulosa e stelle',
                icon: '🌌',
                slot: 'background',
                type: 'background'
            },
            'bg-sunset': {
                id: 'bg-sunset',
                name: 'Tramonto Tropicale',
                category: 'backgrounds',
                rarity: 'epic',
                price: 400,
                premiumPrice: 30,
                description: 'Sfondo con tramonto tropicale animato',
                icon: '🌅',
                slot: 'background',
                type: 'background'
            },
            'bg-aurora': {
                id: 'bg-aurora',
                name: 'Aurora Boreale',
                category: 'backgrounds',
                rarity: 'legendary',
                price: 700,
                premiumPrice: 50,
                description: 'Sfondo con aurora boreale animata',
                icon: '🌈',
                slot: 'background',
                type: 'background'
            },
            'bg-ocean': {
                id: 'bg-ocean',
                name: 'Fondale Oceanico',
                category: 'backgrounds',
                rarity: 'common',
                price: 100,
                premiumPrice: 8,
                description: 'Sfondo con onde marine',
                icon: '🌊',
                slot: 'background',
                type: 'background'
            },
            'bg-forest': {
                id: 'bg-forest',
                name: 'Foresta Incantata',
                category: 'backgrounds',
                rarity: 'rare',
                price: 250,
                premiumPrice: 18,
                description: 'Sfondo con foresta magica',
                icon: '🌲',
                slot: 'background',
                type: 'background'
            },
            'bg-city': {
                id: 'bg-city',
                name: 'Città Notturna',
                category: 'backgrounds',
                rarity: 'epic',
                price: 350,
                premiumPrice: 28,
                description: 'Sfondo con skyline cittadino',
                icon: '🌃',
                slot: 'background',
                type: 'background'
            },

            // POWER-UP
            'boost-double': {
                id: 'boost-double',
                name: 'Crediti Doppi 2h',
                category: 'powerups',
                rarity: 'rare',
                price: 500,
                premiumPrice: 35,
                description: 'Raddoppia crediti guadagnati per 2 ore',
                icon: '⚡',
                slot: 'powerup',
                type: 'consumable',
                duration: 2 * 60 * 60 * 1000
            },
            'boost-lucky': {
                id: 'boost-lucky',
                name: 'Fortuna Aumentata',
                category: 'powerups',
                rarity: 'epic',
                price: 750,
                premiumPrice: 55,
                description: '+50% probabilità oggetti rari per 1 ora',
                icon: '🍀',
                slot: 'powerup',
                type: 'consumable',
                duration: 60 * 60 * 1000
            },
            'boost-mega': {
                id: 'boost-mega',
                name: 'MEGA Boost',
                category: 'powerups',
                rarity: 'legendary',
                price: 1500,
                premiumPrice: 100,
                description: 'Tutti i boost attivi per 30 minuti',
                icon: '🚀',
                slot: 'powerup',
                type: 'consumable',
                duration: 30 * 60 * 1000
            },
            'boost-study': {
                id: 'boost-study',
                name: 'Booster Studio',
                category: 'powerups',
                rarity: 'rare',
                price: 400,
                premiumPrice: 30,
                description: '+50% crediti bonus nelle attività di studio',
                icon: '📚',
                slot: 'powerup',
                type: 'consumable',
                duration: 45 * 60 * 1000
            },
            'boost-focus': {
                id: 'boost-focus',
                name: 'Focus Mentale',
                category: 'powerups',
                rarity: 'epic',
                price: 600,
                premiumPrice: 45,
                description: 'Migliora concentrazione per 1 ora',
                icon: '🧠',
                slot: 'powerup',
                type: 'consumable',
                duration: 60 * 60 * 1000
            },
            'boost-energy': {
                id: 'boost-energy',
                name: 'Energia Pura',
                category: 'powerups',
                rarity: 'common',
                price: 200,
                premiumPrice: 15,
                description: 'Bonus energia per 30 minuti',
                icon: '⚡',
                slot: 'powerup',
                type: 'consumable',
                duration: 30 * 60 * 1000
            },

            // PACCHETTI PREMIUM (ACQUISTABILI PIÙ VOLTE)
            'pack-starter': {
                id: 'pack-starter',
                name: 'Pacchetto Starter',
                category: 'packs',
                rarity: 'common',
                price: 1500,
                premiumPrice: 2.99,
                euroPrice: '€2.99',
                description: '5 oggetti casuali + 300 crediti bonus',
                icon: '🎁',
                slot: 'pack',
                type: 'pack',
                contents: ['common', 'common', 'rare', 'rare', 'epic'],
                bonusCredits: 300,
                consumable: true // ACQUISTABILE PIÙ VOLTE
            },
            'pack-pro': {
                id: 'pack-pro',
                name: 'Pacchetto Pro',
                category: 'packs',
                rarity: 'rare',
                price: 3000,
                premiumPrice: 7.99,
                euroPrice: '€7.99',
                description: '10 oggetti casuali + 750 crediti bonus',
                icon: '💎',
                slot: 'pack',
                type: 'pack',
                contents: ['rare', 'rare', 'epic', 'epic', 'epic', 'legendary', 'legendary', 'mythic', 'mythic', 'mythic'],
                bonusCredits: 750,
                consumable: true // ACQUISTABILE PIÙ VOLTE
            },
            'pack-ultimate': {
                id: 'pack-ultimate',
                name: 'Pacchetto Ultimate',
                category: 'packs',
                rarity: 'legendary',
                price: 6000,
                premiumPrice: 19.99,
                euroPrice: '€19.99',
                description: '15 oggetti garantiti rari+ + 1500 crediti',
                icon: '👑',
                slot: 'pack',
                type: 'pack',
                contents: ['epic', 'epic', 'epic', 'legendary', 'legendary', 'legendary', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic'],
                bonusCredits: 1500,
                consumable: true // ACQUISTABILE PIÙ VOLTE
            },
            'pack-monthly': {
                id: 'pack-monthly',
                name: 'Pass Mensile',
                category: 'packs',
                rarity: 'epic',
                price: 4000,
                premiumPrice: 9.99,
                euroPrice: '€9.99',
                description: 'Pass stagionale con ricompense esclusive',
                icon: '📅',
                slot: 'pack',
                type: 'pack',
                contents: ['epic', 'legendary', 'legendary', 'mythic', 'mythic'],
                bonusCredits: 1000,
                isSeasonal: true,
                consumable: true // ACQUISTABILE PIÙ VOLTE
            },
            'pack-mini': {
                id: 'pack-mini',
                name: 'Mini Pacchetto',
                category: 'packs',
                rarity: 'common',
                price: 500,
                premiumPrice: 0.99,
                euroPrice: '€0.99',
                description: '3 oggetti casuali + 100 crediti bonus',
                icon: '🎲',
                slot: 'pack',
                type: 'pack',
                contents: ['common', 'rare', 'epic'],
                bonusCredits: 100,
                consumable: true // ACQUISTABILE PIÙ VOLTE
            },
            'pack-mega': {
                id: 'pack-mega',
                name: 'MEGA Pacchetto',
                category: 'packs',
                rarity: 'mythic',
                price: 8000,
                premiumPrice: 29.99,
                euroPrice: '€29.99',
                description: '20 oggetti garantiti epici+ + 2000 crediti',
                icon: '💰',
                slot: 'pack',
                type: 'pack',
                contents: ['epic', 'epic', 'epic', 'epic', 'legendary', 'legendary', 'legendary', 'legendary', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic', 'mythic'],
                bonusCredits: 2000,
                consumable: true // ACQUISTABILE PIÙ VOLTE
            }
        };
    }

    // Sistema Inventario
    loadInventory() {
        try {
            const saved = localStorage.getItem('bp_game_inventory');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading inventory:', error);
            return {};
        }
    }

    saveInventory() {
        try {
            localStorage.setItem('bp_game_inventory', JSON.stringify(this.inventory));
            return true;
        } catch (error) {
            console.error('Error saving inventory:', error);
            return false;
        }
    }

    loadEquipped() {
        try {
            const saved = localStorage.getItem('bp_game_equipped');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading equipped items:', error);
            return {};
        }
    }

    saveEquipped() {
        try {
            localStorage.setItem('bp_game_equipped', JSON.stringify(this.equipped));
            return true;
        } catch (error) {
            console.error('Error saving equipped items:', error);
            return false;
        }
    }

    loadPremiumCurrency() {
        try {
            const saved = localStorage.getItem('bp_premium_currency');
            return saved ? parseInt(saved) : 0;
        } catch (error) {
            console.error('Error loading premium currency:', error);
            return 0;
        }
    }

    savePremiumCurrency() {
        try {
            localStorage.setItem('bp_premium_currency', this.premiumCurrency.toString());
            return true;
        } catch (error) {
            console.error('Error saving premium currency:', error);
            return false;
        }
    }

    // Stati Oggetti
    getItemState(productId) {
        if (this.inventory[productId]) {
            return this.equipped[productId] ? 'equipped' : 'owned';
        }
        return 'not-owned';
    }

    // Acquisto Oggetti
    purchaseItem(productId, paymentType = 'credits') {
        const product = this.products[productId];
        if (!product) {
            return { success: false, message: 'Prodotto non trovato' };
        }

        // Check if already owned (solo per oggetti non consumabili)
        if (this.getItemState(productId) !== 'not-owned' && !product.consumable && product.type !== 'pack') {
            return { success: false, message: 'Hai già questo oggetto' };
        }

        let price, currency, success;

        switch(paymentType) {
            case 'credits':
                price = product.price;
                currency = '💰';
                if (!window.CreditsModule.canAfford(price)) {
                    return { success: false, message: 'Crediti insufficienti' };
                }
                success = window.CreditsModule.spendCrediti(price, `Acquisto: ${product.name}`);
                if (!success) {
                    return { success: false, message: 'Errore nell\'acquisto' };
                }
                break;
                
            case 'premium':
                price = product.premiumPrice;
                currency = '💎';
                if (this.premiumCurrency < price) {
                    return { success: false, message: 'Valuta premium insufficiente' };
                }
                this.premiumCurrency -= price;
                this.savePremiumCurrency();
                break;
                
            case 'euro':
                // Simula acquisto con valuta reale
                price = product.euroPrice;
                currency = '€';
                // In un'app reale, qui ci sarebbe l'integrazione con un payment gateway
                success = this.simulateRealPayment(product);
                if (!success) {
                    return { success: false, message: 'Pagamento fallito' };
                }
                // Aggiunge valuta premium equivalente
                this.premiumCurrency += product.premiumPrice;
                this.savePremiumCurrency();
                break;
                
            default:
                return { success: false, message: 'Metodo di pagamento non valido' };
        }

        // Add to inventory (per pacchetti, incrementa contatore invece di sovrascrivere)
        if (product.type === 'pack') {
            // Pacchetti acquistabili più volte
            if (!this.inventory[productId]) {
                this.inventory[productId] = {
                    purchased: true,
                    purchaseDate: new Date().toISOString(),
                    purchaseType: paymentType,
                    price: price,
                    currency: currency,
                    purchaseCount: 1
                };
            } else {
                this.inventory[productId].purchaseCount++;
                this.inventory[productId].lastPurchaseDate = new Date().toISOString();
            }
        } else {
            // Oggetti normali
            this.inventory[productId] = {
                purchased: true,
                purchaseDate: new Date().toISOString(),
                purchaseType: paymentType,
                price: price,
                currency: currency
            };
        }
        this.saveInventory();

        // Apply effects
        this.applyItemEffects(product);

        // Integrazione con Avatar Studio nascosto
        this.updateHiddenAvatarStudio(product);

        return { 
            success: true, 
            message: `Acquisto completato: ${product.name} (${currency}${price})`,
            product: product,
            paymentType: paymentType
        };
    }

    // Simulazione pagamento reale (in produzione usare Stripe/PayPal/etc.)
    simulateRealPayment(product) {
        // Simula successo del pagamento
        console.log(`Simulazione pagamento ${product.euroPrice} per ${product.name}`);
        return true;
    }

    // Equipaggiamento Oggetti
    equipItem(productId) {
        const product = this.products[productId];
        if (!product) {
            return { success: false, message: 'Prodotto non trovato' };
        }

        // Check if owned
        if (this.getItemState(productId) === 'not-owned') {
            return { success: false, message: 'Devi prima acquistare questo oggetto' };
        }

        // Remove previously equipped item in same slot
        if (this.equipped[productId]) {
            // Unequip if already equipped
            delete this.equipped[productId];
            this.saveEquipped();
            this.removeEquippedEffects(product);
            return { success: true, message: `${product.name} rimosso`, action: 'unequipped' };
        }

        // Unequip other items in same slot
        Object.keys(this.equipped).forEach(equippedId => {
            const equippedProduct = this.products[equippedId];
            if (equippedProduct && equippedProduct.slot === product.slot) {
                delete this.equipped[equippedId];
                this.removeEquippedEffects(equippedProduct);
            }
        });

        // Equip new item
        this.equipped[productId] = true;
        this.saveEquipped();
        this.applyEquippedEffects(product);

        return { success: true, message: `${product.name} equipaggiato`, action: 'equipped' };
    }

    // Applicazione Effetti
    applyItemEffects(product) {
        if (product.type === 'pack') {
            this.openPack(product);
        } else if (product.type === 'consumable') {
            this.activatePowerUp(product);
        }
    }

    applyEquippedEffects(product) {
        // Apply equipped effects to avatar
        if (window.avatarStudioController && window.avatarStudioController.renderer) {
            this.applyToAvatar(product);
        }
        
        // Update UI
        this.updateEquippedDisplay();
    }

    removeEquippedEffects(product) {
        // Remove effects from avatar
        if (window.avatarStudioController && window.avatarStudioController.renderer) {
            this.removeFromAvatar(product);
        }
        
        // Update UI
        this.updateEquippedDisplay();
    }

    applyToAvatar(product) {
        // Usa Enhanced Avatar Renderer se disponibile
        if (window.enhancedAvatarRenderer) {
            window.enhancedAvatarRenderer.applyCosmetic(product.id);
            return;
        }
        
        // Fallback al renderer base
        const renderer = window.avatarStudioController?.renderer;
        if (!renderer) return;
        
        switch(product.slot) {
            case 'body':
                if (product.type === 'skin') {
                    renderer.applyCustomSkin(product.preview);
                }
                break;
            case 'head':
                if (product.type === 'hat') {
                    renderer.toggleAccessory(product.id.replace('hat-', ''));
                }
                break;
            case 'face':
                if (product.type === 'accessory') {
                    renderer.toggleAccessory(product.id.replace('accessory-', ''));
                }
                break;
        }
    }

    removeFromAvatar(product) {
        // Usa Enhanced Avatar Renderer se disponibile
        if (window.enhancedAvatarRenderer) {
            window.enhancedAvatarRenderer.removeCosmetic(product.id);
            return;
        }
        
        // Fallback al renderer base
        const renderer = window.avatarStudioController?.renderer;
        if (!renderer) return;
        
        switch(product.slot) {
            case 'head':
                if (product.type === 'hat') {
                    renderer.toggleAccessory(product.id.replace('hat-', ''));
                }
                break;
            case 'face':
                if (product.type === 'accessory') {
                    renderer.toggleAccessory(product.id.replace('accessory-', ''));
                }
                break;
        }
    }

    // Pacchetti
    openPack(packProduct) {
        const items = this.getRandomPackItems(packProduct.contents);
        
        items.forEach(itemId => {
            this.inventory[itemId] = {
                purchased: true,
                purchaseDate: new Date().toISOString(),
                purchaseType: 'pack',
                fromPack: packProduct.id
            };
        });
        
        this.saveInventory();
        
        // Add bonus credits
        const bonusCredits = packProduct.bonusCredits || 0;
        if (bonusCredits > 0) {
            window.CreditsModule.earnCrediti(bonusCredits, `Bonus pacchetto ${packProduct.name}`);
        }
        
        return items;
    }

    getRandomPackItems(contents) {
        const items = [];
        
        contents.forEach(rarity => {
            const itemsOfRarity = Object.keys(this.products).filter(id => 
                this.products[id].rarity === rarity && 
                this.products[id].category !== 'packs'
            );
            
            if (itemsOfRarity.length > 0) {
                const randomItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
                items.push(randomItem);
            }
        });
        
        return items;
    }

    // Power-up
    activatePowerUp(powerUp) {
        const endTime = Date.now() + powerUp.duration;
        
        localStorage.setItem(`bp_powerup_${powerUp.id}`, endTime.toString());
        
        if (window.NotificationsModule) {
            window.NotificationsModule.showSuccess(`${powerUp.name} attivato!`);
        }
        
        // Apply immediate effects
        this.applyPowerUpEffects(powerUp);
    }

    applyPowerUpEffects(powerUp) {
        switch(powerUp.id) {
            case 'boost-double':
                // Double credits effect
                window.doubleCreditsActive = true;
                break;
            case 'boost-lucky':
                // Lucky effect
                window.luckyBoostActive = true;
                break;
            case 'boost-mega':
                // All effects
                window.doubleCreditsActive = true;
                window.luckyBoostActive = true;
                break;
        }
    }

    // Categorie (solo quelle richieste)
    getCategories() {
        return [
            { id: 'all', name: 'Tutti', icon: '🛍️' },
            { id: 'outfits', name: 'Vestiti', icon: '👔' },
            { id: 'hats', name: 'Cappelli', icon: '🎩' },
            { id: 'accessories', name: 'Accessori', icon: '💎' },
            { id: 'backgrounds', name: 'Sfondi', icon: '🌌' },
            { id: 'powerups', name: 'Power-up', icon: '⚡' },
            { id: 'packs', name: 'Pacchetti', icon: '🎁' }
        ];
    }

    // Integrazione Avatar Studio nascosto
    updateHiddenAvatarStudio(product) {
        // Salva configurazione avatar in background
        const avatarConfig = this.loadHiddenAvatarConfig();
        
        // Aggiungi oggetto alla configurazione
        if (!avatarConfig.ownedItems) {
            avatarConfig.ownedItems = [];
        }
        
        // Se è un pacchetto, aggiungi gli oggetti contenuti
        if (product.type === 'pack') {
            const items = this.getRandomPackItems(product.contents);
            items.forEach(itemId => {
                if (!avatarConfig.ownedItems.includes(itemId)) {
                    avatarConfig.ownedItems.push(itemId);
                }
            });
        } else {
            // Aggiungi oggetto singolo
            if (!avatarConfig.ownedItems.includes(product.id)) {
                avatarConfig.ownedItems.push(product.id);
            }
        }
        
        // Salva configurazione
        this.saveHiddenAvatarConfig(avatarConfig);
        
        // Notifica l'Avatar Studio nascosto se esiste
        if (window.hiddenAvatarStudio) {
            window.hiddenAvatarStudio.refreshInventory();
        }
    }

    loadHiddenAvatarConfig() {
        try {
            const saved = localStorage.getItem('bp_hidden_avatar_config');
            return saved ? JSON.parse(saved) : { ownedItems: [], equippedItems: {} };
        } catch (error) {
            console.error('Error loading hidden avatar config:', error);
            return { ownedItems: [], equippedItems: {} };
        }
    }

    saveHiddenAvatarConfig(config) {
        try {
            localStorage.setItem('bp_hidden_avatar_config', JSON.stringify(config));
            return true;
        } catch (error) {
            console.error('Error saving hidden avatar config:', error);
            return false;
        }
    }

    // Metodo per ottenere oggetti posseduti dall'Avatar Studio nascosto
    getHiddenAvatarItems() {
        const config = this.loadHiddenAvatarConfig();
        return config.ownedItems.map(id => this.products[id]).filter(item => item);
    }

    // Metodo per equipaggiare oggetti nell'Avatar Studio nascosto
    equipHiddenAvatarItem(itemId) {
        const product = this.products[itemId];
        if (!product) return { success: false, message: 'Oggetto non trovato' };
        
        const config = this.loadHiddenAvatarConfig();
        
        // Rimuovi altri oggetti nello stesso slot
        Object.keys(config.equippedItems).forEach(equippedId => {
            const equippedProduct = this.products[equippedId];
            if (equippedProduct && equippedProduct.slot === product.slot) {
                delete config.equippedItems[equippedId];
            }
        });
        
        // Equipaggia nuovo oggetto
        config.equippedItems[itemId] = true;
        this.saveHiddenAvatarConfig(config);
        
        return { success: true, message: `${product.name} equipaggiato` };
    }

    // Metodo per rimuovere oggetti dall'Avatar Studio nascosto
    unequipHiddenAvatarItem(itemId) {
        const config = this.loadHiddenAvatarConfig();
        
        if (config.equippedItems[itemId]) {
            delete config.equippedItems[itemId];
            this.saveHiddenAvatarConfig(config);
            
            const product = this.products[itemId];
            return { success: true, message: `${product.name} rimosso` };
        }
        
        return { success: false, message: 'Oggetto non equipaggiato' };
    }

    // Filtri Inventario
    getInventoryItems(category = 'all') {
        const ownedItems = Object.keys(this.inventory).map(id => ({
            ...this.products[id],
            state: this.getItemState(id)
        })).filter(item => item);
        
        if (category === 'all') {
            return ownedItems;
        }
        
        return ownedItems.filter(item => item.category === category);
    }

    // Statistiche
    getStats() {
        const totalItems = Object.keys(this.products).length;
        const ownedItems = Object.keys(this.inventory).length;
        const equippedItems = Object.keys(this.equipped).length;
        
        const rarityStats = {};
        Object.keys(this.products).forEach(id => {
            const product = this.products[id];
            const isOwned = this.inventory[id];
            
            if (!rarityStats[product.rarity]) {
                rarityStats[product.rarity] = { total: 0, owned: 0 };
            }
            
            rarityStats[product.rarity].total++;
            if (isOwned) {
                rarityStats[product.rarity].owned++;
            }
        });
        
        return {
            totalItems,
            ownedItems,
            equippedItems,
            completionRate: Math.round((ownedItems / totalItems) * 100),
            rarityStats,
            premiumCurrency: this.premiumCurrency
        };
    }

    // Premium Currency
    addPremiumCurrency(amount) {
        this.premiumCurrency += amount;
        this.savePremiumCurrency();
        return this.premiumCurrency;
    }

    spendPremiumCurrency(amount) {
        if (this.premiumCurrency >= amount) {
            this.premiumCurrency -= amount;
            this.savePremiumCurrency();
            return true;
        }
        return false;
    }

    // UI Updates
    updateEquippedDisplay() {
        if (window.avatarStudioController) {
            window.avatarStudioController.updateEquippedItems();
        }
    }
}

// Export for global use
window.GameShopModule = GameShopModule;
