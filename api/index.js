import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverlessExpress from '@vendia/serverless-express';

import CvController from '../app/routes/CandidatesRouter.js';
import vacanciesControllers from '../app/routes/VacanciesRouter.js';
import applicationsController from '../app/routes/ApplicationsRouter.js';
import candidatesController from '../app/routes/CandidatesRouter.js';
import usersController from '../app/routes/UsersRouter.js';
import candidateSharesController from '../app/routes/CandidateSharesRouter.js';
import authController from '../app/routes/AuthRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/aicv', CvController);
app.use('/api/vacancies', vacanciesControllers);
app.use('/api/applications', applicationsController);
app.use('/api/candidates', candidatesController);
app.use('/api/users', usersController);
app.use('/api/shares', candidateSharesController);
app.use('/api/auth', authController);

export default serverlessExpress({ app });
