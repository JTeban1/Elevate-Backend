// import { guard } from '../utils/guard.js';
import { getVacancies, createVacancy as createVacancyAPI, updateVacancy as updateVacancyAPI, deleteVacancy as deleteVacancyAPI } from '../api/vacancies.js';
import { getApplications } from '../api/applications.js';

// Global application state
let vacancies = [];
let applications = [];
let currentEditingId = null;
let currentTab = 'all';
let currentVacancyToDelete = null;
let currentFilters = {
    search: '',
    status: ''
};
let currentPage = 1;
const itemsPerPage = 5;

/**
 * Cargar todas las vacantes desde JSON Server
 */
async function loadVacancies() {
    try {
        vacancies = await getVacancies();
        applications = await getApplications();
        renderVacanciesTable();
        updateStats();
    } catch (error) {
        console.error('Error loading vacancies:', error);
        showError('Error al cargar las vacantes. Verifica que JSON Server esté ejecutándose.');
    }
}

/**
 * Renderizar la tabla de vacantes
 */
function renderVacanciesTable() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Aplicar filtros
    let vacanciesToShow = applyFilters(vacancies);

    // Filter vacancies according to current tab
    if (currentTab !== 'all') {
        vacanciesToShow = vacanciesToShow.filter(v => v.status === currentTab);
    }

    // Apply pagination
    const totalItems = vacanciesToShow.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    vacanciesToShow = vacanciesToShow.slice(startIndex, endIndex);

    if (vacanciesToShow.length === 0) {
        // Determinar el mensaje apropiado
        let message = 'No hay vacantes disponibles';

        // If there are active filters, show specific message
        const hasActiveFilters = currentFilters.search || currentFilters.status;
        const hasActiveTab = currentTab !== 'all';

        if (hasActiveFilters || hasActiveTab) {
            if (hasActiveFilters && hasActiveTab) {
                message = `No hay vacantes que coincidan con los filtros y pestaña seleccionada`;
            } else if (hasActiveFilters) {
                message = `No hay vacantes que coincidan con los filtros aplicados`;
            } else if (hasActiveTab) {
                const tabLabels = {
                    'open': 'abiertas',
                    'closed': 'cerradas',
                    'paused': 'pausadas'
                };
                message = `No hay vacantes ${tabLabels[currentTab] || currentTab}`;
            }
        }

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-slate-500">
                    <div class="flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256" class="text-gray-300">
                            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
                        </svg>
                        <p class="font-medium text-gray-600">${message}</p>
                        <p class="text-sm text-gray-400">Intenta ajustar los filtros o crear una nueva vacante</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    vacanciesToShow.forEach(vacancy => {
        const row = createVacancyRow(vacancy);
        tbody.appendChild(row);
    });

    // Update pagination
    updatePagination(totalItems, totalPages);
}

/**
 * Crear fila de vacante
 */
function createVacancyRow(vacancy) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50 transition-colors';

    const statusConfig = getStatusConfig(vacancy.status);
    const initials = vacancy.title.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
    
    // Contar aplicaciones para esta vacante
    const vacancyApplications = applications.filter(app => app.vacancy_id === vacancy.vacancy_id).length;

    tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span class="text-white font-bold text-sm">${initials}</span>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-bold text-gray-900">${vacancy.title}</div>
                    <div class="text-sm text-gray-500">${vacancy.description.substring(0, 50)}${vacancy.description.length > 50 ? '...' : ''}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor}">
                <div class="w-2 h-2 ${statusConfig.dotColor} rounded-full mr-2"></div>
                ${statusConfig.label}
            </span>
        </td>
        <td class="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <span class="text-2xl font-bold text-blue-600">${vacancyApplications}</span>
                <span class="text-sm text-gray-500 ml-2">candidatos</span>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
            $${vacancy.salary.toLocaleString()}
        </td>
        <td class="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${formatDate(vacancy.creation_date)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div class="flex items-center space-x-2">
                <button data-edit-id="${vacancy.vacancy_id}" class="edit-vacancy-btn text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120Z"/>
                    </svg>
                </button>
                <button data-view-id="${vacancy.vacancy_id}" class="view-vacancy-btn text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-all" title="Ver">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128A133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
                    </svg>
                </button>
                <button data-delete-id="${vacancy.vacancy_id}" class="delete-vacancy-btn text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-all" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/>
                    </svg>
                </button>
            </div>
        </td>
    `;

    return tr;
}

/**
 * Configuración de estados
 */
function getStatusConfig(status) {
    const configs = {
        'open': {
            label: 'Abierta',
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-800',
            dotColor: 'bg-emerald-400'
        },
        'closed': {
            label: 'Cerrada',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            dotColor: 'bg-gray-400'
        },
        'paused': {
            label: 'Pausada',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            dotColor: 'bg-yellow-400'
        }
    };
    return configs[status] || configs['open'];
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Aplicar filtros a las vacantes
 */
function applyFilters(vacanciesList) {
    return vacanciesList.filter(vacancy => {
        // Text search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const titleMatch = vacancy.title.toLowerCase().includes(searchTerm);
            const descriptionMatch = vacancy.description.toLowerCase().includes(searchTerm);

            if (!titleMatch && !descriptionMatch) {
                return false;
            }
        }

        // Filtro por estado
        if (currentFilters.status && vacancy.status !== currentFilters.status) {
            return false;
        }

        return true;
    });
}

/**
 * Actualizar estadísticas
 */
function updateStats() {
    const totalVacancies = vacancies.length;
    const openVacancies = vacancies.filter(v => v.status === 'open').length;
    const closedVacancies = vacancies.filter(v => v.status === 'closed').length;
    const pausedVacancies = vacancies.filter(v => v.status === 'paused').length;

    // Update statistics cards
    const totalCard = document.getElementById('total-vacancies');
    const openCard = document.getElementById('open-vacancies');
    const applicationsCard = document.getElementById('total-applications');

    if (totalCard) totalCard.textContent = totalVacancies;
    if (openCard) openCard.textContent = openVacancies;
    if (applicationsCard) applicationsCard.textContent = applications.length;

    // Actualizar contadores de pestañas
    const tabAllCount = document.getElementById('tab-all-count');
    const tabOpenCount = document.getElementById('tab-open-count');
    const tabClosedCount = document.getElementById('tab-closed-count');
    const tabPausedCount = document.getElementById('tab-paused-count');

    if (tabAllCount) tabAllCount.textContent = totalVacancies;
    if (tabOpenCount) tabOpenCount.textContent = openVacancies;
    if (tabClosedCount) tabClosedCount.textContent = closedVacancies;
    if (tabPausedCount) tabPausedCount.textContent = pausedVacancies;
}

/**
 * Actualizar paginación
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

    // Update pagination buttons
    updatePaginationButtons(totalPages);
}

/**
 * Actualizar botones de paginación
 */
function updatePaginationButtons(totalPages) {
    // Specific selector for pagination section (not row actions)
    const paginationSection = document.querySelector('.flex.flex-col.sm\\:flex-row.items-center.justify-between.mt-6');
    if (!paginationSection) return;

    const paginationContainer = paginationSection.querySelector('.flex.items-center.space-x-2');
    if (!paginationContainer) return;

    // Create clean pagination structure
    paginationContainer.innerHTML = '';

    // Botón Anterior
    const prevButton = createPaginationButton('Anterior', currentPage === 1, () => {
        if (currentPage > 1) {
            currentPage--;
            renderVacanciesTable();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Generar botones de página según lógica progresiva
    const pageButtons = generatePageButtons(currentPage, totalPages);
    pageButtons.forEach(buttonConfig => {
        const button = createPageButton(buttonConfig);
        paginationContainer.appendChild(button);
    });

    // Botón Siguiente
    const nextButton = createPaginationButton('Siguiente', currentPage === totalPages || totalPages === 0, () => {
        if (currentPage < totalPages && totalPages > 0) {
            currentPage++;
            renderVacanciesTable();
        }
    });
    paginationContainer.appendChild(nextButton);

    // Agregar input "Ir a página" si hay muchas páginas
    if (totalPages > 15) {
        addPageJumper(paginationSection, totalPages);
    }
}

/**
 * Crear botón de paginación estándar
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
 * Generar configuración de botones de página
 */
function generatePageButtons(current, total) {
    const buttons = [];

    if (total <= 7) {
        // Mostrar todas las páginas (1-7)
        for (let i = 1; i <= total; i++) {
            buttons.push({ page: i, text: i.toString(), active: i === current });
        }
    } else if (total <= 15) {
        // Paginación simple con contexto (8-15 páginas)
        if (current <= 4) {
            // Inicio: 1 2 3 4 5 ... 15
            for (let i = 1; i <= 5; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        } else if (current >= total - 3) {
            // Final: 1 ... 11 12 13 14 15
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = total - 4; i <= total; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
        } else {
            // Medio: 1 ... 6 7 8 ... 15
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = current - 1; i <= current + 1; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        }
    } else {
        // Paginación completa para 16+ páginas
        if (current <= 4) {
            // Inicio: 1 2 3 4 5 ... 50
            for (let i = 1; i <= 5; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        } else if (current >= total - 3) {
            // Final: 1 ... 46 47 48 49 50
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = total - 4; i <= total; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
        } else {
            // Medio: 1 ... 4 5 6 7 8 ... 50
            buttons.push({ page: 1, text: '1', active: false });
            buttons.push({ page: null, text: '...', active: false });
            for (let i = current - 2; i <= current + 2; i++) {
                buttons.push({ page: i, text: i.toString(), active: i === current });
            }
            buttons.push({ page: null, text: '...', active: false });
            buttons.push({ page: total, text: total.toString(), active: false });
        }
    }

    return buttons;
}

/**
 * Crear botón de página individual
 */
function createPageButton(config) {
    const button = document.createElement('button');

    if (config.page === null) {
        // Botón de puntos suspensivos
        button.className = 'px-4 py-2 text-sm font-medium text-gray-400 cursor-default';
        button.textContent = config.text;
        button.disabled = true;
    } else {
        // Botón de página normal
        button.className = `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${config.active
                ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            }`;
        button.textContent = config.text;

        if (!config.active) {
            button.addEventListener('click', () => {
                currentPage = config.page;
                renderVacanciesTable();
            });
        }
    }

    return button;
}

/**
 * Agregar input "Ir a página" para navegación directa
 */
function addPageJumper(paginationSection, totalPages) {
    // Verificar si ya existe el jumper
    let jumperContainer = paginationSection.querySelector('.page-jumper');

    if (!jumperContainer) {
        jumperContainer = document.createElement('div');
        jumperContainer.className = 'page-jumper flex items-center gap-2 text-sm text-gray-600 mt-2 sm:mt-0';
        jumperContainer.innerHTML = `
            <span>Ir a página:</span>
            <input type="number" min="1" max="${totalPages}" class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <span>de ${totalPages}</span>
        `;

        const input = jumperContainer.querySelector('input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const page = parseInt(input.value);
                if (page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderVacanciesTable();
                    input.value = '';
                }
            }
        });

        input.addEventListener('blur', () => {
            input.value = '';
        });

        paginationSection.appendChild(jumperContainer);
    } else {
        // Actualizar límites si ya existe
        const input = jumperContainer.querySelector('input');
        input.max = totalPages;
        jumperContainer.querySelector('span:last-child').textContent = `de ${totalPages}`;
    }
}


/**
 * Mostrar pestaña (función simple)
 */
function showTab(tab, element) {
    currentTab = tab;
    currentPage = 1; // Reset pagination cuando cambia pestaña

    // Remover active de todas las pestañas
    document.querySelectorAll('#tab-all, #tab-open, #tab-closed, #tab-paused').forEach(btn => {
        btn.classList.remove('border-blue-600', 'text-blue-600', 'font-bold');
        btn.classList.add('border-transparent', 'text-gray-500');
    });

    // Agregar active a la pestaña clickeada
    element.classList.remove('border-transparent', 'text-gray-500');
    element.classList.add('border-blue-600', 'text-blue-600', 'font-bold');

    // Renderizar tabla filtrada
    renderVacanciesTable();
}

/**
 * Crear nueva vacante
 */
async function createVacancy(vacancyData) {
    try {
        const newVacancy = await createVacancyAPI(vacancyData);
        vacancies.push(newVacancy);
        renderVacanciesTable();
        updateStats();
        showSuccess('Vacante creada exitosamente');
        return newVacancy;
    } catch (error) {
        console.error('Error creating vacancy:', error);
        showError('Error al crear la vacante');
        throw error;
    }
}

/**
 * Actualizar vacante existente
 */
async function updateVacancy(id, vacancyData) {
    try {
        const updatedVacancy = await updateVacancyAPI(id, vacancyData);
        const index = vacancies.findIndex(v => v.vacancy_id === id);
        if (index !== -1) {
            vacancies[index] = updatedVacancy;
        }
        renderVacanciesTable();
        updateStats();
        showSuccess('Vacante actualizada exitosamente');
        return updatedVacancy;
    } catch (error) {
        console.error('Error updating vacancy:', error);
        showError('Error al actualizar la vacante');
        throw error;
    }
}

/**
 * Eliminar vacante
 */
async function deleteVacancy(id) {
    try {
        await deleteVacancyAPI(id);
        vacancies = vacancies.filter(v => v.vacancy_id !== id);
        renderVacanciesTable();
        updateStats();
        showSuccess('Vacante eliminada exitosamente');
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        showError('Error al eliminar la vacante');
        throw error;
    }
}

/**
 * Abrir modal para crear nueva vacante
 */
function openCreateModal() {
    currentEditingId = null;
    const modal = document.getElementById('vacancyModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = modal.querySelector('form');

    modalTitle.textContent = 'Nueva Vacante';
    form.reset();
    modal.classList.remove('hidden');
}

/**
 * Abrir modal para editar vacante existente
 */
function openEditModal(vacancyId) {
    const vacancy = vacancies.find(v => v.vacancy_id === vacancyId);
    if (!vacancy) return;

    currentEditingId = vacancyId;
    const modal = document.getElementById('vacancyModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = modal.querySelector('form');

    modalTitle.textContent = 'Editar Vacante';

    // Llenar formulario con datos existentes
    form.querySelector('input[placeholder*="Senior Software Engineer"]').value = vacancy.title;
    form.querySelector('input[placeholder*="80000"]').value = vacancy.salary;
    form.querySelector('textarea[placeholder*="principales responsabilidades"]').value = vacancy.description;
    form.querySelector('select[name="status"]')?.setAttribute('value', vacancy.status);

    modal.classList.remove('hidden');
}

/**
 * Cerrar modal de vacante
 */
function closeModal() {
    const modal = document.getElementById('vacancyModal');
    modal.classList.add('hidden');
    currentEditingId = null;
}

/**
 * Ver detalles de una vacante
 */
function viewVacancy(vacancyId) {
    // Redirigir a la página de detalle de vacante
    window.location.href = `vacanciePage.html?id=${vacancyId}`;
}

/**
 * Confirmar eliminación de vacante
 */
function confirmDelete(vacancyId) {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.remove('hidden');
    currentVacancyToDelete = vacancyId;
}

/**
 * Cerrar modal de eliminación
 */
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.add('hidden');
    currentVacancyToDelete = null;
}

/**
 * Eliminar vacante confirmada
 */
async function deleteConfirmed() {
    const vacancyId = currentVacancyToDelete;
    if (vacancyId) {
        try {
            await deleteVacancy(vacancyId);
            closeDeleteModal();
        } catch (error) {
            // Error ya manejado en deleteVacancy
        }
    }
}

/**
 * Manejar envío del formulario
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const vacancyData = {
        title: form.querySelector('input[placeholder*="Senior Software Engineer"]').value.trim(),
        description: form.querySelector('textarea[placeholder*="principales responsabilidades"]').value.trim(),
        salary: parseFloat(form.querySelector('input[placeholder*="80000"]').value) || 0,
        status: 'open',
        creation_date: new Date().toISOString().split('T')[0]
    };

    // Validación básica
    if (!vacancyData.title || !vacancyData.description) {
        showError('Por favor completa todos los campos obligatorios');
        return;
    }

    if (currentEditingId) {
        // Actualizar vacante existente
        vacancyData.vacancy_id = currentEditingId;
        updateVacancy(currentEditingId, vacancyData);
    } else {
        // Crear nueva vacante
        createVacancy(vacancyData);
    }

    closeModal();
}

/**
 * Mostrar mensaje de éxito
 */
function showSuccess(message) {
    showMessage(message, 'success');
}

/**
 * Mostrar mensaje de error
 */
function showError(message) {
    showMessage(message, 'error');
}

/**
 * Mostrar mensaje general
 */
function showMessage(message, type = 'info') {
    // Crear elemento de mensaje
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

    // Remover después de 4 segundos
    setTimeout(() => {
        messageDiv.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 4000);
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
 * Inicialización cuando el DOM está listo
 */
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop() || 'vacanciesPage.html';
    console.log(`🛡️ Protecting page: ${currentPage}`);

    // Ejecutar guard para proteger la página
    // guard(currentPage);

    console.log(`📋 Initializing vacancies CRUD for: ${currentPage}`);

    // Configurar dropdown del usuario
    setupUserDropdown();

    // Cargar vacantes al iniciar
    loadVacancies();

    // Configurar formulario
    const form = document.querySelector('#vacancyModal form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Configurar filtros
    setupFilters();

    // Configurar todos los event listeners
    setupEventListeners();
});

/**
 * Configurar event listeners para filtros
 */
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');

    // Buscar mientras escribes
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            currentPage = 1; // Reset pagination cuando cambia filtro
            renderVacanciesTable();
        });
    }

    // Filtro por estado
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value;
            currentPage = 1; // Reset pagination cuando cambia filtro
            renderVacanciesTable();
        });
    }

    // Botón aplicar filtros (ya se aplican automáticamente, pero por consistencia)
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            renderVacanciesTable();
        });
    }

    // Botón limpiar filtros
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            // Limpiar filtros
            currentFilters.search = '';
            currentFilters.status = '';
            currentPage = 1; // Reset pagination cuando se limpian filtros

            // Limpiar campos del UI
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = '';

            // Renderizar tabla sin filtros
            renderVacanciesTable();
        });
    }
}

/**
 * Configurar todos los event listeners
 */
function setupEventListeners() {
    // Botón crear vacante
    const createBtn = document.getElementById('create-vacancy-btn');
    if (createBtn) {
        createBtn.addEventListener('click', openCreateModal);
    }

    // Pestañas de filtros
    const tabAll = document.getElementById('tab-all');
    const tabOpen = document.getElementById('tab-open');
    const tabClosed = document.getElementById('tab-closed');
    const tabPaused = document.getElementById('tab-paused');

    if (tabAll) {
        tabAll.addEventListener('click', () => showTab('all', tabAll));
    }
    if (tabOpen) {
        tabOpen.addEventListener('click', () => showTab('open', tabOpen));
    }
    if (tabClosed) {
        tabClosed.addEventListener('click', () => showTab('closed', tabClosed));
    }
    if (tabPaused) {
        tabPaused.addEventListener('click', () => showTab('paused', tabPaused));
    }

    // Botones del modal
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeModal);
    }

    // Botones del modal de eliminación
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteConfirmed);
    }

    // Event listeners para botones de acciones de la tabla (se configuran dinámicamente)
    document.addEventListener('click', function (event) {
        // Botón editar
        if (event.target.closest('.edit-vacancy-btn')) {
            const btn = event.target.closest('.edit-vacancy-btn');
            const vacancyId = parseInt(btn.dataset.editId);
            openEditModal(vacancyId);
        }

        // Botón ver
        if (event.target.closest('.view-vacancy-btn')) {
            const btn = event.target.closest('.view-vacancy-btn');
            const vacancyId = parseInt(btn.dataset.viewId);
            viewVacancy(vacancyId);
        }

        // Botón eliminar
        if (event.target.closest('.delete-vacancy-btn')) {
            const btn = event.target.closest('.delete-vacancy-btn');
            const vacancyId = parseInt(btn.dataset.deleteId);
            confirmDelete(vacancyId);
        }
    });
}