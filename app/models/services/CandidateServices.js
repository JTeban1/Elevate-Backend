import Candidate from '../entities/CandidateEntity.js';

export const createCandidate = async (candidate) => {
    const {
        name,
        email,
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

// Test placeholder