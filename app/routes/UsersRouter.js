import { Router } from "express";
import * as usersController from '../controllers/UsersController.js';

const router = Router();

router.get("/", usersController.getAllUsersController);
router.post("/", usersController.createUserController);
router.delete("/:id", usersController.deleteUserController);

export default router;
