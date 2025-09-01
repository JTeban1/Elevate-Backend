import * as candidateSharesModel from '../models/services/CandidateSharesServices.js';

/**
 * Controller function to retrieve candidate shares by sender ID
 * @async
 * @function getCandidateSharesController
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.senderId - The ID of the sender to fetch candidate shares for
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with candidate shares data or error message
 * @throws {Error} Returns 500 status code with error message if operation fails
 */
export const getCandidateSharesController = async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const candidateShares = await candidateSharesModel.getCandidateSharesByUserId(senderId);
        return res.status(200).json(candidateShares);
    } catch (error) {
        console.error("Error fetching candidate shares:", error);
        return res.status(500).json({ error: "Error fetching candidate shares" });
    }
};

/**
 * Creates a new candidate share record
 * @async
 * @function createCandidateSharesController
 * @param {Object} req - Express request object
 * @param {Object} req.body - The candidate share data to be created
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Returns a JSON response with the created candidate share data or error message
 * @throws {Error} Returns 500 status with error message if creation fails
 */
export const createCandidateSharesController = async (req, res) => {
    try {
        const newShare = req.body;
        const newCandidateShare = await candidateSharesModel.createCandidateShares(newShare);
        return res.status(201).json(newCandidateShare);
    } catch (error) {
        console.error("Error creating candidate share:", error);
        return res.status(500).json({ error: "Error creating candidate share" });
    }
};