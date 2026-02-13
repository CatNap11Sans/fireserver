// main.js - JavaScript da landing page

(function() {
    'use strict';
    
    console.log('🔥 Fire Server - Bem-vindo!');
    
    // Animações ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards de features e exemplos
    document.querySelectorAll('.feature-card, .example-card, .step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Link do Discord
    document.getElementById('discord-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Link do Discord em breve!');
    });
    
    // Verificar se usuário está logado
    if (isAuthenticated()) {
        const user = getCurrentUser();
        console.log('Usuário logado:', user.name);
        
        // Mostrar mensagem de boas-vindas
        const nav = document.querySelector('nav');
        if (nav) {
            const welcome = document.createElement('span');
            welcome.textContent = `Olá, ${user.name}!`;
            welcome.style.marginRight = '10px';
            nav.insertBefore(welcome, nav.firstChild);
        }
    }
    
    // Analytics básico (sem API)
    const trackEvent = (category, action, label) => {
        console.log('Event:', category, action, label);
    };
    
    // Track cliques em CTAs
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('CTA', 'Click', btn.textContent);
        });
    });
    
})();
