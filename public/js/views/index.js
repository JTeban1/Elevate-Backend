// ========================================
// INDEX.JS - Lógica de la página principal (index.html)
// ========================================

import { initAuth } from '../utils/guard.js';

/**
 * Inicializa la página principal
 */
function initHomePage() {
    // Inicializar sistema de autenticación
    initAuth();

    // Inicializar funcionalidades específicas de la página
    initLoginButton();
    initSmoothScrolling();
    initScrollAnimations();
    initFloatingElements();
}

/**
 * Maneja el botón de login
 */
function initLoginButton() {
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
}

/**
 * Inicializa el scroll suave para enlaces internos
 */
function initSmoothScrolling() {
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

/**
 * Configura las animaciones basadas en scroll usando Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observar elementos con clase específica para animación
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Inicializa efectos de elementos flotantes adicionales
 */
function initFloatingElements() {
    // Agregar efecto parallax suave a elementos flotantes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        const floatingElements = document.querySelectorAll('.floating-elements');
        floatingElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

/**
 * Configura efectos hover mejorados
 */
function initHoverEffects() {
    // Efecto de seguimiento del mouse para cards
    const cards = document.querySelectorAll('.hover-lift');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/**
 * Inicializa contadores animados
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter');

    const countUp = (element, target) => {
        let current = 0;
        const increment = target / 100;

        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);

            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                countUp(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Maneja errores de carga de imágenes
 */
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', () => {
            // Imagen de fallback
            img.src = 'assets/img/placeholder.jpg';
            img.alt = 'Image not available';
        });
    });
}

/**
 * Función que se ejecuta cuando el DOM está completamente cargado
 */
function onDOMContentLoaded() {
    initHomePage();
    initHoverEffects();
    initAnimatedCounters();
    initImageErrorHandling();

    // Mostrar mensaje de bienvenida en consola
    console.log('🚀 TalentTrack Home Page loaded successfully!');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
    onDOMContentLoaded();
}