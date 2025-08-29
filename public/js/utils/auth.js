/**
 * Authentication utilities for role-based access control
 */

/**
 * Get current logged user from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Check if current user is admin
 * @returns {boolean} True if user is admin (role_id = 1)
 */
export function isAdmin() {
    const user = getCurrentUser();
    return user && user.role_id === 1;
}

/**
 * Check if current user is recruiter
 * @returns {boolean} True if user is recruiter (role_id = 2)
 */
export function isRecruiter() {
    const user = getCurrentUser();
    return user && user.role_id === 2;
}

/**
 * Get role name from role_id
 * @param {number} roleId - Role ID
 * @returns {string} Role name
 */
export function getRoleName(roleId) {
    switch(roleId) {
        case 1: return 'Admin';
        case 2: return 'Recruiter';
        default: return 'User';
    }
}