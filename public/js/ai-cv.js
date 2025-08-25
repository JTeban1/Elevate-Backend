const vacancy = document.getElementById('vacancy');

async function loadVacancies() {
  try {
    const response = await fetch('http://localhost:9000/api/vacancies');
    const data = await response.json();

    data.forEach(dataVacancy => {
      vacancy.innerHTML += `
        <option value="${dataVacancy.title}">${dataVacancy.title}</option>
      `;
    });

  } catch (error) {
    console.error('Error al mostrar vacantes:', error);
    alert('Error al mostrar vacantes');
  }
}

loadVacancies();

// ============================================================================
// HEADER FUNCTIONALITY - Added for project visual consistency
// ============================================================================

/**
 * Setup user dropdown functionality in the header
 */
function setupUserDropdown() {
  const userAvatar = document.getElementById('user-avatar');
  const userDropdown = document.getElementById('user-dropdown');

  if (userAvatar) {
    userAvatar.addEventListener('click', function () {
      userDropdown?.classList.toggle('hidden');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function (event) {
    if (!userAvatar?.contains(event.target) && !userDropdown?.contains(event.target)) {
      userDropdown?.classList.add('hidden');
    }
  });

  // Load user information from localStorage
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

  // Logout functionality
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

// Initialize header functionality when page loads
document.addEventListener('DOMContentLoaded', setupUserDropdown);

// ============================================================================
// ORIGINAL CV AI FUNCTIONALITY - Teammate's code
// ============================================================================

document.getElementById('cv_ai').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const loadingDiv = document.getElementById('loading');
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch('http://localhost:9000/api/aicv/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Error en la solicitud: ' + response.status);

    const data = await response.json();
    console.log(data);
    alert('CV enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el CV:', error);
    alert('Hubo un error al enviar el CV');
  } finally {
    loadingDiv.classList.add('hidden');
  }
});


