/**
 * Database Negozio Avatar - Sistema Image Layering
 * Struttura dati JSON per oggetti acquistabili con image_url
 */

// Database Prodotti Negozio
const SHOP_DATABASE = {
    clothes: [
        {
            id: "vestito_default",
            name: "Vestito Base",
            price: 0,
            image_url: "assets/avatar/vestito_default.png",
            category: "clothes",
            description: "Vestito di base per iniziare",
            rarity: "common",
            default: true
        },
        {
            id: "vestito_elegante",
            name: "Abito Elegante",
            price: 50,
            image_url: "assets/avatar/vestito_elegante.png",
            category: "clothes",
            description: "Un abito elegante per occasioni speciali",
            rarity: "uncommon"
        },
        {
            id: "vestito_sportivo",
            name: "Tuta Sportiva",
            price: 30,
            image_url: "assets/avatar/vestito_sportivo.png",
            category: "clothes",
            description: "Comoda tuta per attività fisiche",
            rarity: "common"
        },
        {
            id: "vestito_formale",
            name: "Completo Formale",
            price: 75,
            image_url: "assets/avatar/vestito_formale.png",
            category: "clothes",
            description: "Completo elegante per look professionale",
            rarity: "rare"
        },
        {
            id: "vestito_casuale",
            name: "Look Casual",
            price: 25,
            image_url: "assets/avatar/vestito_casuale.png",
            category: "clothes",
            description: "Stile casual e rilassato",
            rarity: "common"
        },
        {
            id: "vestito_fantasy",
            name: "Armatura Fantasy",
            price: 100,
            image_url: "assets/avatar/vestito_fantasy.png",
            category: "clothes",
            description: "Armatura epica per avventurieri",
            rarity: "epic"
        }
    ],
    
    hair: [
        {
            id: "nessun_capello",
            name: "Nessun Capello",
            price: 0,
            image_url: "assets/avatar/nessun_capello.png",
            category: "hair",
            description: "Senza capelli",
            rarity: "common",
            default: true
        },
        {
            id: "capelli_corti",
            name: "Capelli Corti",
            price: 20,
            image_url: "assets/avatar/capelli_corti.png",
            category: "hair",
            description: "Capelli corti e semplici",
            rarity: "common"
        },
        {
            id: "capelli_lunghi",
            name: "Capelli Lunghi",
            price: 35,
            image_url: "assets/avatar/capelli_lunghi.png",
            category: "hair",
            description: "Capelli lunghi e fluenti",
            rarity: "uncommon"
        },
        {
            id: "capelli_ricci",
            name: "Capelli Ricci",
            price: 40,
            image_url: "assets/avatar/capelli_ricci.png",
            category: "hair",
            description: "Capelli ricci e voluminosi",
            rarity: "uncommon"
        },
        {
            id: "capelli_cresta",
            name: "Cresta Punk",
            price: 60,
            image_url: "assets/avatar/capelli_cresta.png",
            category: "hair",
            description: "Cresta punk stilosa",
            rarity: "rare"
        },
        {
            id: "capelli_colorati",
            name: "Capelli Colorati",
            price: 55,
            image_url: "assets/avatar/capelli_colorati.png",
            category: "hair",
            description: "Capelli con colori vivaci",
            rarity: "rare"
        }
    ],
    
    "head-accessories": [
        {
            id: "nessun_cappello",
            name: "Nessun Cappello",
            price: 0,
            image_url: "assets/avatar/nessun_cappello.png",
            category: "head-accessories",
            description: "Senza cappello",
            rarity: "common",
            default: true
        },
        {
            id: "cappello_baseball",
            name: "Berretto",
            price: 15,
            image_url: "assets/avatar/cappello_baseball.png",
            category: "head-accessories",
            description: "Berretto da baseball",
            rarity: "common"
        },
        {
            id: "cappello_punta",
            name: "Cappello a Punta",
            price: 45,
            image_url: "assets/avatar/cappello_punta.png",
            category: "head-accessories",
            description: "Cappello a punta da mago",
            rarity: "uncommon"
        },
        {
            id: "cappello_cowboy",
            name: "Cappello Cowboy",
            price: 50,
            image_url: "assets/avatar/cappello_cowboy.png",
            category: "head-accessories",
            description: "Cappello da cowboy",
            rarity: "uncommon"
        },
        {
            id: "corona_re",
            name: "Corona Reale",
            price: 80,
            image_url: "assets/avatar/corona_re.png",
            category: "head-accessories",
            description: "Corona da re o regina",
            rarity: "rare"
        },
        {
            id: "elmo_vichingo",
            name: "Elmo Vichingo",
            price: 90,
            image_url: "assets/avatar/elmo_vichingo.png",
            category: "head-accessories",
            description: "Elmo da guerriero vichingo",
            rarity: "rare"
        },
        {
            id: "cuffie_natale",
            name: "Cuffie Natalizie",
            price: 25,
            image_url: "assets/avatar/cuffie_natale.png",
            category: "head-accessories",
            description: "Cuffie festive di Natale",
            rarity: "seasonal"
        }
    ],
    
    glasses: [
        {
            id: "nessun_occhiale",
            name: "Nessun Occhiale",
            price: 0,
            image_url: "assets/avatar/nessun_occhiale.png",
            category: "glasses",
            description: "Senza occhiali",
            rarity: "common",
            default: true
        },
        {
            id: "occhiali_da_vista",
            name: "Occhiali da Vista",
            price: 20,
            image_url: "assets/avatar/occhiali_da_vista.png",
            category: "glasses",
            description: "Occhiali da vista classici",
            rarity: "common"
        },
        {
            id: "occhiali_da_sole",
            name: "Occhiali da Sole",
            price: 25,
            image_url: "assets/avatar/occhiali_da_sole.png",
            category: "glasses",
            description: "Occhiali da sole stilosi",
            rarity: "common"
        },
        {
            id: "occhiali_scientista",
            name: "Occhiali da Scienziato",
            price: 35,
            image_url: "assets/avatar/occhiali_scientista.png",
            category: "glasses",
            description: "Occhiali da scienziato pazzo",
            rarity: "uncommon"
        },
        {
            id: "monocle",
            name: "Monocle Elegante",
            price: 40,
            image_url: "assets/avatar/monocle.png",
            category: "glasses",
            description: "Monocle da gentiluomo",
            rarity: "uncommon"
        },
        {
            id: "occhiali_cyberpunk",
            name: "Occhiali Cyberpunk",
            price: 70,
            image_url: "assets/avatar/occhiali_cyberpunk.png",
            category: "glasses",
            description: "Occhiali futuristici cyberpunk",
            rarity: "rare"
        }
    ]
};

// Configurazione Layer Mapping
const LAYER_MAPPING = {
    'clothes': 'clothesLayer',
    'hair': 'hairLayer', 
    'head-accessories': 'headAccessoryLayer',
    'glasses': 'glassesLayer'
};

// Colori per rarità
const RARITY_COLORS = {
    common: '#9e9e9e',
    uncommon: '#4caf50',
    rare: '#2196f3',
    epic: '#9c27b0',
    seasonal: '#ff9800'
};

// Funzioni Utilità
function getAllShopItems() {
    const allItems = [];
    Object.keys(SHOP_DATABASE).forEach(category => {
        SHOP_DATABASE[category].forEach(item => {
            allItems.push({...item});
        });
    });
    return allItems;
}

function getItemsByCategory(category) {
    return SHOP_DATABASE[category] || [];
}

function getItemById(id) {
    for (const category of Object.keys(SHOP_DATABASE)) {
        const item = SHOP_DATABASE[category].find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

function getDefaultItems() {
    const defaults = {};
    Object.keys(SHOP_DATABASE).forEach(category => {
        const defaultItem = SHOP_DATABASE[category].find(item => item.default);
        if (defaultItem) {
            defaults[category] = defaultItem.id;
        }
    });
    return defaults;
}

// Esportazione per uso in altri file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SHOP_DATABASE,
        LAYER_MAPPING,
        RARITY_COLORS,
        getAllShopItems,
        getItemsByCategory,
        getItemById,
        getDefaultItems
    };
}
