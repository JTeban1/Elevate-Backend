import * as vacanciesModel from '../models/services/VacanciesServices.js';

export const getAllVacanciesController = async ( req, res ) => {
    try {
        const allVacancies = await vacanciesModel.getAllVacancies();
        return res.status(200).json(allVacancies);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        return res.status(500).json({ error : 'Error fetching vacancies:', error});
    }
}