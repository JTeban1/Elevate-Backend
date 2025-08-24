
import Application from '../entities/ApplicationEntity.js';
import Candidate from '../entities/CandidateEntity.js';
import Vacancy from '../entities/VacanciesEntity.js';

export const createApplication = async (applicationData) => {
  try {
    const newApplication = await Application.create(applicationData);
    return newApplication;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

export const getApplications = async () => {
    try {
        const applications = await Application.findAll({
            attributes: ['application_id', 'status', 'ai_reason'], // columnas de Application
            include: [
                {
                    model: Candidate,
                    attributes: ['name'], // columna de Candidate
                },
                {
                    model: Vacancy,
                    attributes: ['title'], // columna de Vacancy
                },
            ],
        });
        return applications;
    } catch (error) {
        console.error('Error fetching applications:', error);
    }
}

export const getApplicationsForVacancyId = async (reqVacancy_id) => {
  try {
    const applications = await Application.findAll({
      attributes: ['application_id', 'status', 'ai_reason'],
      include: [
        {
          model: Candidate,
          attributes: ['name'],
        },
        {
          model: Vacancy,
          attributes: ['vacancy_id', 'title'],
          where: { vacancy_id: reqVacancy_id }, // filtro por ID de la vacante
        },
      ],
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};

export const getApplicationsForVacancyIdAndStatus = async (reqVacancy_id, status) => {
  try {
    const applications = await Application.findAll({
      attributes: ['application_id', 'status', 'ai_reason'],
      where: { status },
      include: [
        {
          model: Candidate,
          attributes: ['name'],
        },
        {
          model: Vacancy,
          attributes: ['vacancy_id', 'title'],
          where: { vacancy_id: reqVacancy_id }, // filtro por ID de la vacante
        },
      ],
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};