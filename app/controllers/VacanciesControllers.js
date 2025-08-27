import * as vacanciesModel from '../models/services/VacanciesServices.js';

export const getAllVacanciesController = async (req, res) => {
    try {
        const allVacancies = await vacanciesModel.getAllVacancies();
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

export const getAllVacanciesWithCount = async (req, res) => {
  try {
    const allVacancies = await vacanciesModel.getAllVacanciesWithCount();
    return res.status(200).json(allVacancies);
  } catch (error) {
    console.error("Error fetching vacancies with count:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching vacancies",
      error: error.message
    });
  }
};

export const getApplicationsByVacancyIdController = async (req, res) => {
  try {
    const vacancyId = req.params.id;
    const applications = await vacanciesModel.getApplicationsByVacancyId(vacancyId);
    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications by vacancy:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching applications by vacancy",
      error: error.message
    });
  }
};

export const deleteVacancyController = async (req, res) => {
  try {
    const vacancyId = req.params.id;
    const deletedVacancy = await vacanciesModel.deleteVacancy({ vacancy_id: vacancyId });
    
    if (!deletedVacancy) {
      return res.status(404).json({
        success: false,
        message: 'Vacancy not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Vacancy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vacancy:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting vacancy',
      error: error.message
    });
  }
};