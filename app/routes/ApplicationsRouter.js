import { Router } from "express";
import * as applicationsController from '../controllers/ApplicationsController.js';
const router = Router();

router.get('/', applicationsController.getAllApplications);
router.get('/column', applicationsController.getAllApplicationsColumn);
router.get('/:id', applicationsController.getApplicationsForVacancyId); 
router.get('/:id/:status', applicationsController.getApplicationsForVacancyIdAndStatus);
router.put("/:id", applicationsController.updateApplicationController);

export default router;