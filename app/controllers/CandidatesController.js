import * as canditatesModel from "../models/services/CandidateServices.js";


export const getAllCandidatesController = async (req, res) => {
  try {
    const allCandidates = await canditatesModel.getAllCandidates();
    console.log('All candidates:', allCandidates);
    return res.status(200).json(allCandidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return res.status(500).json({ error: "Error fetching candidates" });
  }
};
