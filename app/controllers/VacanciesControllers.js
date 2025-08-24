import * as vacanciesModel from '../models/services/VacanciesServices.js';

export const getAllVacanciesController = async ( req, res ) => {
    try {
        const allVacancies = await vacanciesModel.getAllVacancies();
        return res.status(200).json(allVacancies);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        return res.status(500).json({ error : 'Error fetching vacancies:', error});
    }
};

export const createVacancyController = async (req, res) => {
    try {
        const vacancyData = req.body;
        const newVacancy = await vacanciesModel.createVacancy(vacancyData);
        return res.status(201).json(newVacancy);
    } catch (error) {
        console.error('Error creating vacancy:', error);
        return res.status(500).json({ error: 'Error creating vacancy', details: error.message });
    }
};

export const updateVacancyController = async (req, res) => {
    try {
        const vacancyId = req.params.id;
        const vacancyData = req.body;
        const updatedVacancy = await vacanciesModel.updateVacancy(vacancyId, vacancyData);
        return res.status(200).json(updatedVacancy);
    } catch (error) {
        console.error('Error updating vacancy:', error);
        return res.status(500).json({ error: 'Error updating vacancy', details: error.message });
    }
};

export const deleteVacancyController = async (req, res) => {
    try {
        const vacancyId = req.params.id;
        await vacanciesModel.deleteVacancy(vacancyId);
        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        return res.status(500).json({ error: 'Error deleting vacancy', details: error.message });
    }
}