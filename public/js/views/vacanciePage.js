import { guard } from '../utils/guard.js';
import { getVacancies } from '../api/vacancies.js';
import { getCandidates } from '../api/candidates.js';
import { getApplications, updateApplication } from '../api/applications.js';

// Global state
let vacancy = null;
let candidates = [];
let applications = [];
let filteredApplications = [];
let currentFilters = {
    search: '',
    status: ''
};
let currentPage = 1;
const itemsPerPage = 8;

/**
 * Get URL parameters
 */
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: parseInt(params.get('id'))
    };
}

/**
 * Load vacancy and candidates data
 */
async function loadVacancyData() {
    try {
        const params = getURLParams();
        
        if (!params.id) {
            showError('Vacancy ID not provided');
            return;
        }

        // Load data in parallel
        const [vacanciesData, candidatesData, applicationsData] = await Promise.all([
            getVacancies(),
            getCandidates(),
            getApplications()
        ]);

        // Find specific vacancy
        vacancy = vacanciesData.find(v => v.vacancy_id === params.id);
        
        if (!vacancy) {
            showError('Vacancy not found');
            return;
        }

        candidates = candidatesData;
        applications = applicationsData;

        // Filter applications for this vacancy
        filteredApplications = applications.filter(app => app.vacancy_id === params.id);


        renderVacancy();
        renderStats();
        renderCandidates();
        hideLoading();

    } catch (error) {
        console.error('Error loading vacancy data:', error);
        showError('Error loading vacancy information');
    }
}

/**
 * Render vacancy information
 */
function renderVacancy() {
    // Initials for vacancy icon
    const initials = vacancy.title.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    document.getElementById('vacancy-initials').textContent = initials;
    
    // Basic info
    document.getElementById('vacancy-title').textContent = vacancy.title;
    document.getElementById('vacancy-description').textContent = vacancy.description;
    document.getElementById('vacancy-salary').textContent = `$${vacancy.salary.toLocaleString()}`;
    document.getElementById('vacancy-id').textContent = vacancy.vacancy_id;
    
    // Format creation date
    const creationDate = new Date(vacancy.creation_date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    document.getElementById('vacancy-date').textContent = creationDate;
    
    // Status badge
    const statusBadge = document.getElementById('vacancy-status');
    const statusConfig = getStatusConfig(vacancy.status);
    statusBadge.textContent = statusConfig.label;
    statusBadge.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor}`;
}

/**
 * Render candidate statistics
 */
function renderStats() {
    const total = filteredApplications.length;
    const pending = filteredApplications.filter(app => app.status === 'pending').length;
    const interview = filteredApplications.filter(app => app.status === 'interview').length;
    const offered = filteredApplications.filter(app => app.status === 'offered').length;
    const accepted = filteredApplications.filter(app => app.status === 'accepted').length;
    
    document.getElementById('total-applications').textContent = total;
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-interview').textContent = interview;
    document.getElementById('stat-offered').textContent = offered;
    document.getElementById('stat-accepted').textContent = accepted;
}

/**
 * Render candidates list
 */
function renderCandidates() {
    const container = document.getElementById('candidates-container');
    container.innerHTML = '';

    // Aplicar filtros
    let applicationsToShow = applyFilters(filteredApplications);

    if (applicationsToShow.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" class="mx-auto text-gray-300 mb-4">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
                </svg>
                <p class="font-medium text-gray-600">No candidates found</p>
                <p class="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
        `;
        updatePagination(0, 0);
        return;
    }

    // Apply pagination
    const totalItems = applicationsToShow.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedApplications = applicationsToShow.slice(startIndex, endIndex);

    // Crear card para cada candidato
    paginatedApplications.forEach(application => {
        const candidate = candidates.find(c => c.candidate_id === application.candidate_id);
        if (candidate) {
            const candidateCard = createCandidateCard(candidate, application);
            container.appendChild(candidateCard);
        }
    });

    // Update pagination
    updatePagination(totalItems, totalPages);
}

/**
 * Create candidate card
 */
function createCandidateCard(candidate, application) {
    const div = document.createElement('div');
    div.className = 'p-6 hover:bg-gray-50 transition-colors';

    const initials = candidate.name.split(' ').map(name => name.charAt(0)).join('').substring(0, 2);
    const statusConfig = getApplicationStatusConfig(application.status);
    const applicationDate = new Date(application.application_date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    div.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Candidate Info -->
            <div class="flex items-center gap-4">
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span class="text-white font-bold text-sm">${initials}</span>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3">
                        <h3 class="font-semibold text-gray-900 truncate">${candidate.name}</h3>
                        <a href="candidatePage.html?id=${candidate.candidate_id}" 
                           class="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline flex-shrink-0">
                            View Profile
                        </a>
                    </div>
                    <p class="text-sm text-gray-600 truncate">${candidate.occupation}</p>
                    <p class="text-xs text-gray-500">${candidate.email}</p>
                </div>
            </div>

            <!-- Status and Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <div class="flex flex-col items-start sm:items-end gap-1">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}">
                        ${statusConfig.label}
                    </span>
                    <span class="text-xs text-gray-500">Applied: ${applicationDate}</span>
                </div>
                
                <!-- Status Change Dropdown -->
                <div class="relative">
                    <button type="button" data-application-id="${application.id}" 
                            class="status-dropdown-btn flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Change Status
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div class="status-dropdown-menu hidden absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div class="py-1">
                            <button data-status="pending" class="status-option block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                🟡 Pending
                            </button>
                            <button data-status="interview" class="status-option block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                🔵 Interview
                            </button>
                            <button data-status="offered" class="status-option block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                🟣 Offered
                            </button>
                            <button data-status="accepted" class="status-option block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                🟢 Accepted
                            </button>
                            <button data-status="rejected" class="status-option block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                                🔴 Rejected
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return div;
}

/**
 * Apply filters
 */
function applyFilters(applicationsList) {
    return applicationsList.filter(application => {
        const candidate = candidates.find(c => c.candidate_id === application.candidate_id);
        if (!candidate) return false;

        // Search filter by name or email
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const nameMatch = candidate.name.toLowerCase().includes(searchTerm);
            const emailMatch = candidate.email.toLowerCase().includes(searchTerm);

            if (!nameMatch && !emailMatch) {
                return false;
            }
        }

        // Application status filter
        if (currentFilters.status && application.status !== currentFilters.status) {
            return false;
        }

        return true;
    });
}

/**
 * Update application status
 */
async function updateApplicationStatus(applicationId, newStatus) {
    try {
        const application = applications.find(app => app.id === applicationId);
        if (!application) return;

        // Actualizar en la API
        const updatedApplication = await updateApplication(applicationId, {
            ...application,
            status: newStatus
        });

        // Actualizar en el estado local
        const index = applications.findIndex(app => app.id === applicationId);
        if (index !== -1) {
            applications[index] = updatedApplication;
        }

        // Update filteredApplications as well
        const filteredIndex = filteredApplications.findIndex(app => app.id === applicationId);
        if (filteredIndex !== -1) {
            filteredApplications[filteredIndex] = updatedApplication;
        }

        // Re-renderizar
        renderStats();
        renderCandidates();
        
        showSuccess(`Application status updated to ${newStatus}`);

    } catch (error) {
        console.error('Error updating application status:', error);
        showError('Error updating application status');
    }
}

/**
 * Vacancy status configuration
 */
function getStatusConfig(status) {
    const configs = {
        'open': {
            label: 'Open',
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-800'
        },
        'closed': {
            label: 'Closed',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800'
        },
        'paused': {
            label: 'Paused',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800'
        }
    };
    return configs[status] || configs['open'];
}

/**
 * Application status configuration
 */
function getApplicationStatusConfig(status) {
    const configs = {
        'pending': {
            label: 'Pending',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800'
        },
        'interview': {
            label: 'Interview',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800'
        },
        'offered': {
            label: 'Offered',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-800'
        },
        'accepted': {
            label: 'Accepted',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800'
        },
        'rejected': {
            label: 'Rejected',
            bgColor: 'bg-red-100',
            textColor: 'text-red-800'
        }
    };
    return configs[status] || configs['pending'];
}

/**
 * Show error
 */
function showError(message) {
    const loadingElement = document.getElementById('loading-vacancy');
    loadingElement.innerHTML = `
        <div class="flex flex-col items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <p class="font-medium text-red-600">${message}</p>
            <a href="vacanciesPage.html" class="text-blue-600 hover:text-blue-800 underline text-sm">Back to Vacancies</a>
        </div>
    `;
}

/**
 * Show success message
 */
function showSuccess(message) {
    showMessage(message, 'success');
}

/**
 * Show general message
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;

    if (type === 'success') {
        messageDiv.className += ' bg-emerald-50 border border-emerald-200 text-emerald-700';
    } else if (type === 'error') {
        messageDiv.className += ' bg-red-50 border border-red-200 text-red-700';
    }

    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Animar entrada
    setTimeout(() => {
        messageDiv.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        messageDiv.classList.add('translate-x-full');
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

/**
 * Ocultar loading
 */
function hideLoading() {
    document.getElementById('loading-vacancy').classList.add('hidden');
    document.getElementById('vacancy-content').classList.remove('hidden');
}

/**
 * Setup user dropdown
 */
function setupUserDropdown() {
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');

    userAvatar?.addEventListener('click', function() {
        userDropdown?.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
        if (!userAvatar?.contains(event.target) && !userDropdown?.contains(event.target)) {
            userDropdown?.classList.add('hidden');
        }
    });

    const loggedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = loggedUser.name || 'Usuario';
    const userEmail = loggedUser.email || 'usuario@example.com';
    const initials = userName.split(' ').map(name => name.charAt(0)).join('');
    
    document.getElementById('user-initials').textContent = initials;
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-email').textContent = userEmail;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('returnUrl');
            window.location.href = 'index.html';
        });
    }
}

/**
 * Setup filters
 */
function setupFilters() {
    const searchInput = document.getElementById('candidate-search');
    const statusFilter = document.getElementById('status-filter');

    // Search while typing
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentPage = 1; // Reset page when filtering
            renderCandidates();
        });
    }

    // Status filter
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1; // Reset page when filtering
            renderCandidates();
        });
    }
}

/**
 * Update pagination
 */
function updatePagination(totalItems, totalPages) {
    const paginationStart = document.getElementById('pagination-start');
    const paginationEnd = document.getElementById('pagination-end');
    const paginationTotal = document.getElementById('pagination-total');
    const paginationControls = document.getElementById('pagination-controls');

    const startItem = totalItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (paginationStart) paginationStart.textContent = startItem.toString();
    if (paginationEnd) paginationEnd.textContent = endItem.toString();
    if (paginationTotal) paginationTotal.textContent = totalItems.toString();

    // Update pagination controls
    updatePaginationControls(totalPages);
}

/**
 * Update pagination controls
 */
function updatePaginationControls(totalPages) {
    const paginationControls = document.getElementById('pagination-controls');
    if (!paginationControls) return;

    paginationControls.innerHTML = '';
    
    if (totalPages <= 1) return;

    // Previous button
    const prevButton = createPaginationButton('Previous', currentPage === 1, () => {
        if (currentPage > 1) {
            currentPage--;
            renderCandidates();
        }
    });
    paginationControls.appendChild(prevButton);

    // Page buttons
    const pageButtons = generatePageButtons(currentPage, totalPages);
    pageButtons.forEach(buttonConfig => {
        const button = createPageButton(buttonConfig);
        paginationControls.appendChild(button);
    });

    // Next button
    const nextButton = createPaginationButton('Next', currentPage === totalPages, () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderCandidates();
        }
    });
    paginationControls.appendChild(nextButton);
}

/**
 * Create pagination button
 */
function createPaginationButton(text, disabled, clickHandler) {
    const button = document.createElement('button');
    button.className = `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${disabled
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
        }`;
    button.textContent = text;
    button.disabled = disabled;

    if (!disabled) {
        button.addEventListener('click', clickHandler);
    }

    return button;
}

/**
 * Generar configuración de botones de página
 */
function generatePageButtons(current, total) {
    const buttons = [];

    if (total <= 7) {
        // Show all pages
        for (let i = 1; i <= total; i++) {
            buttons.push({ page: i, text: i.toString(), active: i === current });
        }
    } else {
        if (current <= 4) {
            // Inicio: 1 2 3 4 5 ... total
            for (let i = 1; i <= 5; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        } else if (current >= total - 3) {
            // Final: 1 ... total-4 total-3 total-2 total-1 total
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = total - 4; i <= total; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
        } else {
            // Medio: 1 ... current-1 current current+1 ... total
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = current - 1; i <= current + 1; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        }
    }

    return buttons;
}

/**
 * Create individual page button
 */
function createPageButton(config) {
    const button = document.createElement('button');

    if (config.page === null) {
        // Ellipsis button
        button.className = 'px-3 py-2 text-sm font-medium text-gray-400 cursor-default';
        button.textContent = config.text;
        button.disabled = true;
    } else {
        // Normal page button
        button.className = `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${config.active
                ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            }`;
        button.textContent = config.text;

        if (!config.active) {
            button.addEventListener('click', () => {
                currentPage = config.page;
                renderCandidates();
            });
        }
    }

    return button;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Event delegation for status dropdowns
    document.addEventListener('click', function(event) {
        // Toggle dropdown
        if (event.target.closest('.status-dropdown-btn')) {
            const btn = event.target.closest('.status-dropdown-btn');
            const menu = btn.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.status-dropdown-menu').forEach(dropdown => {
                if (dropdown !== menu) {
                    dropdown.classList.add('hidden');
                }
            });
            
            // Toggle current dropdown
            menu.classList.toggle('hidden');
            return;
        }

        // Handle status change
        if (event.target.closest('.status-option')) {
            const option = event.target.closest('.status-option');
            const newStatus = option.dataset.status;
            const menu = option.closest('.status-dropdown-menu');
            const btn = menu.previousElementSibling;
            const applicationId = parseInt(btn.dataset.applicationId);
            
            updateApplicationStatus(applicationId, newStatus);
            menu.classList.add('hidden');
            return;
        }

        // Close all dropdowns when clicking outside
        if (!event.target.closest('.status-dropdown-btn') && !event.target.closest('.status-dropdown-menu')) {
            document.querySelectorAll('.status-dropdown-menu').forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
        }
    });
}

/**
 * Initialization when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Protecting vacancy detail page');
    
    setupUserDropdown();
    
    const currentPage = window.location.pathname.split('/').pop();
    guard(currentPage);
    
    setupFilters();
    setupEventListeners();
    
    loadVacancyData();
});