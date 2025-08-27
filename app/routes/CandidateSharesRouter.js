import { Router } from "express";
import * as candidateSharesController from '../controllers/CandidateSharesController.js';

const router = Router();

router.get('/:senderId', candidateSharesController.getCandidateSharesController);

export default router;