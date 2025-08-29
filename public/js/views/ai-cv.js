import { guard } from '../utils/guard.js';
import { renderNavbar } from '../components/ui/navbar.js';

const vacancySelect = document.getElementById('vacancy');
const form = document.getElementById('cv_ai');
const loadingDiv = document.getElementById('loading');

async function loadVacancies() {
  try {
    const response = await fetch('http://localhost:9000/api/vacancies');
    const data = await response.json();

    // Fill in the select with id and title
    vacancySelect.innerHTML = '<option disabled selected>Select a vacancy</option>';
    data.forEach(v => {
      vacancySelect.innerHTML += `
        <option value="${v.vacancy_id}" data-title="${v.title}">
          ${v.title}
        </option>
      `;
    });
  } catch (error) {
    console.error('Error when showing vacancies:', error);
    alert('Error when showing vacancies');
  }
}

loadVacancies();

// ============================================================================
// HEADER FUNCTIONALITY - Added for project visual consistency
// ============================================================================


// Initialize header functionality when page loads
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'aiCvPage.html';
    
    // Run guard to protect the page
    guard(currentPage);
    
    // Render navbar component
    renderNavbar('navbar-container', 'aiCv');
    
    // Load vacancies
    loadVacancies();
});


document.getElementById('cv_ai').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  const selectedOption = vacancySelect.options[vacancySelect.selectedIndex];
  if (selectedOption) {
    formData.append("vacancy_id", selectedOption.value);      // id
    formData.append("vacancyTitle", selectedOption.dataset.title); // title
  }

  const loadingDiv = document.getElementById('loading');
  loadingDiv.classList.remove('hidden');

  try {
    const response = await fetch('http://localhost:9000/api/aicv/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Error in request: ' + response.status);

    await response.json();
    form.reset();
  } catch (error) {
    console.error('Error while sending cv:', error);
    alert('Error while sending cv');
  } finally {
    loadingDiv.classList.add('hidden');
  }
});

loadVacancies();
