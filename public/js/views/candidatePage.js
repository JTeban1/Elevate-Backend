// import { guard } from '../utils/guard.js';
import { getCandidates } from '../api/candidates.js';
import { getApplications } from '../api/applications.js'
import { fetchData } from '../api/api.js';

// Global state
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

        // Load candidate and applications
        const candidates = await getCandidates();
        applications = await getApplications();
        
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
    // Profile section
    const initials = candidate.name.split(' ').map(name => name.charAt(0)).join('');
    document.getElementById('candidate-initials').textContent = initials;
    document.getElementById('candidate-name').textContent = candidate.name;
    document.getElementById('candidate-job').textContent = candidate.occupation;
    document.getElementById('candidate-email').textContent = candidate.email;
    
    // Applications count (for reference but not displayed on this page)
    const candidateApplications = applications.filter(app => app.candidate_id === candidate.candidate_id);
    
    // Summary
    document.getElementById('candidate-summary').textContent = candidate.summary || 'No professional summary available';
    
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
        const skills = candidate.skills || '[]';
        
        if (skills.length === 0) {
            skillsContainer.innerHTML = '<div class="text-gray-500 text-sm">No skills registered</div>';
            return;
        }
        
        skills.forEach(skill => {
            const skillElement = document.createElement('span');
            skillElement.className = 'bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium';
            skillElement.textContent = skill;
            skillsContainer.appendChild(skillElement);
        });
    } catch (error) {
        skillsContainer.innerHTML = '<div class="text-red-500 text-sm">Error loading skills</div>';
    }
}

/**
 * Renderizar idiomas
 */
function renderLanguages() {
    const languagesContainer = document.getElementById('candidate-languages');
    languagesContainer.innerHTML = '';
    
    try {
        const languages = candidate.languages || '[]';
        
        if (languages.length === 0) {
            languagesContainer.innerHTML = '<div class="text-gray-500 text-sm">No languages registered</div>';
            return;
        }
        
        languages.forEach(language => {
            const languageElement = document.createElement('span');
            languageElement.className = 'bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium';
            languageElement.textContent = language.level + ' ' + language.language;
            languagesContainer.appendChild(languageElement);
        });
    } catch (error) {
        languagesContainer.innerHTML = '<div class="text-red-500 text-sm">Error loading languages</div>';
    }
}

/**
 * Renderizar experiencia
 */
function renderExperience() {
    const experienceContainer = document.getElementById('candidate-experience');
    experienceContainer.innerHTML = '';
    
    try {
        const experience = candidate.experience || '[]';
        
        if (experience.length === 0) {
            experienceContainer.innerHTML = '<p class="text-gray-500">No hay experiencia registrada</p>';
            return;
        }
        
        experience.forEach(exp => {
            const expElement = document.createElement('div');
            expElement.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50';
            
            // Handle both object and string formats
            let title = '';
            let description = '';
            let company = '';
            
            if (typeof exp === 'object' && exp !== null) {
                // Object format with company, position, description
                company = exp.company || 'Company not specified';
                title = exp.position || 'Position not specified';
                description = exp.description || '';
                if (exp.years) {
                    company += ` (${exp.years} year${exp.years > 1 ? 's' : ''})`;
                }
            } else {
                // Simple string format
                title = exp || 'Experience';
            }
            
            expElement.innerHTML = `
                <div>
                    ${company ? `<p class="font-semibold text-gray-900">${company}</p>` : ''}
                    <p class="font-medium text-blue-600">${title}</p>
                    ${description ? `<p class="text-gray-600 text-sm mt-1">${description}</p>` : ''}
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
        const education = candidate.education || '[]';
        console.log(education);
        
        
        if (education.length === 0) {
            educationContainer.innerHTML = '<p class="text-gray-500">No hay educacion registrada</p>';
            return;
        }
        
        education.forEach(edu => {
            const eduElement = document.createElement('div');
            eduElement.className = 'p-4 border border-gray-200 rounded-lg bg-gray-50';
            eduElement.innerHTML = `
                <p class="font-semibold text-gray-900">${edu.degree}</p>
                <p class="font-medium text-blue-600">${edu.institution}</p>
                <p class="font-medium text-gray-900">${edu.years}</p>
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
        <div class="flex flex-col items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
            </div>
            <p class="font-medium text-red-600">${message}</p>
            <a href="candidatesPage.html" class="text-blue-600 hover:text-blue-800 underline text-sm">Back to Candidates</a>
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
    // guard(currentPage);
    
    // Si llegamos aqui es que el guard paso exitosamente
    loadCandidate();
});