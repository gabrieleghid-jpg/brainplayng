/**
 * Avatar Game Logic - Sistema Videogioco Professionale
 * Gestione completa dell'avatar personalizzabile stile videogioco
 */

// Stato Globale del Gioco
const gameState = {
    credits: 0,
    level: 1,
    experience: 0,
    equippedItems: {
        clothes: "vestito_default",
        hair: "nessun_capello", 
        "head-accessories": "nessun_cappello",
        glasses: "nessun_occhiale"
    },
    ownedItems: new Set(),
    currentCategory: "clothes",
    isAnimating: false
};

// Inizializzazione del Gioco
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    loadGameData();
    updateUI();
    renderShopItems();
    renderInventory();
    applyEquippedItems();
});

// Inizializzazione Sistema
function initializeGame() {
    console.log('🎮 Avatar Game Initializing...');
    
    // Aggiungi event listeners per i tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchCategory(this.dataset.category);
        });
    });
    
    // Carica i crediti dal localStorage
    const savedCredits = localStorage.getItem('crediti');
    gameState.credits = savedCredits ? parseInt(savedCredits) : 0;
    
    // Calcola livello base sui crediti
    gameState.level = Math.floor(gameState.credits / 100) + 1;
    
    console.log('✅ Game Initialized');
}

// Caricamento Dati Gioco
function loadGameData() {
    const saved = localStorage.getItem('avatarState');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            gameState.equippedItems = data.equippedItems || gameState.equippedItems;
            gameState.ownedItems = new Set(data.ownedItems || []);
        } catch (error) {
            console.error('❌ Error loading avatar data:', error);
        }
    } else {
        // Aggiungi item di default ai posseduti
        const defaults = getDefaultItems();
        Object.values(defaults).forEach(itemId => {
            gameState.ownedItems.add(itemId);
        });
        saveGameData();
    }
    
    console.log('📦 Game Data Loaded');
}

// Salvataggio Dati Gioco
function saveGameData() {
    const data = {
        equippedItems: gameState.equippedItems,
        ownedItems: Array.from(gameState.ownedItems)
    };
    localStorage.setItem('avatarState', JSON.stringify(data));
}

// Aggiornamento Interfaccia
function updateUI() {
    // Aggiorna statistiche header
    document.getElementById('creditsDisplay').textContent = gameState.credits;
    document.getElementById('itemsCount').textContent = gameState.ownedItems.size;
    document.getElementById('levelDisplay').textContent = gameState.level;
    
    // Aggiorna contatori
    updateCounters();
}

function updateCounters() {
    const creditsElement = document.getElementById('creditsDisplay');
    const itemsElement = document.getElementById('itemsCount');
    
    if (creditsElement) creditsElement.textContent = gameState.credits;
    if (itemsElement) itemsElement.textContent = gameState.ownedItems.size;
}

// Sistema Layering - Funzione Principale
function applyItemToAvatar(itemId, category) {
    const item = getItemById(itemId);
    if (!item) return;
    
    if (gameState.isAnimating) return;
    gameState.isAnimating = true;
    
    // Ottieni il layer corrispondente
    const layerElement = document.getElementById(LAYER_MAPPING[category]);
    if (!layerElement) {
        gameState.isAnimating = false;
        return;
    }
    
    // Aggiungi animazione di transizione
    layerElement.classList.add('layer-transition');
    
    // Cambia dinamicamente la src dell'immagine
    layerElement.src = item.image_url;
    
    // Effetto glow sul container
    const container = document.getElementById('avatarContainer');
    container.classList.add('glow-green');
    
    // Rimuovi animazioni dopo completamento
    setTimeout(() => {
        layerElement.classList.remove('layer-transition');
        container.classList.remove('glow-green');
        gameState.isAnimating = false;
    }, 500);
    
    console.log(`🎨 Applied ${item.name} to ${category}`);
}

// Applica tutti gli item equipaggiati
function applyEquippedItems() {
    Object.keys(gameState.equippedItems).forEach(category => {
        const itemId = gameState.equippedItems[category];
        if (itemId) {
            applyItemToAvatar(itemId, category);
        }
    });
}

// Sistema Negozio
function renderShopItems() {
    const shopGrid = document.getElementById('shopGrid');
    if (!shopGrid) return;
    
    const items = getItemsByCategory(gameState.currentCategory);
    
    shopGrid.innerHTML = '';
    
    if (items.length === 0) {
        shopGrid.innerHTML = '<div class="empty-state">Nessun oggetto disponibile</div>';
        return;
    }
    
    items.forEach(item => {
        const itemElement = createShopItemElement(item);
        shopGrid.appendChild(itemElement);
    });
    
    console.log(`🛍️ Rendered ${items.length} items for ${gameState.currentCategory}`);
}

function createShopItemElement(item) {
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.dataset.itemId = item.id;
    div.dataset.category = item.category;
    
    // Aggiungi classi di stato
    if (gameState.ownedItems.has(item.id)) {
        div.classList.add('owned');
    }
    if (gameState.equippedItems[item.category] === item.id) {
        div.classList.add('equipped');
    }
    
    // Colore rarità
    const rarityColor = RARITY_COLORS[item.rarity] || '#9e9e9e';
    
    div.innerHTML = `
        <div class="item-preview" style="border-color: ${rarityColor};">
            <img src="${item.image_url}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='${getItemEmoji(item.category)}';">
        </div>
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price === 0 ? 'GRATIS' : `${item.price} 💰`}</div>
        <div class="item-actions">
            ${createItemActions(item)}
        </div>
        ${gameState.ownedItems.has(item.id) ? '<div class="item-badge">✓</div>' : ''}
        ${gameState.equippedItems[item.category] === item.id ? '<div class="item-badge equipped">⚡</div>' : ''}
    `;
    
    return div;
}

function getItemEmoji(category) {
    const emojis = {
        'clothes': '👕',
        'hair': '💇',
        'head-accessories': '🎩',
        'glasses': '👓'
    };
    return emojis[category] || '📦';
}

function createItemActions(item) {
    const isOwned = gameState.ownedItems.has(item.id);
    const isEquipped = gameState.equippedItems[item.category] === item.id;
    const canAfford = gameState.credits >= item.price;
    
    if (isEquipped) {
        return `<button class="item-btn unequip" onclick="unequipItem('${item.id}', '${item.category}')">Rimuovi</button>`;
    } else if (isOwned) {
        return `<button class="item-btn equip" onclick="equipItem('${item.id}', '${item.category}')">Indossa</button>`;
    } else if (item.price === 0) {
        return `<button class="item-btn buy" onclick="buyItem('${item.id}', '${item.category}')">Ottieni</button>`;
    } else if (canAfford) {
        return `<button class="item-btn buy" onclick="buyItem('${item.id}', '${item.category}')">Compra</button>`;
    } else {
        return `<button class="item-btn buy" disabled>Crediti Insufficienti</button>`;
    }
}

// Sistema Acquisto
function buyItem(itemId, category) {
    const item = getItemById(itemId);
    if (!item) return;
    
    if (gameState.credits < item.price) {
        showNotification("Crediti insufficienti!", "error");
        return;
    }
    
    if (gameState.ownedItems.has(itemId)) {
        showNotification("Possiedi già questo oggetto!", "error");
        return;
    }
    
    // Sottrai crediti
    gameState.credits -= item.price;
    localStorage.setItem('crediti', gameState.credits.toString());
    
    // Aggiungi ai posseduti
    gameState.ownedItems.add(itemId);
    
    // Aggiungi esperienza
    gameState.experience += 10;
    
    // Controlla level up
    checkLevelUp();
    
    // Se è il primo item della categoria, equipaggialo automaticamente
    if (!gameState.equippedItems[category] || gameState.equippedItems[category] === getDefaultItems()[category]) {
        equipItem(itemId, category);
    }
    
    // Salva stato
    saveGameData();
    
    // Aggiorna UI
    updateUI();
    renderShopItems();
    renderInventory();
    
    // Animazione acquisto
    animatePurchase(itemId);
    
    showNotification(`${item.name} acquistato! 🎉`, "success");
}

function animatePurchase(itemId) {
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement) {
        itemElement.classList.add('glow-gold');
        setTimeout(() => {
            itemElement.classList.remove('glow-gold');
        }, 1000);
    }
}

// Sistema Equipaggiamento
function equipItem(itemId, category) {
    if (!gameState.ownedItems.has(itemId)) {
        showNotification("Devi prima acquistare questo oggetto!", "error");
        return;
    }
    
    // Rimuovi classe equipped dal vecchio item
    const oldItemId = gameState.equippedItems[category];
    if (oldItemId) {
        const oldElement = document.querySelector(`[data-item-id="${oldItemId}"]`);
        if (oldElement) {
            oldElement.classList.remove('equipped');
        }
    }
    
    // Equipaggia nuovo item
    gameState.equippedItems[category] = itemId;
    
    // Aggiorna UI
    const newElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (newElement) {
        newElement.classList.add('equipped');
    }
    
    // Applica cambiamento all'avatar
    applyItemToAvatar(itemId, category);
    
    // Salva stato
    saveGameData();
    
    showNotification(`${getItemById(itemId).name} equipaggiato! ✨`, "success");
}

function unequipItem(itemId, category) {
    // Torna all'item di default
    const defaults = getDefaultItems();
    const defaultItemId = defaults[category];
    
    if (defaultItemId && gameState.ownedItems.has(defaultItemId)) {
        equipItem(defaultItemId, category);
    } else {
        // Rimuovi equipaggiamento
        delete gameState.equippedItems[category];
        
        // Applica immagine vuota
        const layerElement = document.getElementById(LAYER_MAPPING[category]);
        if (layerElement) {
            layerElement.classList.add('layer-transition');
            layerElement.src = `assets/avatar/nessun_${category.replace('-', '_')}.png`;
            setTimeout(() => {
                layerElement.classList.remove('layer-transition');
            }, 500);
        }
        
        saveGameData();
        renderShopItems();
    }
}

// Sistema Categorie
function switchCategory(category) {
    gameState.currentCategory = category;
    
    // Aggiorna tab attiva
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
    
    renderShopItems();
}

// Filtro Prodotti
function filterProducts() {
    const showOwnedOnly = document.getElementById('showOwnedOnly').checked;
    const shopItems = document.querySelectorAll('.shop-item');
    
    shopItems.forEach(item => {
        const itemId = item.dataset.itemId;
        const isOwned = gameState.ownedItems.has(itemId);
        
        if (showOwnedOnly && !isOwned) {
            item.style.display = 'none';
        } else {
            item.style.display = 'block';
        }
    });
}

// Inventario
function renderInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;
    
    inventoryGrid.innerHTML = '';
    
    if (gameState.ownedItems.size === 0) {
        inventoryGrid.innerHTML = '<div class="empty-state">Nessun oggetto posseduto</div>';
        return;
    }
    
    gameState.ownedItems.forEach(itemId => {
        const item = getItemById(itemId);
        if (item) {
            const itemElement = createInventoryItemElement(item);
            inventoryGrid.appendChild(itemElement);
        }
    });
}

function createInventoryItemElement(item) {
    const div = document.createElement('div');
    div.className = 'inventory-item';
    div.onclick = () => equipItem(item.id, item.category);
    
    const rarityColor = RARITY_COLORS[item.rarity] || '#9e9e9e';
    const isEquipped = gameState.equippedItems[item.category] === item.id;
    
    div.innerHTML = `
        <div class="inventory-preview" style="border-color: ${rarityColor};">
            <img src="${item.image_url}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='${getItemEmoji(item.category)}';">
        </div>
        <div class="inventory-name">${item.name}</div>
        <div class="inventory-category">${item.category}</div>
        ${isEquipped ? '<div class="item-badge equipped">⚡</div>' : ''}
    `;
    
    return div;
}

// Sistema Controllo Avatar
function saveAvatar() {
    saveGameData();
    showNotification("Avatar salvato con successo! 💾", "success");
    
    // Animazione salvataggio
    const container = document.getElementById('avatarContainer');
    container.classList.add('glow-green');
    setTimeout(() => {
        container.classList.remove('glow-green');
    }, 1000);
}

function resetAvatar() {
    const defaults = getDefaultItems();
    gameState.equippedItems = {...defaults};
    
    applyEquippedItems();
    saveGameData();
    renderShopItems();
    
    showNotification("Avatar resettato! 🔄", "info");
}

function randomizeAvatar() {
    const categories = ['clothes', 'hair', 'head-accessories', 'glasses'];
    
    categories.forEach(category => {
        const items = getItemsByCategory(category);
        const ownedItemsInCategory = items.filter(item => gameState.ownedItems.has(item.id));
        
        if (ownedItemsInCategory.length > 0) {
            const randomItem = ownedItemsInCategory[Math.floor(Math.random() * ownedItemsInCategory.length)];
            equipItem(randomItem.id, category);
        }
    });
    
    showNotification("Avatar randomizzato! 🎲", "success");
}

// Sistema Livello
function checkLevelUp() {
    const newLevel = Math.floor(gameState.credits / 100) + 1;
    
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        showNotification(`🎉 LEVEL UP! Sei ora livello ${newLevel}!`, "success");
        
        // Animazione level up
        document.getElementById('levelDisplay').classList.add('glow-gold');
        setTimeout(() => {
            document.getElementById('levelDisplay').classList.remove('glow-gold');
        }, 2000);
    }
}

// Sistema Notifiche
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Rimuovi dopo 3 secondi
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Funzione Debug
function debugGameState() {
    console.log('🎮 Game State:', {
        credits: gameState.credits,
        level: gameState.level,
        ownedItems: Array.from(gameState.ownedItems),
        equippedItems: gameState.equippedItems,
        currentCategory: gameState.currentCategory
    });
}

// Aggiungi funzione debug alla console
window.debugGameState = debugGameState;
window.gameState = gameState;

// CSS Animazioni per notifiche
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
