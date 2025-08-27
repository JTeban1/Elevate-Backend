import { Router } from "express";
import * as vacanciesControllers from '../controllers/VacanciesControllers.js';

const router = Router ();

router.get('/', vacanciesControllers.getAllVacanciesController);

router.get('/count', vacanciesControllers.getAllVacanciesWithCount);

router.get('/find', vacanciesControllers.getAllVacanciesByNameController);

router.get('/:id', vacanciesControllers.getApplicationsByVacancyIdController);

router.post('/', vacanciesControllers.upsertVacancyController);

router.delete('/:id', vacanciesControllers.deleteVacancyController);

export default router;