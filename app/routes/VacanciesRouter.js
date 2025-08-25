import { Router } from "express";
import * as vacanciesControllers from '../controllers/VacanciesControllers.js';

const router = Router ();

router.get('/', vacanciesControllers.getAllVacanciesController);

router.get('/find', vacanciesControllers.getAllVacanciesByNameController);

router.post('/', vacanciesControllers.upsertVacancyController);


export default router;