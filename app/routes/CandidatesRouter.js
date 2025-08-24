import { Router } from "express";
import * as CvController from '../controllers/CandidatesController.js';
import * as CvAiController from '../controllers/UploadCandidate.js';

const router = Router();

router.post('/', CvAiController.uploadMiddleware, CvAiController.processUploadedCVsController);
router.get('/', CvController.getAllCandidatesController); 

export default router;