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
}

