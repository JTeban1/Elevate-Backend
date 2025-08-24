import * as applicationsModel from "../models/services/ApplicationServices.js";

export const getAllApplications = async (req, res) => {
    try {
        const applications = await applicationsModel.getApplications();
        return res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ error: "Error fetching applications" });
    }
};

export const getApplicationsForVacancyId = async (req, res) => {
    try {
        const id = req.params.id;
        const applicationsForVacancy = await applicationsModel.getApplicationsForVacancyId(id);
        
        return res.status(200).json(applicationsForVacancy);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ error: "Error fetching applications" });
    }
};


export const getApplicationsForVacancyIdAndStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        const applicationsForVacancy = await applicationsModel.getApplicationsForVacancyIdAndStatus(id, status);
        
        return res.status(200).json(applicationsForVacancy);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({ error: "Error fetching applications" });
    }
};