import { guard } from '../utils/guard.js';
import { getUsers, createUser as createUserAPI, updateUser as updateUserAPI, deleteUser as deleteUserAPI } from '../api/users.js';
import { renderNavbar } from '../components/ui/navbar.js';
import { showSuccess, showError } from '../components/ui/messageToast.js';
import { updatePagination } from '../components/ui/pagination.js';
import { isAdmin } from '../utils/auth.js';

// Global state
let allUsers = [];
let allRoles = [];
let currentEditingId = null;
let currentUserToDelete = null;
let currentFilters = {
    search: '',
    role: ''
};
let currentPage = 1;
const itemsPerPage = 8;

/**
 * Fetches users and roles from the API and initializes the view
 */
async function loadUsersAndRoles() {
    try {
        // Load users from API
        const usersResponse = await getUsers();

        // Backend returns array directly
        if (Array.isArray(usersResponse)) {
            allUsers = usersResponse;
        } else {
            throw new Error('Could not load users.');
        }

        // Static roles data (matches database)
        allRoles = [
            { role_id: 1, name: 'Admin' },
            { role_id: 2, name: 'Recruiter' }
        ];
        
        populateRoleFilters();
        populateRoleModalSelect();
        renderUsersTable();
        updateStats();
    } catch (error) {
        console.error('Initialization Error:', error);
        showError(error.message || 'Error loading page data. Please check the server connection.');
        const tbody = document.getElementById('users-tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-16 text-gray-500">Failed to load user data.</td></tr>`;
        }
    }
}

/**
 * Renders the users table based on current filters and pagination
 */
function renderUsersTable() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    let filteredUsers = applyFilters(allUsers);

    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    tbody.innerHTML = ''; // Clear previous content

    if (paginatedUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-16 text-center text-gray-500">
                    <div class="flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" class="text-gray-300">
                            <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V88a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm8,32a12,12,0,1,1,12-12A12,12,0,0,1,128,168Z"/>
                        </svg>
                        <p class="font-medium text-gray-600">No users found</p>
                        <p class="text-sm text-gray-400">Try adjusting your filters or add a new user.</p>
                    </div>
                </td>
            </tr>`;
    } else {
        paginatedUsers.forEach(user => {
            const row = createUserRow(user);
            tbody.appendChild(row);
        });
    }

    updatePagination(currentPage, totalItems, itemsPerPage, 'pagination-container', (newPage) => {
        currentPage = newPage;
        renderUsersTable();
    });

    // Update pagination info text
    document.getElementById('pagination-start').textContent = totalItems > 0 ? startIndex + 1 : 0;
    document.getElementById('pagination-end').textContent = Math.min(endIndex, totalItems);
    document.getElementById('pagination-total').textContent = totalItems;
}

/**
 * Creates a single table row for a user
 * @param {object} user - The user object
 * @returns {HTMLTableRowElement}
 */
function createUserRow(user) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50 transition-colors';

    const role = allRoles.find(r => r.role_id === user.role_id);
    const roleName = role ? role.name : 'Unknown';
    const roleClass = roleName.toLowerCase() === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
                    <span class="text-white font-bold text-sm">${initials}</span>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-bold text-gray-900">${user.name}</div>
                    <div class="text-sm text-gray-500 sm:hidden">${user.email}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${roleClass}">
                ${roleName}
            </span>
        </td>
        <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${user.email}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex items-center space-x-2">
                <button data-edit-id="${user.user_id}" class="edit-user-btn text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120Z"/></svg>
                </button>
                <button data-delete-id="${user.user_id}" class="delete-user-btn text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>
                </button>
            </div>
        </td>
    `;
    return tr;
}

/**
 * Applies search and role filters to the user list
 * @param {Array} users - The list of users to filter
 * @returns {Array} - The filtered list of users
 */
function applyFilters(users) {
    return users.filter(user => {
        const searchMatch = currentFilters.search ?
            user.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            user.email.toLowerCase().includes(currentFilters.search.toLowerCase()) :
            true;
        const roleMatch = currentFilters.role ? user.role_id == currentFilters.role : true;
        return searchMatch && roleMatch;
    });
}

/**
 * Updates the statistics cards with user counts
 */
function updateStats() {
    const totalUsers = allUsers.length;
    const adminUsers = allUsers.filter(u => u.role_id === 1).length;
    const recruiterUsers = allUsers.filter(u => u.role_id !== 1).length;

    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('admin-users').textContent = adminUsers;
    document.getElementById('recruiter-users').textContent = recruiterUsers;

    document.getElementById('tab-all-count').textContent = totalUsers;
    document.getElementById('tab-admin-count').textContent = adminUsers;
    document.getElementById('tab-recruiter-count').textContent = recruiterUsers;
}

/**
 * Populates the role filter dropdown
 */
function populateRoleFilters() {
    const roleFilter = document.getElementById('role-filter');
    if (!roleFilter) return;
    roleFilter.innerHTML = '<option value="">All roles</option>';
    allRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.role_id;
        option.textContent = role.name;
        roleFilter.appendChild(option);
    });
}

/**
 * Populates the role select dropdown in the user modal
 */
function populateRoleModalSelect() {
    const roleSelect = document.getElementById('user-role-select');
    if (!roleSelect) return;
    roleSelect.innerHTML = '';
    allRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.role_id;
        option.textContent = role.name;
        roleSelect.appendChild(option);
    });
}

/**
 * Handles form submission for creating or editing a user
 * @param {Event} event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const nameField = document.getElementById('user-name');
    const emailField = document.getElementById('user-email');
    const passwordField = document.getElementById('user-password');
    const roleField = document.getElementById('user-role-select');

    const userData = {
        name: nameField?.value?.trim() || '',
        email: emailField?.value?.trim() || '',
        password: passwordField?.value || '',
        role_id: parseInt(roleField?.value || '2')
    };

    if (!userData.name || !userData.email || !userData.role_id) {
        showError('Please fill in all required fields.');
        submitButton.disabled = false;
        return;
    }

    try {
        if (currentEditingId) {
            // Update user
            if (!userData.password) {
                // Do not send password if it's empty during an update
                delete userData.password;
            }
            await updateUserAPI(currentEditingId, userData);
            showSuccess('User updated successfully!');
        } else {
            // Create user
            if (!userData.password) {
                showError('Password is required for new users.');
                submitButton.disabled = false;
                return;
            }
            await createUserAPI(userData);
            showSuccess('User created successfully!');
        }
        closeUserModal();
        loadUsersAndRoles(); // Reload data
    } catch (error) {
        console.error('Form submission error:', error);
        showError(error.message || 'An error occurred while saving the user.');
    } finally {
        submitButton.disabled = false;
    }
}

/**
 * Opens the modal to create a new user
 */
function openCreateModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'New User';
    document.getElementById('user-name').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-password').value = '';
    document.getElementById('user-role-select').value = '2';
    document.getElementById('userModal').classList.remove('hidden');
}

/**
 * Opens the modal to edit an existing user
 * @param {number} userId
 */
function openEditModal(userId) {
    const user = allUsers.find(u => u.user_id === userId);
    if (!user) return;
    currentEditingId = userId;
    
    document.getElementById('modalTitle').textContent = 'Edit User';
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role-select').value = user.role_id;
    document.getElementById('user-password').value = '';
    document.getElementById('userModal').classList.remove('hidden');
}

/**
 * Closes the user create/edit modal
 */
function closeUserModal() {
    const modal = document.getElementById('userModal');
    modal.classList.add('hidden');
    currentEditingId = null;
}

/**
 * Opens the delete confirmation modal
 * @param {number} userId
 */
function confirmDelete(userId) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.remove('hidden');
    currentUserToDelete = userId;
}

/**
 * Closes the delete confirmation modal
 */
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.add('hidden');
    currentUserToDelete = null;
}

/**
 * Handles the confirmed deletion of a user
 */
async function deleteConfirmed() {
    if (currentUserToDelete) {
        try {
            await deleteUserAPI(currentUserToDelete);
            showSuccess('User deleted successfully.');
            closeDeleteModal();
            loadUsersAndRoles(); // Reload data
        } catch (error) {
            console.error('Delete error:', error);
            showError(error.message || 'Failed to delete user.');
        }
    }
}

/**
 * Sets up all event listeners for the page
 */
function setupEventListeners() {
    // Modal buttons
    document.getElementById('create-user-btn').addEventListener('click', openCreateModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeUserModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', closeUserModal);
    document.getElementById('user-form').addEventListener('submit', handleFormSubmit);

    // Password toggle
    const toggleBtn = document.getElementById('toggle-user-password');
    const passwordField = document.getElementById('user-password');
    const eyeIcon = document.getElementById('user-eye-icon');
    
    if (toggleBtn && passwordField && eyeIcon) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordField.type === 'password';
            passwordField.type = isPassword ? 'text' : 'password';
            
            // Change icon
            if (isPassword) {
                // Show eye-off icon
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                `;
            } else {
                // Show eye icon
                eyeIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        });
    }

    // Delete modal buttons
    document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', deleteConfirmed);

    // Filter listeners
    document.getElementById('search-input').addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        currentPage = 1;
        renderUsersTable();
    });
    document.getElementById('role-filter').addEventListener('change', (e) => {
        currentFilters.role = e.target.value;
        currentPage = 1;
        renderUsersTable();
    });
    document.getElementById('clear-filters').addEventListener('click', () => {
        currentFilters.search = '';
        currentFilters.role = '';
        document.getElementById('search-input').value = '';
        document.getElementById('role-filter').value = '';
        currentPage = 1;
        renderUsersTable();
    });

    // Tab listeners
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const roleId = e.currentTarget.id.split('-')[1];
            if (roleId === 'admin') currentFilters.role = '1';
            else if (roleId === 'recruiter') currentFilters.role = '2';
            else currentFilters.role = '';
            
            document.getElementById('role-filter').value = currentFilters.role;
            currentPage = 1;
            renderUsersTable();
            updateTabStyles(e.currentTarget.id);
        });
    });

    // Dynamic event listener for action buttons in the table
    document.getElementById('users-tbody').addEventListener('click', (event) => {
        const editBtn = event.target.closest('.edit-user-btn');
        if (editBtn) {
            openEditModal(parseInt(editBtn.dataset.editId));
        }

        const deleteBtn = event.target.closest('.delete-user-btn');
        if (deleteBtn) {
            confirmDelete(parseInt(deleteBtn.dataset.deleteId));
        }
    });
}

function updateTabStyles(activeTabId) {
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.classList.remove('border-blue-600', 'text-blue-600', 'font-bold');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    const activeTab = document.getElementById(activeTabId);
    if(activeTab) {
        activeTab.classList.add('border-blue-600', 'text-blue-600', 'font-bold');
        activeTab.classList.remove('border-transparent', 'text-gray-500');
    }
}

/**
 * Initializes the page
 */
document.addEventListener("DOMContentLoaded", () => {
    guard(); // Protect the page
    if (!isAdmin()) {
        // Further protection: redirect if not admin, as this is a sensitive page
        window.location.href = 'index.html';
        showError('You do not have permission to access this page.');
        return;
    }
    
    renderNavbar('navbar-container', 'users'); // 'users' is the new active tab key
    loadUsersAndRoles();
    setupEventListeners();
});
