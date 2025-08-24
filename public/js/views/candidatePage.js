import { guard } from '../utils/guard.js';
import { getCandidates } from '../api/candidates.js';
import { fetchData } from '../api/api.js';

// Estado global
let candidate = null;
let applications = [];

/**
 * Obtener parametros de la URL
 */
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id')
    };
}

/**
 * Cargar candidato especifico
 */
async function loadCandidate() {
    try {
        const params = getURLParams();
        
        if (!params.id) {
            showError('ID de candidato no proporcionado');
            return;
        }

        // Cargar candidato y aplicaciones
        const candidates = await getCandidates();
        applications = await fetchData('applications');
        
        candidate = candidates.find(c => c.candidate_id == params.id);
        
        if (!candidate) {
            showError('Candidato no encontrado');
            return;
        }

        renderCandidate();
        hideLoading();

    } catch (error) {
        console.error('Error loading candidate:', error);
        showError('Error al cargar la informacion del candidato');
    }
}

/**
 * Renderizar informacion del candidato
 */
function renderCandidate() {
    // Header information
    document.getElementById('candidate-title').textContent = `Candidato: ${candidate.name}`;
    document.getElementById('candidate-occupation').textContent = candidate.occupation;
    
    // Profile section
    const initials = candidate.name.split(' ').map(name => name.charAt(0)).join('');
    document.getElementById('candidate-initials').textContent = initials;
    document.getElementById('candidate-name').textContent = candidate.name;
    document.getElementById('candidate-job').textContent = candidate.occupation;
    document.getElementById('candidate-email').textContent = candidate.email;
    
    // Contact info
    document.getElementById('contact-email').textContent = candidate.email;
    document.getElementById('contact-phone').textContent = 'No proporcionado'; // Los datos no incluyen telefono
    
    // Applications count
    const candidateApplications = applications.filter(app => app.candidate_id === candidate.candidate_id);
    document.getElementById('candidate-applications').textContent = candidateApplications.length;
    
    // Summary
    document.getElementById('candidate-summary').textContent = candidate.summary || 'No hay resumen disponible';
    
    // Skills
    renderSkills();
    
    // Languages
    renderLanguages();
    
    // Experience
    renderExperience();
    
    // Education
    renderEducation();
}

/**
 * Renderizar habilidades
 */
function renderSkills() {
    const skillsContainer = document.getElementById('candidate-skills');
    skillsContainer.innerHTML = '';
    
    try {
        const skills = JSON.parse(candidate.skills || '[]');
        
        if (skills.length === 0) {
            skillsContainer.innerHTML = '<span class="text-gray-500">No hay habilidades registradas</span>';
            return;
        }
        
        skills.forEach(skill => {
            const skillElement = document.createElement('span');
            skillElement.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
            skillElement.textContent = skill;
            skillsContainer.appendChild(skillElement);
        });
    } catch (error) {
        skillsContainer.innerHTML = '<span class="text-red-500">Error al cargar habilidades</span>';
    }
}

/**
 * Renderizar idiomas
 */
function renderLanguages() {
    const languagesContainer = document.getElementById('candidate-languages');
    languagesContainer.innerHTML = '';
    
    try {
        const languages = JSON.parse(candidate.languages || '[]');
        
        if (languages.length === 0) {
            languagesContainer.innerHTML = '<span class="text-gray-500">No hay idiomas registrados</span>';
            return;
        }
        
        languages.forEach(language => {
            const languageElement = document.createElement('span');
            languageElement.className = 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium';
            languageElement.textContent = language;
            languagesContainer.appendChild(languageElement);
        });
    } catch (error) {
        languagesContainer.innerHTML = '<span class="text-red-500">Error al cargar idiomas</span>';
    }
}

/**
 * Renderizar experiencia
 */
function renderExperience() {
    const experienceContainer = document.getElementById('candidate-experience');
    experienceContainer.innerHTML = '';
    
    try {
        const experience = JSON.parse(candidate.experience || '[]');
        
        if (experience.length === 0) {
            experienceContainer.innerHTML = '<p class="text-gray-500">No hay experiencia registrada</p>';
            return;
        }
        
        experience.forEach(exp => {
            const expElement = document.createElement('div');
            expElement.className = 'flex gap-4 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200';
            expElement.innerHTML = `
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200Z"/>
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="text-gray-800 font-medium">${exp}</p>
                </div>
            `;
            experienceContainer.appendChild(expElement);
        });
    } catch (error) {
        experienceContainer.innerHTML = '<p class="text-red-500">Error al cargar experiencia</p>';
    }
}

/**
 * Renderizar educacion
 */
function renderEducation() {
    const educationContainer = document.getElementById('candidate-education');
    educationContainer.innerHTML = '';
    
    try {
        const education = JSON.parse(candidate.education || '[]');
        
        if (education.length === 0) {
            educationContainer.innerHTML = '<p class="text-gray-500">No hay educacion registrada</p>';
            return;
        }
        
        education.forEach(edu => {
            const eduElement = document.createElement('div');
            eduElement.className = 'flex gap-4 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200';
            eduElement.innerHTML = `
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"/>
                    </svg>
                </div>
                <div class="flex-1">
                    <p class="text-gray-800 font-medium">${edu}</p>
                </div>
            `;
            educationContainer.appendChild(eduElement);
        });
    } catch (error) {
        educationContainer.innerHTML = '<p class="text-red-500">Error al cargar educacion</p>';
    }
}

/**
 * Mostrar error
 */
function showError(message) {
    const loadingElement = document.getElementById('loading-candidate');
    loadingElement.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <p class="text-red-600 font-medium mb-2">${message}</p>
            <a href="candidates-page.html" class="text-blue-600 hover:text-blue-800 underline">Volver a candidatos</a>
        </div>
    `;
}

/**
 * Ocultar loading
 */
function hideLoading() {
    document.getElementById('loading-candidate').classList.add('hidden');
    document.getElementById('candidate-content').classList.remove('hidden');
}

/**
 * Configurar dropdown del usuario
 */
function setupUserDropdown() {
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');

    // User dropdown functionality
    userAvatar?.addEventListener('click', function() {
        userDropdown?.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!userAvatar?.contains(event.target) && !userDropdown?.contains(event.target)) {
            userDropdown?.classList.add('hidden');
        }
    });

    // Get logged user data (guard.js already validated it exists)
    const loggedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = loggedUser.name || 'Usuario';
    const userEmail = loggedUser.email || 'usuario@example.com';
    const initials = userName.split(' ').map(name => name.charAt(0)).join('');
    
    document.getElementById('user-initials').textContent = initials;
    document.getElementById('user-name').textContent = userName;
    document.getElementById('user-email').textContent = userEmail;

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear session data
            localStorage.removeItem('currentUser');
            localStorage.removeItem('returnUrl');
            
            // Redirect to index
            window.location.href = 'index.html';
        });
    }
}

/**
 * Inicializacion cuando el DOM esta listo
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Protecting candidate detail page');
    
    // Configurar dropdown del usuario
    setupUserDropdown();
    
    // Ejecutar guard para proteger la pagina
    const currentPage = window.location.pathname.split('/').pop();
    guard(currentPage);
    
    // Si llegamos aqui es que el guard paso exitosamente
    loadCandidate();
});