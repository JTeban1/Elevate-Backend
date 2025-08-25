import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import CvController from './app/routes/CandidatesRouter.js'
import vacanciesControllers from './app/routes/VacanciesRouter.js'
import applicationsController from './app/routes/ApplicationsRouter.js'
<<<<<<< HEAD
import  initDefaults  from '.app/models/services/usersServices.js'

=======
import candidatesController from './app/routes/CandidatesRouter.js'
>>>>>>> ca79bb699aa4c389ed7ce6f914838463f3d9af5e

// Load environment variables from .env file
dotenv.config();

// Create an Express instance

const app = express();

// The cors middleware configures HTTP headers so that the server allows other domains (origins) to make requests.
app.use(cors());

// Is a middleware that processes incoming requests with a JSON body so that req.body can be accessed as a JavaScript object.
app.use(express.json());

// Configure routes for the endpoint
app.use('/api/aicv', CvController);
app.use('/api/vacancies', vacanciesControllers);
app.use('/api/applications', applicationsController);
app.use('/api/candidates', candidatesController);

// Configure the application port, taking the environment variable or the default value (3000)
const PORT = process.env.PORT || 9000;

// Raise the server and listen on the defined port

app.listen(PORT, async () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);

    // Inicializar datos por defecto
    try {
        await initDefaults();
        console.log("verified user");
    } catch (err) {
        console.error("vunverified user", err.message);
    }
});