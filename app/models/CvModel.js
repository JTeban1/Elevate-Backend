import db from '../../config/db.js'; // tu conexión MySQL

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

    const experienceJSON = experience ? JSON.stringify(experience) : null;
    const skillsJSON = skills ? JSON.stringify(skills) : null;
    const languagesJSON = languages ? JSON.stringify(languages) : null;
    const educationJSON = education ? JSON.stringify(education) : null;

    const sql = `
        INSERT INTO candidates
        (name, email, date_of_birth, occupation, summary, experience, skills, languages, education)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            summary = VALUES(summary),
            occupation = VALUES(occupation),
            experience = VALUES(experience),
            skills = VALUES(skills),
            languages = VALUES(languages),
            education = VALUES(education)
    `;

    const values = [
        name || null,
        email || null,
        date_of_birth || null,
        occupation || null,
        summary || null,
        experienceJSON,
        skillsJSON,
        languagesJSON,
        educationJSON
    ];

    try {
        const [result] = await db.execute(sql, values);
        return result.insertId;
    } catch (error) {
        console.error('Error inserting candidate:', error);
        throw error;
    }
};
