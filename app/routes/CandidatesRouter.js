import { Router } from "express";
import * as CvController from '../controllers/CandidatesController.js';

const router = Router();

router.post('/', CvController.cvs);
// router.get('/', CvController.getAllCandidatesController); 

export default router;