import { isEmailValid, isPasswordValid } from "../utils/validators.js";
import { guard } from "../utils/guard.js";

/**
 * Initialize password toggle functionality
 */
function initPasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    if (!toggleButton || !passwordInput || !eyeIcon) return;

    toggleButton.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';

        // Change input type
        passwordInput.type = isPassword ? 'text' : 'password';

        // Change icon
        if (isPassword) {
            // Crossed eye (password visible)
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
            `;
        } else {
            // Normal eye (password hidden)
            eyeIcon.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            `;
        }
    });
}

/**
 * Autentica usuario con JSON Server
 */
async function authenticateUser(email, password) {
    try {
        const response = await fetch('http://localhost:8000/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();

        // Buscar usuario por email y password
        const user = users.find(u => u.email === email && u.password === password);

        return user || null;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

/**
 * Inicializa el formulario de login
 */
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validaciones
        if (!isEmailValid(email)) {
            showError("Please enter a valid email address");
            return;
        }

        if (!isPasswordValid(password)) {
            showError("Password must be at least 4 characters long");
            return;
        }

        // Loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Signing in...';
        submitButton.disabled = true;

        try {
            // Autenticación real con JSON Server
            const user = await authenticateUser(email, password);

            if (user) {
                // Guardar sesión
                localStorage.setItem('currentUser', JSON.stringify({
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id,
                    loginTime: new Date().toISOString()
                }));

                // Redirigir a vacancies
                window.location.href = 'vacanciesPage.html';
            } else {
                showError("Invalid email or password. Please try again.");
            }
        } catch (error) {
            console.error("Authentication error:", error);
            showError("Login failed. Please check your connection and try again.");
        } finally {
            // Restaurar botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

/**
 * Muestra mensaje de error temporal
 */
function showError(message) {
    // Crear o encontrar elemento de error
    let errorDiv = document.getElementById('error-message');

    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.className = 'bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-fade-in mb-4';

        const form = document.getElementById('loginForm');
        form.insertBefore(errorDiv, form.firstChild);
    }

    errorDiv.textContent = message;

    // Ocultar después de 5 segundos
    setTimeout(() => {
        if (errorDiv) {
            errorDiv.remove();
        }
    }, 5000);
}

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener("DOMContentLoaded", () => {
    // Ejecutar guard para la página login (verificar si ya está logueado)
    guard("loginPage.html");

    // Inicializar funcionalidades
    initPasswordToggle();
    initLoginForm();
});
