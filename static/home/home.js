// Responsabile: Home Developer - Logica JavaScript per la homepage
// Gestisce l'interattività della sezione principale della piattaforma

class HomeManager {
    constructor() {
        this.init();
    }
    
    // Inizializza tutti gli eventi e funzionalità della homepage
    init() {
        this.setupSmoothScrolling();
        this.setupNavbarEffects();
        this.setupFloatingCards();
        this.setupScrollAnimations();
        this.setupParallaxEffect();
    }
    
    // Configura lo scrolling fluido per i link di navigazione
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Configura gli effetti della navbar durante lo scrolling
    setupNavbarEffects() {
        const header = document.querySelector('.header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Aggiunge o rimuove l'ombra alla navbar
            if (currentScroll > 10) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
            }
            
            // Nasconde/mostra la navbar basandosi sulla direzione dello scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // Configura le animazioni delle carte fluttuanti nell'hero section
    setupFloatingCards() {
        const cards = document.querySelectorAll('.floating-cards .card');
        
        cards.forEach((card, index) => {
            // Aggiungi animazione di rotazione continua
            card.style.animation += `, rotate ${10 + index * 2}s linear infinite`;
        });
        
        // Aggiungi interattività al mouse
        const floatingContainer = document.querySelector('.floating-cards');
        if (floatingContainer) {
            floatingContainer.addEventListener('mousemove', (e) => {
                const rect = floatingContainer.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                cards.forEach((card, index) => {
                    const speed = (index + 1) * 0.02;
                    const xOffset = x * speed;
                    const yOffset = y * speed;
                    
                    card.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                });
            });
            
            floatingContainer.addEventListener('mouseleave', () => {
                cards.forEach(card => {
                    card.style.transform = '';
                });
            });
        }
    }
    
    // Configura le animazioni quando gli elementi entrano nel viewport
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Osserva le feature cards e altri elementi
        document.querySelectorAll('.feature-card, .about-text, .about-image').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Configura l'effetto parallasse per l'hero section
    setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Aggiungi stili CSS per le animazioni
    setupAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .feature-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .feature-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .about-text,
            .about-image {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s ease;
            }
            
            .about-text.animate-in,
            .about-image.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .header {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .floating-cards .card {
                transition: transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Gestisce il caricamento dinamico dei contenuti
    loadDynamicContent() {
        // Simula il caricamento di statistiche dinamiche
        this.animateCounters();
        this.loadTestimonials();
    }
    
    // Anima i contatori delle statistiche
    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('animated');
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Carica le testimonianze (simulato)
    loadTestimonials() {
        const testimonialsContainer = document.querySelector('.testimonials-container');
        if (!testimonialsContainer) return;
        
        // Simula il caricamento di testimonianze
        setTimeout(() => {
            testimonialsContainer.innerHTML = `
                <div class="testimonial">
                    <p>"BrainPlayNG ha rivoluzionato il mio modo di studiare!"</p>
                    <cite>- Marco R.</cite>
                </div>
            `;
        }, 1000);
    }
}

// Funzioni globali per accesso dall'HTML
let homeManager;

// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    homeManager = new HomeManager();
    homeManager.setupAnimationStyles();
    homeManager.loadDynamicContent();
});

// Espone funzioni globali se necessario
window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};
