export const getCandidates = async () => {
    const result = await pool.query(`
        SELECT candidates.candidate_name, candidates.AI_summary 
        FROM candidates
    `);
    return result.rows;
};

export const getCandidatesByOccupation = async (occupation) => {
    const result = await pool.query(`
        SELECT candidates.candidate_name, candidates.AI_summary 
        FROM candidates WHERE candidates.candidate_occupation = $1
    `, [occupation]);
    return result.rows;
};

