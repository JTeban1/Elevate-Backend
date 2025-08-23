export function isEmailValid(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function isEmpty(value) {
    return !value || value.trim() === "";
}
