export function isEmailValid(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isEmpty(value) {
    return !value || value.trim() === "";
}

export function isPasswordValid(password) {
    if (isEmpty(password)) return false;
    
    // Regex para contraseña segura (6+ chars, mayúscula, minúscula, número, caracter especial)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?.\-_+])[A-Za-z\d@#$%^&*!?.\-_+]{6,}$/;
    
    return passwordRegex.test(password);
}

export function isNameValid(name) {
    return name && typeof name === 'string' && name.trim().length >= 2;
}

export function isRoleValid(roleId) {
    return typeof roleId === 'number' && roleId > 0;
}
