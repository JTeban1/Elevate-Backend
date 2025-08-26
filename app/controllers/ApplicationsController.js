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

export const getAllApplicationsColumn = async (req, res) => {
    try {
        const applications = await applicationsModel.getAllApplicationsColumn();
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

export const updateApplicationController = async (req, res) => {
  try {
    const applicationId = req.params.id; // /applications/:id
    const updates = req.body; // { status: 'interview', ai_reason: '...' }

    const updated = await applicationsModel.updateApplication(applicationId, updates);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Application not found or no changes applied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating application",
      error: error.message,
    });
  }
};