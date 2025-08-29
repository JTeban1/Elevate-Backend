import CandidateShares from '../entities/CandidateSharesEntity.js';
import Candidate from '../entities/CandidateEntity.js';
import User from '../entities/UserEntity.js';
import Application from '../entities/ApplicationEntity.js';
import Vacancy from '../entities/VacanciesEntity.js';

/**
 * Retrieves all candidate shares associated with a specific sender user ID.
 * 
 * @async
 * @function getCandidateSharesByUserId
 * @param {number|string} senderId - The ID of the user who sent the candidate shares
 * @returns {Promise<Array|undefined>} A promise that resolves to an array of candidate share objects with included candidate, application, and user data, ordered by creation date (newest first), or undefined if an error occurs
 * @throws {Error} Logs error to console if database query fails
 * 
 * @description
 * This function fetches candidate shares from the database where the sender_id matches the provided senderId.
 * Each returned object includes:
 * - Candidate information (name, email, phone, occupation)
 * - Application data (application_id)
 * - User information (name)
 * Results are ordered by creation date in descending order.
 */
export const getCandidateSharesByUserId = async (senderId) => {
    try {
        const candidateShares = await CandidateShares.findAll({
            where: { sender_id: senderId },
            include: [
                {
                    model: Candidate,
                    attributes: ['name', 'email', 'phone', 'occupation'],
                },
                {
                    model: Application,
                    attributes: ['application_id'],
                },
                {
                    model: User,
                    attributes: ['name']
                }
            ],
            order: [['created_at', 'DESC']],
        });
        return candidateShares;
    } catch (error) {
        console.error('Error fetching candidate shares:', error);
    }
};

/**
 * Creates a new candidate share record in the database
 * @async
 * @function createCandidateShares
 * @param {Object} newShare - The candidate share data object
 * @param {number} newShare.candidate_id - The ID of the candidate being shared
 * @param {number} newShare.sender_id - The ID of the user sending the share
 * @param {number} newShare.receiver_id - The ID of the user receiving the share
 * @param {number} newShare.application_id - The ID of the related application
 * @returns {Promise<Object|undefined>} The created candidate share object, or undefined if an error occurs
 * @throws {Error} Logs error to console if database operation fails
 */
export const createCandidateShares = async (newShare) => {
    const {
        candidate_id,
        sender_id,
        receiver_id,
        application_id,
    } = newShare
    try {
        const newCandidateShare = await CandidateShares.create({
            candidate_id,
            sender_id,
            receiver_id,
            application_id,
            status: 'pending',
        })
        return newCandidateShare;
    } catch (error) {
        console.error('Error creating candidate share:', error);
    }
};