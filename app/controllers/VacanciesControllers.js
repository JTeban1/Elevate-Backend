import * as vacanciesModel from '../models/services/VacanciesServices.js';

export const getAllVacanciesController = async (req, res) => {
    try {
        const allVacancies = await vacanciesModel.getAllVacancies();
        console.log('Vacancies =', allVacancies);
        return res.status(200).json(allVacancies);
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        return res.status(500).json({ error: 'Error fetching vacancies:', error });
    }
}

export const getAllVacanciesByNameController = async (req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "You must provide a name query parameter"
            });
        }

        const vacancies = await vacanciesModel.getVacanciesByName(title);

        if (!vacancies || vacancies.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'There is no vacancy with that name',
            });
        };

        return res.status(200).json({
            success: true,
            data: vacancies
        });
    } catch (error) {
        console.error('Error fetching vacancy:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const upsertVacancyController = async (req, res) => {
    try {
        const vacancy = req.body;
        const { id, created } = await vacanciesModel.upsertVacancy(vacancy);

        //response depending on creation or updating
        const message = created ? 'vacancy succesfully created' : 'vacancy succesfully updated';

        return res.status(200).json({
            success: true,
            message,
            vacancyId: id,
            action: created ? 'created' : 'updated'
        });
    } catch (error) {
        console.error('Error creating/updating vacancy', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating/updating vacancy',
            error: error.message
        });
    }
}