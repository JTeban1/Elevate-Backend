import { Router } from "express";
import * as CvController from '../controllers/CvController.js';

const router = Router();

router.post('/', CvController.cvs);

export default router;