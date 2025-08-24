import Vacancie from '../entities/VacanciesEntity.js';

export const getAllVacancies = async () => {
    try {
        const vacancies = await Vacancie.findAll({
            order : [['vacancy_id', 'DESC']]
        });
        return vacancies;
    } catch (error) {
        console.error('Error fetching all vacancies:', error);
        throw error;
    }
};

// Crear una nueva vacante
export const createVacancy = async (vacancyData) => {
    try {
        const newVacancy = await Vacancie.create(vacancyData);
        return newVacancy;
    } catch (error) {
        console.error('Error creating vacancy:', error);
        throw error;
    }
};

export const updateVacancy = async (vacancyId, vacancyData) => {
    try {
        const [updatedRows] = await Vacancie.update(vacancyData, {
            where: { vacancy_id: vacancyId }
        });
        if (updatedRows === 0) {
            throw new Error('Vacancy not found or no changes made');
        }
        // Retornar la vacante actualizada
        const updatedVacancy = await Vacancie.findByPk(vacancyId);
        return updatedVacancy;
    } catch (error) {
        console.error('Error updating vacancy:', error);
        throw error;
    }
};

// Eliminar una vacante
export const deleteVacancy = async (vacancyId) => {
    try {
        const deletedRows = await Vacancie.destroy({
            where: { vacancy_id: vacancyId }
        });
        if (deletedRows === 0) {
            throw new Error('Vacancy not found');
        }
        return true;
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        throw error;
    }
}

