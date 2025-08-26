import { Router } from "express";
import * as usersController from '../controllers/UsersController.js';
const router = Router();

router.get('/', usersController.getAllUsers);

export default router;