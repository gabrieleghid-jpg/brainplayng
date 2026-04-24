// Avatar Gallery Module
class AvatarGallery {
    constructor() {
        this.storage = new AvatarStorage();
        this.currentFilter = 'all';
        this.selectedAvatar = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadGallery();
    }

    setupEventListeners() {
        const filterSelect = document.getElementById('galleryFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.loadGallery();
            });
        }

        const createNewBtn = document.getElementById('createNewBtn');
        if (createNewBtn) {
            createNewBtn.addEventListener('click', () => {
                this.createNewAvatar();
            });
        }

        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.importAvatar();
            });
        }
    }

    loadGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        const avatars = this.storage.getGalleryFiltered(this.currentFilter);
        
        if (avatars.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-gallery">
                    <p>Nessun avatar trovato</p>
                    <button class="btn-primary" onclick="avatarGallery.createNewAvatar()">
                        ➕ Crea il primo avatar
                    </button>
                </div>
            `;
            return;
        }

        galleryGrid.innerHTML = avatars.map(avatar => `
            <div class="gallery-item" data-avatar-id="${avatar.id}">
                <div class="gallery-preview">
                    <svg width="80" height="80" viewBox="0 0 100 100" class="gallery-avatar-svg">
                        ${this.generateAvatarSVG(avatar.data)}
                    </svg>
                </div>
                <div class="gallery-info">
                    <h4 class="gallery-name">${avatar.name}</h4>
                    <p class="gallery-date">${this.formatDate(avatar.createdAt)}</p>
                </div>
                <div class="gallery-actions">
                    <button class="btn-small" onclick="avatarGallery.selectAvatar('${avatar.id}')">
                        👁️ Usa
                    </button>
                    ${avatar.type === 'custom' || avatar.type === 'imported' ? `
                        <button class="btn-small btn-danger" onclick="avatarGallery.deleteAvatar('${avatar.id}')">
                            🗑️
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    generateAvatarSVG(avatarData) {
        const { colors, style, accessories } = avatarData;
        
        return `
            <rect width="100" height="100" fill="#f0f0f0" rx="10"/>
            <circle cx="50" cy="40" r="25" fill="${colors.skin}" stroke="#333" stroke-width="1"/>
            <circle cx="42" cy="38" r="3" fill="${colors.eyes}"/>
            <circle cx="58" cy="38" r="3" fill="${colors.eyes}"/>
            <path d="M 45 48 Q 50 52, 55 48" stroke="#333" stroke-width="1.5" fill="none"/>
            <g>
                ${this.generateHairSVG(colors.hair, style)}
            </g>
            <rect x="25" y="65" width="50" height="30" fill="${colors.shirt}" rx="5"/>
            <g>
                ${this.generateAccessoriesSVG(accessories)}
            </g>
        `;
    }

    generateHairSVG(color, style) {
        switch(style) {
            case 'short':
                return `<path d="M 35 30 Q 35 20, 50 18 Q 65 20, 65 30 Q 63 25, 50 23 Q 37 25, 35 30" fill="${color}" stroke="${this.darkenColor(color, 20)}" stroke-width="1"/>`;
            case 'long':
                return `
                    <path d="M 30 30 Q 30 15, 50 13 Q 70 15, 70 30 Q 68 25, 50 23 Q 32 25, 30 30" fill="${color}" stroke="${this.darkenColor(color, 20)}" stroke-width="1"/>
                    <path d="M 30 30 Q 25 45, 30 60 Q 35 55, 50 58 Q 65 55, 70 60 Q 75 45, 70 30" fill="${color}" stroke="${this.darkenColor(color, 20)}" stroke-width="1"/>
                `;
            case 'spiky':
                return `
                    <path d="M 35 30 Q 35 20, 50 18 Q 65 20, 65 30 Q 63 25, 50 23 Q 37 25, 35 30" fill="${color}" stroke="${this.darkenColor(color, 20)}" stroke-width="1"/>
                    <path d="M 32 25 L 30 15" stroke="${color}" stroke-width="3"/>
                    <path d="M 40 22 L 38 12" stroke="${color}" stroke-width="3"/>
                    <path d="M 50 20 L 50 10" stroke="${color}" stroke-width="3"/>
                    <path d="M 60 22 L 62 12" stroke="${color}" stroke-width="3"/>
                    <path d="M 68 25 L 70 15" stroke="${color}" stroke-width="3"/>
                `;
            case 'curly':
                return `
                    <path d="M 30 30 Q 30 15, 50 13 Q 70 15, 70 30 Q 68 25, 50 23 Q 32 25, 30 30" fill="${color}" stroke="${this.darkenColor(color, 20)}" stroke-width="1"/>
                    <circle cx="35" cy="20" r="4" fill="${color}"/>
                    <circle cx="45" cy="18" r="3" fill="${color}"/>
                    <circle cx="55" cy="18" r="3" fill="${color}"/>
                    <circle cx="65" cy="20" r="4" fill="${color}"/>
                    <circle cx="40" cy="25" r="3" fill="${color}"/>
                    <circle cx="60" cy="25" r="3" fill="${color}"/>
                `;
            case 'bald':
                return '';
            default:
                return '';
        }
    }

    generateAccessoriesSVG(accessories) {
        if (!accessories || !Array.isArray(accessories)) return '';
        
        return accessories.map(accessory => {
            switch(accessory) {
                case 'glasses':
                    return `
                        <circle cx="42" cy="38" r="6" fill="none" stroke="#333" stroke-width="1"/>
                        <circle cx="58" cy="38" r="6" fill="none" stroke="#333" stroke-width="1"/>
                        <line x1="48" y1="38" x2="52" y2="38" stroke="#333" stroke-width="1"/>
                    `;
                case 'hat':
                    return `
                        <path d="M 25 25 Q 50 15, 75 25 L 70 35 Q 50 30, 30 35 Z" fill="#4a4a4a" stroke="#333" stroke-width="1"/>
                    `;
                case 'crown':
                    return `
                        <path d="M 30 25 L 35 15 L 40 20 L 45 12 L 50 20 L 55 12 L 60 20 L 65 15 L 70 25 L 65 30 L 35 30 Z" fill="#ffd700" stroke="#333" stroke-width="1"/>
                    `;
                default:
                    return '';
            }
        }).join('');
    }

    selectAvatar(avatarId) {
        const gallery = this.storage.getGallery();
        const avatar = gallery.find(a => a.id === avatarId);
        
        if (!avatar) {
            console.error('Avatar not found:', avatarId);
            return;
        }

        this.selectedAvatar = avatar;
        
        // Apply avatar data to the renderer
        if (window.avatarRenderer) {
            window.avatarRenderer.loadAvatarData(avatar.data);
        }

        // Update UI
        this.updateSelectedUI();
        
        // Show notification
        if (window.NotificationsModule) {
            window.NotificationsModule.showSuccess(`Avatar "${avatar.name}" selezionato!`);
        }
    }

    updateSelectedUI() {
        // Update selected state in gallery
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`[data-avatar-id="${this.selectedAvatar.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    }

    deleteAvatar(avatarId) {
        if (!confirm('Sei sicuro di voler eliminare questo avatar?')) {
            return;
        }

        const success = this.storage.deleteFromGallery(avatarId);
        if (success) {
            this.loadGallery();
            if (window.NotificationsModule) {
                window.NotificationsModule.showInfo('Avatar eliminato dalla galleria');
            }
        } else {
            if (window.NotificationsModule) {
                window.NotificationsModule.showError('Errore nell\'eliminazione dell\'avatar');
            }
        }
    }

    createNewAvatar() {
        // Reset renderer to default state
        if (window.avatarRenderer) {
            window.avatarRenderer.reset();
        }
        
        // Clear selection
        this.selectedAvatar = null;
        this.updateSelectedUI();
        
        // Show notification
        if (window.NotificationsModule) {
            window.NotificationsModule.showInfo('Nuovo avatar creato! Personalizzalo come preferisci.');
        }
    }

    importAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const jsonData = event.target.result;
                    const importedCount = this.storage.importGallery(jsonData);
                    
                    if (importedCount > 0) {
                        this.loadGallery();
                        if (window.NotificationsModule) {
                            window.NotificationsModule.showSuccess(`${importedCount} avatar importati con successo!`);
                        }
                    } else {
                        if (window.NotificationsModule) {
                            window.NotificationsModule.showError('Nessun avatar valido trovato nel file');
                        }
                    }
                } catch (error) {
                    console.error('Error importing avatar:', error);
                    if (window.NotificationsModule) {
                        window.NotificationsModule.showError('Errore nell\'importazione dell\'avatar');
                    }
                }
            };
            
            reader.readAsText(file);
        });
        
        input.click();
    }

    exportGallery() {
        const success = this.storage.exportGallery();
        if (success) {
            if (window.NotificationsModule) {
                window.NotificationsModule.showSuccess('Galleria esportata con successo!');
            }
        } else {
            if (window.NotificationsModule) {
                window.NotificationsModule.showError('Errore nell\'esportazione della galleria');
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    getCurrentAvatar() {
        return this.selectedAvatar;
    }

    refresh() {
        this.loadGallery();
    }
}

// Export for global use
window.AvatarGallery = AvatarGallery;
