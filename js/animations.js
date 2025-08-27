// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadAnimations();
        this.createParticles();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, options);
        
        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(`
            .animate-on-scroll,
            .animate-on-scroll-left,
            .animate-on-scroll-right,
            .animate-on-scroll-scale,
            .story-card,
            .focus-card,
            .mission-point,
            .stat-item
        `);
        
        animatableElements.forEach(element => {
            observer.observe(element);
        });
        
        this.observers.set('intersection', observer);
    }
    
    triggerAnimation(element, ratio) {
        if (element.classList.contains('animated')) return;
        
        const animationType = this.getAnimationType(element);
        const delay = this.calculateDelay(element);
        
        setTimeout(() => {
            this.executeAnimation(element, animationType);
        }, delay);
    }
    
    getAnimationType(element) {
        if (element.classList.contains('animate-on-scroll-left')) return 'slideInLeft';
        if (element.classList.contains('animate-on-scroll-right')) return 'slideInRight';
        if (element.classList.contains('animate-on-scroll-scale')) return 'scaleIn';
        if (element.classList.contains('story-card')) return 'fadeInUp';
        if (element.classList.contains('focus-card')) return 'zoomIn';
        if (element.classList.contains('mission-point')) return 'slideInLeft';
        if (element.classList.contains('stat-item')) return 'bounceIn';
        return 'fadeInUp';
    }
    
    calculateDelay(element) {
        const index = Array.from(element.parentNode.children).indexOf(element);
        return index * 100; // Stagger animations by 100ms
    }
    
    executeAnimation(element, type) {
        element.classList.add('animated', `animate-${type}`);
        
        // Add completion listener
        element.addEventListener('animationend', () => {
            element.classList.add('animation-complete');
        }, { once: true });
    }
    
    setupScrollAnimations() {
        let ticking = false;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
    
    updateScrollAnimations() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax backgrounds
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementHeight = rect.height;
            
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const yPos = (scrolled - elementTop) * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        // Floating elements
        const floatingElements = document.querySelectorAll('.animate-float');
        floatingElements.forEach((element, index) => {
            const offset = Math.sin(scrolled * 0.001 + index) * 10;
            element.style.transform = `translateY(${offset}px)`;
        });
        
        // Progress indicators
        this.updateProgressIndicators(scrolled);
    }
    
    updateProgressIndicators(scrolled) {
        const progressElements = document.querySelectorAll('.progress-indicator');
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / documentHeight) * 100;
        
        progressElements.forEach(element => {
            element.style.width = `${progress}%`;
        });
    }
    
    setupHoverAnimations() {
        // Enhanced button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e.target, e);
            });
        });
        
        // Card hover effects
        const cards = document.querySelectorAll('.story-card, .focus-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupLoadAnimations() {
        // Animate elements on page load
        window.addEventListener('load', () => {
            this.animatePageLoad();
        });
    }
    
    animatePageLoad() {
        // Animate header
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                header.style.transition = 'transform 0.8s ease';
                header.style.transform = 'translateY(0)';
            }, 100);
        }
        
        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(50px)';
            setTimeout(() => {
                heroContent.style.transition = 'all 1s ease';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        }
        
        // Animate logo
        const logo = document.querySelector('.logo-img');
        if (logo) {
            logo.style.transform = 'scale(0) rotate(180deg)';
            setTimeout(() => {
                logo.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                logo.style.transform = 'scale(1) rotate(0deg)';
            }, 500);
        }
    }
    
    createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(particleContainer);
            }, i * 200);
        }
        
        // Continuously create particles
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createParticle(particleContainer);
            }
        }, 2000);
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        const opacity = Math.random() * 0.5 + 0.2;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: var(--primary-color);
            border-radius: 50%;
            left: ${left}%;
            bottom: -10px;
            opacity: ${opacity};
            animation: float-particle ${animationDuration}s linear infinite;
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, animationDuration * 1000);
    }
    
    // Text typing animation
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Morphing shapes animation
    morphShape(element, shapes, duration = 2000) {
        let currentShape = 0;
        
        setInterval(() => {
            element.style.clipPath = shapes[currentShape];
            currentShape = (currentShape + 1) % shapes.length;
        }, duration);
    }
    
    // Advanced counter animation with easing
    animateCounterAdvanced(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const current = Math.floor(start + (target - start) * easedProgress);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Add ripple animation CSS
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.7;
        }
        90% {
            opacity: 0.7;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .animate-slideInLeft {
        animation: slideInLeft 0.8s ease-out forwards;
    }
    
    .animate-slideInRight {
        animation: slideInRight 0.8s ease-out forwards;
    }
    
    .animate-scaleIn {
        animation: scaleIn 0.8s ease-out forwards;
    }
    
    .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .animate-zoomIn {
        animation: zoomIn 0.8s ease-out forwards;
    }
    
    .animate-bounceIn {
        animation: bounceIn 1s ease-out forwards;
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(rippleStyles);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}