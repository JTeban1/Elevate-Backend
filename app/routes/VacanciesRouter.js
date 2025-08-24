import { Router } from "express";
import * as vacanciesControllers from '../controllers/VacanciesControllers.js';

const router = Router ();

router.get('/', vacanciesControllers.getAllVacanciesController);

router.post('/', vacanciesControllers.createVacancyController);

router.put('/:id', vacanciesControllers.updateVacancyController);

router.delete('/:id', vacanciesControllers.deleteVacancyController);

export default router;