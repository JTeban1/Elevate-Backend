import Candidate from '../entities/CandidateEntity.js';

// GET methods
export const getAllCandidates = async () => {
    try {
        const candidates = await Candidate.findAll({
            order: [['candidate_id', 'DESC']] // Order by most recent first
        });
        return candidates;
    } catch (error) {
        console.error('Error fetching all candidates:', error);
        throw error;
    }
};

export const getCandidateById = async (id) => {
    try {
        const candidate = await Candidate.findOne({
            where: { candidate_id: id }
        });
        return candidate;
    } catch (error) {
        console.error('Error fetching candidate by ID:', error);
        throw error;
    }
};

export const getCandidateByEmail = async (email) => {
    try {
        const candidate = await Candidate.findOne({
            where: { email: email }
        });
        return candidate;
    } catch (error) {
        console.error('Error finding candidate by email:', error);
        throw error;
    }
};

export const getCandidateByName = async (name) => {
    try {
        const candidate = await Candidate.findOne({
            where: { name: name }
        });
        return candidate;
    } catch (error) {
        console.error('Error finding candidate by name:', error);
        throw error;
    }
};

/**
 * Searches for candidates based on a query string across multiple fields.
 * The search is case-insensitive in MySQL by default.
 * 
 * @async
 * @function searchCandidates
 * @param {string} query - The search query to match against candidate fields
 * @returns {Promise<Array>} A promise that resolves to an array of candidate objects matching the search criteria
 * @throws {Error} Throws an error if the database query fails
 * 
 * @description This function performs a case-insensitive search across candidate fields including:
 * - name
 * - email
 * - occupation
 * - skills
 * - languages
 * 
 * The search uses the SQL LIKE operator with wildcards to find partial matches.
 * 
 * @example
 * // Search for candidates with "Python" in skills or occupation
 * const results2 = await searchCandidates("Python");
 */
export const searchCandidates = async (query) => {
    try {
        const candidates = await Candidate.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { occupation: { [Op.like]: `%${query}%` } },
                    { skills: { [Op.like]: `%${query}%` } },
                    { languages: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        return candidates;
    } catch (error) {
        console.error('Error searching candidates:', error);
        throw error;
    }
};

/**
 * Retrieves candidates from the database based on the provided filter criteria.
 * 
 * @async
 * @function getCandidatesByFilter
 * @param {Object} filter - The filter object containing criteria to search candidates
 * @returns {Promise<Array>} A promise that resolves to an array of candidate objects matching the filter
 * @throws {Error} Throws an error if the database query fails
 * 
 * @example
 * // Get candidates by status
 * const activeCandidates = await getCandidatesByFilter({ status: 'active' });
 * 
 * @example
 * // Get candidates by multiple criteria
 * const filteredCandidates = await getCandidatesByFilter({ 
 *   status: 'active', 
 *   department: 'IT' 
 * });
 */
export const getCandidatesByFilter = async (filter) => {
    try {
        const candidates = await Candidate.findAll({
            where: filter
        });
        return candidates;
    } catch (error) {   
        console.error('Error fetching candidates by filter:', error);
        throw error;
    }
};

// CREATE methods
export const createCandidate = async (candidate) => {
    const {
        name,
        email,
        phone,
        date_of_birth,
        occupation,
        summary,
        experience,
        skills,
        languages,
        education
    } = candidate;

    try {
        // Use Sequelize's upsert method to handle INSERT ... ON DUPLICATE KEY UPDATE
        const [candidateInstance, created] = await Candidate.upsert({
            name: name || null,
            email: email || null,
            phone: phone || null,
            date_of_birth: date_of_birth || null,
            occupation: occupation || null,
            summary: summary || null,
            experience: experience || null,
            skills: skills || null,
            languages: languages || null,
            education: education || null
        }, {
            conflictFields: ['email'], // Specify the unique field for conflict resolution
            returning: true // Return the instance
        });

        return candidateInstance.candidate_id;
    } catch (error) {
        console.error('Error inserting candidate:', error);
        throw error;
    }
};

// UPDATE methods
export const updateCandidateById = async (id, updatedData) => {
    try {
        const [updatedCandidate] = await Candidate.update(updatedData, {
            where: { candidate_id: id },
            returning: true
        });
        return updatedCandidate;
    } catch (error) {
        console.error('Error updating candidate by ID:', error);
        throw error;
    }
};

export const updateCandidateByEmail = async (email, updatedData) => {
    try {
        const [updatedCandidate] = await Candidate.update(updatedData, {
            where: { email: email },
            returning: true
        });
        return updatedCandidate;
    } catch (error) {
        console.error('Error updating candidate by email:', error);
        throw error;
    }
};

// DELETE methods
export const deleteCandidateById = async (id) => {
    try {
        const result = await Candidate.destroy({
            where: { candidate_id: id }
        });
        return result;
    } catch (error) {
        console.error('Error deleting candidate by ID:', error);
        throw error;
    }
};

export const deleteCandidateByEmail = async (email) => {
    try {
        const result = await Candidate.destroy({
            where: { email: email }
        });
        return result;
    } catch (error) {
        console.error('Error deleting candidate by email:', error);
        throw error;
    }
};
