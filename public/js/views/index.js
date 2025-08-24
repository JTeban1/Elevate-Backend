// ========================================
// INDEX.JS - Lógica mínima de la página principal
// ========================================

import { initAuth } from '../utils/guard.js';

/**
 * Inicializa la página principal
 */
function initHomePage() {
    initAuth();
}

/**
 * Inicialización cuando el DOM esté listo
 */
function onDOMContentLoaded() {
    initHomePage();
    console.log('🚀 TalentTrack loaded');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
    onDOMContentLoaded();
}