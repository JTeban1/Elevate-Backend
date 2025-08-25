import { guard } from '../utils/guard.js';
import { getCandidates } from '../api/candidates.js';
import { fetchData } from '../api/api.js';

// Estado global de la aplicacion
let candidates = [];
let applications = [];
let currentFilters = {
    search: '',
    occupation: '',
    skill: ''
};
let currentPage = 1;
const itemsPerPage = 4;

/**
 * Cargar todos los candidatos desde JSON Server
 */
async function loadCandidates() {
    try {
        candidates = await getCandidates();
        applications = await fetchData('applications');

        renderCandidatesCards();
        updateStats();
        setupFilters();
    } catch (error) {
        console.error('Error loading candidates:', error);
        // Mostrar error en consola, el usuario vera que no cargan los datos
    }
}

/**
 * Configurar opciones de filtros dinamicamente
 */
function setupFilters() {
    // Ocupaciones unicas
    const occupations = [...new Set(candidates.map(c => c.occupation))];
    const occupationFilter = document.getElementById('occupation-filter');
    if (occupationFilter) {
        occupationFilter.innerHTML = '<option value="">Todas las ocupaciones</option>';
        occupations.forEach(occupation => {
            const option = document.createElement('option');
            option.value = occupation;
            option.textContent = occupation;
            occupationFilter.appendChild(option);
        });
    }

    // Skills unicos
    const allSkills = candidates.flatMap(c => {
        try {
            return JSON.parse(c.skills);
        } catch (error) {
            return [];
        }
    });
    const uniqueSkills = [...new Set(allSkills)];
    const skillFilter = document.getElementById('skill-filter');
    if (skillFilter) {
        skillFilter.innerHTML = '<option value="">Todos los skills</option>';
        uniqueSkills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            option.textContent = skill;
            skillFilter.appendChild(option);
        });
    }
}

/**
 * Renderizar las cards de candidatos
 */
function renderCandidatesCards() {
    const container = document.getElementById('candidates-container');
    if (!container) return;

    // Ocultar loading
    const loadingElement = document.getElementById('loading-candidates');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    container.innerHTML = '';

    // Aplicar filtros
    let candidatesToShow = applyFilters(candidates);

    // Aplicar paginacion
    const totalItems = candidatesToShow.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    candidatesToShow = candidatesToShow.slice(startIndex, endIndex);

    if (candidatesToShow.length === 0) {
        // Mostrar mensaje de no hay candidatos
        const hasActiveFilters = currentFilters.search || currentFilters.occupation || currentFilters.skill;
        const message = hasActiveFilters
            ? 'No hay candidatos que coincidan con los filtros aplicados'
            : 'No hay candidatos disponibles';

        container.innerHTML = `
            <div class="px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" class="text-gray-300">
                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Z"/>
                    </svg>
                    <p class="font-medium text-gray-600">${message}</p>
                    <p class="text-sm text-gray-400">Intenta ajustar los filtros o revisar la conexion</p>
                </div>
            </div>
        `;
        return;
    }

    candidatesToShow.forEach(candidate => {
        const card = createCandidateCard(candidate);
        container.appendChild(card);
    });

    // Actualizar paginacion
    updatePagination(totalItems, totalPages);
}

/**
 * Crear card de candidato
 */
function createCandidateCard(candidate) {
    const div = document.createElement('div');
    div.className = 'p-6 hover:bg-gray-50 transition-colors';

    // Parsear skills y languages
    let skills = [];
    let languages = [];
    try {
        skills = JSON.parse(candidate.skills);
        languages = JSON.parse(candidate.languages);
    } catch (error) {
        console.warn('Error parsing skills/languages for candidate:', candidate.candidate_id);
    }

    // Obtener aplicaciones del candidato
    const candidateApplications = applications.filter(app => app.candidate_id === candidate.candidate_id);
    const applicationCount = candidateApplications.length;

    // Generar iniciales para avatar
    const initials = candidate.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();

    div.innerHTML = `
        <div class="flex items-center gap-6">
            <!-- Avatar -->
            <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span class="text-white font-bold text-sm">${initials}</span>
                </div>
            </div>
            
            <!-- Informacion principal -->
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 truncate">${candidate.name}</h3>
                        <p class="text-sm text-blue-600 font-medium">${candidate.occupation}</p>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${applicationCount} aplicacion${applicationCount !== 1 ? 'es' : ''}
                        </span>
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${candidate.summary}</p>
                
                <!-- Skills y Languages -->
                <div class="flex flex-wrap gap-2 mb-3">
                    ${skills.slice(0, 3).map(skill =>
        `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">${skill}</span>`
    ).join('')}
                    ${skills.length > 3 ? `<span class="text-xs text-gray-500">+${skills.length - 3} mas</span>` : ''}
                </div>
                
                <!-- Informacion adicional -->
                <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128ZM176,80a8,8,0,0,1-8,8H152a8,8,0,0,1,0-16h16A8,8,0,0,1,176,80Zm56,48a8,8,0,0,1-8,8H208a8,8,0,0,1,0-16h16A8,8,0,0,1,232,128Z"/>
                        </svg>
                        ${candidate.email}
                    </span>
                    <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24a8,8,0,0,0-8,8V48a8,8,0,0,0,16,0V32A8,8,0,0,0,176,24Z"/>
                        </svg>
                        ${languages.join(', ')}
                    </span>
                </div>
            </div>
            
            <!-- Boton de accion -->
            <div class="flex-shrink-0">
                <button 
                    class="view-candidate-btn p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    data-candidate-id="${candidate.candidate_id}"
                    title="Ver detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Agregar evento click solo al botón de ver detalles
    const viewButton = div.querySelector('.view-candidate-btn');
    if (viewButton) {
        viewButton.addEventListener('click', () => viewCandidate(candidate.candidate_id));
    }

    return div;
}

/**
 * Aplicar filtros a los candidatos
 */
function applyFilters(candidatesList) {
    return candidatesList.filter(candidate => {
        // Filtro de busqueda por texto
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const nameMatch = candidate.name.toLowerCase().includes(searchTerm);
            const emailMatch = candidate.email.toLowerCase().includes(searchTerm);
            const occupationMatch = candidate.occupation.toLowerCase().includes(searchTerm);

            if (!nameMatch && !emailMatch && !occupationMatch) {
                return false;
            }
        }

        // Filtro por ocupacion
        if (currentFilters.occupation && candidate.occupation !== currentFilters.occupation) {
            return false;
        }

        // Filtro por skill
        if (currentFilters.skill) {
            try {
                const candidateSkills = JSON.parse(candidate.skills);
                if (!candidateSkills.includes(currentFilters.skill)) {
                    return false;
                }
            } catch (error) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Actualizar estadisticas
 */
function updateStats() {
    const totalCandidates = candidates.length;
    const candidatesWithApps = candidates.filter(candidate =>
        applications.some(app => app.candidate_id === candidate.candidate_id)
    ).length;

    const uniqueOccupations = [...new Set(candidates.map(c => c.occupation))].length;

    const allSkills = candidates.flatMap(c => {
        try {
            return JSON.parse(c.skills);
        } catch (error) {
            return [];
        }
    });
    const uniqueSkills = [...new Set(allSkills)].length;

    // Actualizar cards de estadisticas
    const totalCard = document.getElementById('total-candidates');
    const withAppsCard = document.getElementById('candidates-with-apps');
    const occupationsCard = document.getElementById('unique-occupations');
    const skillsCard = document.getElementById('unique-skills');

    if (totalCard) totalCard.textContent = totalCandidates;
    if (withAppsCard) withAppsCard.textContent = candidatesWithApps;
    if (occupationsCard) occupationsCard.textContent = uniqueOccupations;
    if (skillsCard) skillsCard.textContent = uniqueSkills;
}

/**
 * Actualizar paginacion
 */
function updatePagination(totalItems, totalPages) {
    const paginationStart = document.getElementById('pagination-start');
    const paginationEnd = document.getElementById('pagination-end');
    const paginationTotal = document.getElementById('pagination-total');

    const startItem = totalItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (paginationStart) paginationStart.textContent = startItem.toString();
    if (paginationEnd) paginationEnd.textContent = endItem.toString();
    if (paginationTotal) paginationTotal.textContent = totalItems.toString();

    // Actualizar botones de paginacion
    updatePaginationButtons(totalPages);
}

/**
 * Actualizar botones de paginacion
 */
function updatePaginationButtons(totalPages) {
    const paginationSection = document.querySelector('.flex.flex-col.sm\\:flex-row.items-center.justify-between.mt-6');
    if (!paginationSection) return;

    const paginationContainer = paginationSection.querySelector('.flex.items-center.space-x-1');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    // Boton Anterior
    const prevButton = createPaginationButton('Anterior', currentPage === 1, () => {
        if (currentPage > 1) {
            currentPage--;
            renderCandidatesCards();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Botones de p�gina
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        const button = createPageButton(i, i === currentPage);
        paginationContainer.appendChild(button);
    }

    // Bot�n Siguiente
    const nextButton = createPaginationButton('Siguiente', currentPage === totalPages || totalPages === 0, () => {
        if (currentPage < totalPages && totalPages > 0) {
            currentPage++;
            renderCandidatesCards();
        }
    });
    paginationContainer.appendChild(nextButton);
}

/**
 * Crear bot�n de paginaci�n
 */
function createPaginationButton(text, disabled, clickHandler) {
    const button = document.createElement('button');
    button.className = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${disabled
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
 * Crear bot�n de p�gina
 */
function createPageButton(pageNum, isActive) {
    const button = document.createElement('button');
    button.className = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
        ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700'
        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
        }`;
    button.textContent = pageNum.toString();

    if (!isActive) {
        button.addEventListener('click', () => {
            currentPage = pageNum;
            renderCandidatesCards();
        });
    }

    return button;
}

/**
 * Ver detalles de un candidato
 */
function viewCandidate(candidateId) {
    const candidate = candidates.find(c => c.candidate_id === candidateId);
    if (candidate) {
        console.log('Viewing candidate:', candidate);
        window.location.href = `candidatePage.html?id=${candidateId}`;
    }
}

/**
 * Configurar dropdown del usuario
 */
function setupUserDropdown() {
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');

    if (userAvatar) {
        userAvatar.addEventListener('click', function () {
            userDropdown?.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', function (event) {
        if (!userAvatar?.contains(event.target) && !userDropdown?.contains(event.target)) {
            userDropdown?.classList.add('hidden');
        }
    });

    const loggedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = loggedUser.name || 'Usuario';
    const userEmail = loggedUser.email || 'usuario@example.com';
    const initials = userName.split(' ').map(name => name.charAt(0)).join('');

    const userInitialsElement = document.getElementById('user-initials');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');

    if (userInitialsElement) userInitialsElement.textContent = initials;
    if (userNameElement) userNameElement.textContent = userName;
    if (userEmailElement) userEmailElement.textContent = userEmail;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('returnUrl');
            window.location.href = 'index.html';
        });
    }
}


/**
 * Configurar event listeners para filtros
 */
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const occupationFilter = document.getElementById('occupation-filter');
    const skillFilter = document.getElementById('skill-filter');
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');

    // Buscar mientras escribes
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentPage = 1; // Reset pagination cuando cambia filtro
            renderCandidatesCards();
        });
    }

    // Filtro por ocupaci�n
    if (occupationFilter) {
        occupationFilter.addEventListener('change', (e) => {
            currentFilters.occupation = e.target.value;
            currentPage = 1;
            renderCandidatesCards();
        });
    }

    // Filtro por skill
    if (skillFilter) {
        skillFilter.addEventListener('change', (e) => {
            currentFilters.skill = e.target.value;
            currentPage = 1;
            renderCandidatesCards();
        });
    }

    // Bot�n aplicar filtros
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            renderCandidatesCards();
        });
    }

    // Bot�n limpiar filtros
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            // Limpiar filtros
            currentFilters.search = '';
            currentFilters.occupation = '';
            currentFilters.skill = '';
            currentPage = 1;

            // Limpiar campos del UI
            if (searchInput) searchInput.value = '';
            if (occupationFilter) occupationFilter.value = '';
            if (skillFilter) skillFilter.value = '';

            // Renderizar sin filtros
            renderCandidatesCards();
        });
    }
}

// Exponer funci�n globalmente para los botones
window.viewCandidate = viewCandidate;

/**
 * Inicializaci�n cuando el DOM est� listo
 */
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop() || 'candidates.html';
    console.log(`=� Protecting page: ${currentPage}`);

    // Ejecutar guard para proteger la p�gina
    guard(currentPage);

    console.log(`=e Initializing candidates view for: ${currentPage}`);

    // Configurar dropdown del usuario
    setupUserDropdown();

    // Cargar candidatos al iniciar
    loadCandidates();

    // Configurar event listeners
    setupEventListeners();
});

