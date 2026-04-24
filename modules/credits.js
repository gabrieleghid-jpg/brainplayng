// Credits Management Module
class CreditsModule {
    static STORAGE_KEY = 'bp_crediti';
    
    static getCrediti() {
        return parseInt(localStorage.getItem(this.STORAGE_KEY) || '0');
    }
    
    static setCrediti(crediti) {
        localStorage.setItem(this.STORAGE_KEY, crediti.toString());
        this.updateCreditDisplay();
    }
    
    static aggiungiCrediti(importo) {
        const attuali = this.getCrediti();
        const nuovi = attuali + importo;
        this.setCrediti(nuovi);
        return nuovi;
    }
    
    static sottraiCrediti(importo) {
        const attuali = this.getCrediti();
        if (attuali >= importo) {
            const nuovi = attuali - importo;
            this.setCrediti(nuovi);
            return nuovi;
        }
        return -1; // Crediti insufficienti
    }
    
    static updateCreditDisplay() {
        const crediti = this.getCrediti();
        const elements = document.querySelectorAll('#userCredits, #creditsDisplay, #totalCredits');
        elements.forEach(element => {
            if (element) element.textContent = crediti;
        });
    }
    
    static showCreditNotification(importo) {
        if (window.showToast) {
            window.showToast(`+${importo} crediti guadagnati!`, 'success');
        }
    }
}

// Export for global use
window.CreditsModule = CreditsModule;
