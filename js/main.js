/**
 * Fire Server - Main JavaScript
 * Interações da landing page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll para links internos
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

    // Animação de fade-in quando elementos aparecem no viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar seções
    document.querySelectorAll('.section, .step, .example-card, .feature').forEach(el => {
        observer.observe(el);
    });

    // Contador animado para os stats
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.dataset.suffix || '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.suffix || '');
            }
        }, 16);
    };

    // Animar stats quando aparecem
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.stat-number');
                if (number && !number.classList.contains('animated')) {
                    number.classList.add('animated');
                    const target = number.textContent;
                    number.textContent = '0';
                    
                    // Animar se for número
                    if (!isNaN(parseInt(target))) {
                        animateCounter(number, parseInt(target), 1500);
                    } else {
                        setTimeout(() => {
                            number.textContent = target;
                        }, 500);
                    }
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Adicionar efeito de hover nos cards de exemplo
    document.querySelectorAll('.example-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Adicionar efeito parallax suave ao fundo
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const fireBg = document.querySelector('.fire-bg');
        
        if (fireBg) {
            const scrolled = currentScroll * 0.5;
            fireBg.style.transform = `translateY(${scrolled}px)`;
        }
        
        lastScroll = currentScroll;
    });

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateFireMode();
        }
    });

    function activateFireMode() {
        // Efeito especial quando konami code é ativado
        document.body.style.animation = 'rainbow 3s ease infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 10000);

        // Mostrar mensagem
        const msg = document.createElement('div');
        msg.textContent = '🔥 FIRE MODE ACTIVATED! 🔥';
        msg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF6B35, #F7931E);
            color: white;
            padding: 2rem 4rem;
            border-radius: 20px;
            font-size: 2rem;
            font-weight: 900;
            z-index: 99999;
            animation: pulse 0.5s ease infinite;
        `;
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.remove();
        }, 3000);
    }

    // Log welcome message
    console.log('%c🔥 Fire Server', 'font-size: 40px; font-weight: bold; background: linear-gradient(135deg, #FF6B35, #F7931E); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cCrie sites incríveis sem código!', 'font-size: 16px; color: #A0A8C5;');
    console.log('%cVisite: https://fireserver.io', 'font-size: 14px; color: #FF6B35;');
});
