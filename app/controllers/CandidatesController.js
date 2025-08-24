import * as canditatesModel from "../models/services/CandidateServices.js";


export const getAllCandidatesController = async (req, res) => {
  try {
    const allCandidates = await canditatesModel.getAllCandidates();
    return res.status(200).json(allCandidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return res.status(500).json({ error: "Error fetching candidates" });
  }
};


export const getCandidateByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await candidatesModel.getCandidateById(id);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    return res.status(500).json({ error: "Error fetching candidate by ID" });
  }
};

export const getCandidateByEmailController = async (req, res) => {
  const { email } = req.params;
  try {
    const candidate = await candidatesModel.getCandidateByEmail(email);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate by email:", error);
    return res.status(500).json({ error: "Error fetching candidate by email" });
  }
};

export const getCandidateByNameController = async (req, res) => {
  const { name } = req.params;
  try {
    const candidate = await candidatesModel.getCandidateByName(name);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate by name:", error);
    return res.status(500).json({ error: "Error fetching candidate by name" });
  }
};

export const createCandidateController = async (req, res) => {
  const candidateData = req.body;
  try {
    const candidateId = await candidatesModel.createCandidate(candidateData);
    return res.status(201).json({ candidate_id: candidateId });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return res.status(500).json({ error: "Error creating candidate" });
  }
};

export const updateCandidateController = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const updatedCandidate = await candidatesModel.updateCandidateById(id, updatedData);
    if (!updatedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return res.status(500).json({ error: "Error updating candidate" });
  }
};

export const deleteCandidateController = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await candidatesModel.deleteCandidateById(id);
    if (!result) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return res.status(500).json({ error: "Error deleting candidate" });
  }
};

/**
 * Controller function to get candidates filtered by skill, location, and experience
 * @async
 * @function getCandidatesByFilterController
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.skill] - Skill to filter candidates by
 * @param {string} [req.query.location] - Location to filter candidates by
 * @param {string} [req.query.experience] - Experience level to filter candidates by
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns filtered candidates array or error message
 * @throws {Error} Returns 500 status with error message if filtering fails
 * @example
 * // Example request
 * GET /candidates?skill=JavaScript&location=Remote&experience=Senior
 *
 * @example
 * const filter = {
 *    [Op.or]: [
 *        { occupation: "Software Developer" },
 *        { occupation: "Data Scientist" }
 *    ]
 * };
 * const techCandidates = await getCandidatesByFilter(filter);
 */
export const getCandidatesByFilterController = async (req, res) => {
  const { skill, location, experience } = req.query;
  try {
    const filteredCandidates = await candidatesModel.getCandidatesByFilter({
      skill,
      location,
      experience,
    });
    return res.status(200).json(filteredCandidates);
  } catch (error) {
    console.error("Error fetching candidates by filter:", error);
    return res.status(500).json({ error: "Error fetching candidates by filter" });
  }
};

