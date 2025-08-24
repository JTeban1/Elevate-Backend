import { isEmailValid, isEmpty } from "../utils/validators.js";

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!isEmailValid(email)) {
        alert("El correo no es válido");
        return;
    }

    if (isEmpty(password)) {
        alert("La contraseña es obligatoria");
        return;
    }

    // Aquí va el fetch al API con JSON Server
    console.log("Validación OK, enviar datos...");
});
import { guard } from "../utils/guard.js";

// Ejecuta el guard para la página login
guard("login");

document.addEventListener("DOMContentLoaded", () => {
    console.log("Login page loaded");
});
