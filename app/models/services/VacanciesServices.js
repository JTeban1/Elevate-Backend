import { where } from 'sequelize';
import Vacancy from '../entities/VacanciesEntity.js';
import { Op } from 'sequelize';
import sequelize from '../../../config/db_conn.js';

export const getAllVacancies = async () => {
    try {
        const vacancies = await Vacancy.findAll({
            order: [['vacancy_id', 'DESC']]
        });
        return vacancies;
    } catch (error) {
        console.error('Error fetching all vacancies:', error);
        throw error;
    };
};

export const getVacanciesByName = async (title) => {
    try {
        const vacancies = await Vacancy.findAll({
            where: sequelize.where(
                sequelize.fn('LOWER', sequelize.col('title')),
                { [Op.like]: `%${title.toLowerCase()}%`}
            )
        });
        return vacancies;
    } catch (error) {
        console.error('Error fetching vacancy:', error);
        throw error;
    };
};

export const upsertVacancy = async (vacancy) => {
    const {
        title,
        description,
        salary,
        status
    } = vacancy;
    try {
        const [vacancyInstance, created] = await Vacancy.upsert({
            title: title || null,
            description: description || null,
            salary: salary || null,
            status: status || null
        }, {
            conflictFields: ['vacancy_id'],
            returning: true
        });

        return { id: vacancyInstance.vacancy_id, created }
    } catch (error) {
        console.error('Error inserting vacancy:', error);
        throw error;
    };
};

export const updateVacancy = async (vacancy) => {
    const {vacancy_id, ...fieldsToUpdate} = vacancy;

    try {
        const originalVacancy = await Vacancy.findByPk(vacancy_id);

        if(!originalVacancy) {
            return null;
        }

        const updatedVacancy = await originalVacancy.update(fieldsToUpdate);
        
        return updatedVacancy;
    } catch (error) {
        console.error('Error updating vacancie:', error);
        throw error;
    }
};

export const deleteVacancy = async (vacancy) => {
    const { vacancy_id } = vacancy;
    
    try {
        const vacancyToDelete = await Vacancy.findByPk(vacancy_id);

        if(!vacancyToDelete) {
            return null;
        }

        const deletedVacancy = await vacancyToDelete.destroy();

        return deletedVacancy;
    } catch (error) {
        console.error('Error deleting vacancy:', error);
        throw error;
    }
};


