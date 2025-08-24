const vacancySelect = document.getElementById('vacancy');
const form = document.getElementById('cv_ai');
const loadingDiv = document.getElementById('loading');

async function loadVacancies() {
  try {
    const response = await fetch('http://localhost:9000/api/vacancies');
    const data = await response.json();

    // Llena el select con id y title
    vacancySelect.innerHTML = '<option disabled selected>Select a vacancy</option>';
    data.forEach(v => {
      vacancySelect.innerHTML += `
        <option value="${v.vacancy_id}" data-title="${v.title}">
          ${v.title}
        </option>
      `;
    });
  } catch (error) {
    console.error('Error al mostrar vacantes:', error);
    alert('Error al mostrar vacantes');
  }
}

form.addEventListener('submit', async function (e) {
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

    if (!response.ok) throw new Error('Error en la solicitud: ' + response.status);

    const data = await response.json();
    console.log(data);
    alert('CV enviado correctamente');
    form.reset();
  } catch (error) {
    console.error('Error al enviar el CV:', error);
    alert('Hubo un error al enviar el CV');
  } finally {
    loadingDiv.classList.add('hidden');
  }
});

loadVacancies();
