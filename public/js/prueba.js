let currentVacancyId = null;
    
    // Funciones del Modal Principal
    function openCreateModal() {
      document.getElementById('modalTitle').textContent = 'Nueva Vacante';
      document.getElementById('vacancyModal').classList.remove('hidden');
      currentVacancyId = null;
    }
    
    function openEditModal(id) {
      document.getElementById('modalTitle').textContent = 'Editar Vacante';
      document.getElementById('vacancyModal').classList.remove('hidden');
      currentVacancyId = id;
      // Aquí cargarías los datos de la vacante para editar
    }
    
    function closeModal() {
      document.getElementById('vacancyModal').classList.add('hidden');
      currentVacancyId = null;
    }
    
    // Funciones del Modal de Eliminación
    function confirmDelete(id) {
      currentVacancyId = id;
      document.getElementById('deleteModal').classList.remove('hidden');
    }
    
    function closeDeleteModal() {
      document.getElementById('deleteModal').classList.add('hidden');
      currentVacancyId = null;
    }
    
    function deleteVacancy() {
      // Aquí implementarías la lógica de eliminación
      console.log('Eliminando vacante:', currentVacancyId);
      closeDeleteModal();
    }
    
    // Función para ver detalles de la vacante
    function viewVacancy(id) {
      // Aquí implementarías la navegación a la vista detallada
      console.log('Viendo vacante:', id);
    }
    
    // Cerrar modales con Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
        closeDeleteModal();
      }
    });
    
    // Cerrar modales al hacer clic fuera
    document.getElementById('vacancyModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });
    
    document.getElementById('deleteModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeDeleteModal();
      }
    });