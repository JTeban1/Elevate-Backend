// ========================================
// GUARD.JS - Control de Sesión y Acceso
// ========================================

/**
 * Verifica si hay una sesión activa en LocalStorage
 * @returns {boolean} true si hay sesión activa
 */
export function isLoggedIn() {
    return !!localStorage.getItem("currentUser");
}

/**
 * Obtiene los datos del usuario logueado
 * @returns {Object|null} Datos del usuario o null si no hay sesión
 */
export function getUser() {
    try {
        const userData = localStorage.getItem("currentUser");
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
}

/**
 * Guarda los datos del usuario en LocalStorage
 * @param {Object} userData - Datos del usuario a guardar
 */
export function setUser(userData) {
    try {
        localStorage.setItem("currentUser", JSON.stringify(userData));
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

/**
 * Redirige según las reglas de acceso de cada página
 * @param {string} currentPage - Página actual para aplicar las reglas
 */
export function guard(currentPage) {
    const logged = isLoggedIn();
    const user = getUser();

    console.log('🛡️ GUARD:', {
        currentPage,
        isLoggedIn: logged,
        user: user?.name || 'None',
        localStorage: localStorage.getItem('currentUser') ? '✅ Has data' : '❌ Empty'
    });

    // Guardar la página actual para redirigir después del login (solo si NO está logueado)
    if (!logged && !currentPage.includes('loginPage.html')) {
        localStorage.setItem('returnUrl', currentPage);
    }

    // Páginas que requieren autenticación
    const protectedPages = [
        'vacanciesPage.html',
        'candidatesPage.html',
        'candidatePage.html',
        'aiCvPage.html'
    ];

    // Si está en una página protegida y no está logueado
    if (protectedPages.some(page => currentPage.includes(page)) && !logged) {
        console.log('🚫 Access denied - redirecting to login');
        window.location.href = "loginPage.html";
        return;
    }

    // Si está en login y ya está logueado
    if (currentPage.includes('loginPage.html') && logged) {
        console.log('✅ Already logged in - redirecting back');
        // Verificar si hay una página anterior guardada
        const returnUrl = localStorage.getItem('returnUrl') || 'vacanciesPage.html';
        localStorage.removeItem('returnUrl'); // Limpiar después de usar
        window.location.href = returnUrl;
        return;
    }

    console.log('✅ Guard passed - access allowed');
}

/**
 * Protege una página específica requiriendo autenticación
 * @param {string} redirectTo - URL a la que redirigir si no está autenticado
 */
export function requireAuth(redirectTo = "login.html") {
    if (!isLoggedIn()) {
        window.location.href = redirectTo;
    }
}

/**
 * Aplica el guard automáticamente basado en la URL actual
 */
export function autoGuard() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    guard(currentPage);
}

/**
 * Inicializa el sistema de autenticación
 */
export function initAuth() {
    // Aplicar guard automático
    autoGuard();

    // Exponer funciones de logout globalmente para uso en navbar
    window.AuthGuard = {
        logout,
        isLoggedIn,
        getUser,
        requireAuth
    };
}
