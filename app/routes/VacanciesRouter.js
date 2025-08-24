import { Router } from "express";
import * as vacanciesControllers from '../controllers/VacanciesControllers.js';

const router = Router ();

router.get('/', vacanciesControllers.getAllVacanciesController);

router.get('/find', vacanciesControllers.getAllVacanciesByNameController);

router.post('/upsert', vacanciesControllers.upsertVacancyController);

router.put('/update', vacanciesControllers.updateVacancyController);

router.delete('/delete', vacanciesControllers.deleteVacancyController);


router.post('/', vacanciesControllers.createVacancyController);

router.put('/:id', vacanciesControllers.updateVacancyController);

router.delete('/:id', vacanciesControllers.deleteVacancyController);

export default router;