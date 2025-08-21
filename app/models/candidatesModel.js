export const findCandidates = async () => {
    const result = await pool.query(`
        SELECT candidates.candidate_name, candidates.AI_summary 
        FROM candidates
    `);
    return result.rows;
};

export const findCandidatesByFilters = async (filters) => {
    let baseQuery = 'SELECT candidates.candidate_name, candidates.AI_summary WHERE 1=1';
    let values = [];
    let index = 1;

    if (filters.occupation) {
        baseQuery += `AND occupation = $${index}`;
        values.push(filters.occupation);
        index++;
    };

    if (filters.location) {
        baseQuery += `AND location = $${index}`;
        values.push(filters.location);
        index++;
    };

    if (filters.experience) {
        baseQuery += `AND experience >= $${index}`;
        values.push(filters.experience);
        index++;
    };

    if (filters.skills && filters.skills.length > 0) {
        let conditions = [];
        filters.skills.forEach(skill => {
            conditions.push(`skills ILIKE $${index}`);
            values.push(`%${skill}%`);
            index++;
        });
        baseQuery += `AND (${conditions.join('OR')})`;
    };

    if (filters.education && filters.education.length > 0) {
        let conditions = [];
        filters.education.forEach(degree => {
            conditions.push(`education ILIKE $${index}`);
            values.push(`%${education}%`);
            index++;
        });
        baseQuery += `AND (${conditions.join('OR')})`;
    };

     if (filters.keywords && filters.keywords.length > 0) {
        let conditions = [];
        filters.keywords.forEach(keyword => {
            conditions.push(`keywords ILIKE $${index}`);
            values.push(`%${keywords}%`);
            index++;
        });
        baseQuery += `AND (${conditions.join('OR')})`;
    };

    const result = await pool.query(baseQuery, values);
    return result.rows;
};

