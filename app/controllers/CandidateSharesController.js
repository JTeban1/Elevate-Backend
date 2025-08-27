import * as candidateSharesModel from '../models/services/CandidateSharesServices.js';

export const getCandidateSharesController = async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const candidateShares = await candidateSharesModel.getCandidateSharesByUserId(senderId);
        return res.status(200).json(candidateShares);
    } catch (error) {
        console.error("Error fetching candidateShares:", error);
        return res.status(500).json({ error: "Error fetching candidatesShares" });
    }
};