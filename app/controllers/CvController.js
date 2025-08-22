import multer from 'multer';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDF from "pdf-extraction";
import * as cvModel from '../models/CvModel.js'

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('cv[]', 200);

export const cvs = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error al subir los archivos:', err);
            return res.status(500).json({ error: 'Error al subir los archivos' });
        }

        try {
            dotenv.config();

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            let textCv = '';
            for (const file of req.files) {

                const dataBuffer = file.buffer;
                const data = await PDF(dataBuffer);
                const cv = data.text;
                textCv += " Otra cv " + cv;
            }

            
            const prompt = `
                    You are an information extractor for resumes (CVs).
                    You must process the text of the CVs and return ONLY an array of JSON objects, one per CV.

                    The response must be JSON only, without explanations or additional text.

                    If the CV contains information in English or another language, do not translate it. Keep the information in the original language.

                    Required fields (use exactly these names and types):

                    VERY IMPORTANT:
                    - A CV can have multiple pages. Treat all pages of the same CV as belonging to the same person. 
                    - Do NOT create duplicates of the same candidate if their name, email, or personal info repeats across pages.
                    - Instead, MERGE the information across pages into a single JSON object for that candidate.
                    - Final output MUST have one JSON object per unique candidate (one CV = one object).

                    {
                        "name": string | null,
                        "email": string | null,
                        "date_of_birth": date | , If there is no date of birth, enter 2000-01-01.  // Date of birth.
                        "occupation": string | null, // Occupation (Do not use abbreviations, write it fully. 
                            If it is not explicitly mentioned, infer the main title or occupation from the experience or education. 
                            Example: if they worked for several years as a teacher → "Professor of [subject]". 
                            If they studied Electronic Engineering → "Electronic Engineer". 
                            If there is no clear clue, put null.)
                        "summary": string | null,     // Professional summary, as complete as possible
                        "experience": [ // Structured list of work experiences. 
                            // IMPORTANT: Always extract ANY professional or work activity, even if it was freelance, occasional, academic, internships, volunteering, or remote. 
                            // Do not omit experiences just because they are not in a company.
                            {
                                "years": number | null,   // Number of years of experience (integers only).
                                    // Calculation rules (MUST always be applied if dates or durations are present):
                                    // 1. If the text says "less than one year", return 0.
                                    // 2. If a range of years appears (e.g., "2019 - 2023"), calculate the difference (2023 - 2019 = 4).
                                    // 3. If a range ends in "Present", "Actualidad" or "Presente", calculate from the start date until the current year (2025).
                                    // 4. If ranges with months appear (e.g., "Jan 2019 - Mar 2021"), convert months to years, rounding down.
                                    //    Example: 2 years and 11 months → 2,
                                    //    Example: August 2024 - March 2025 -> 0 (because it is 7 months, less than 1 year)
                                    // 5. If only an explicit number of years appears (e.g., "3 years of experience"), use that number.
                                    // 6. If there is work experience text but no explicit dates or durations to calculate from, return null.
                                    // 7. Only return null if NO dates or durations are given. Never ignore valid ranges.
                                    // 8. This field must always be a number or null, never text
                                "position": string | null, // Job title (if not given, summarize from description)
                                "company": string | null,  // Company, institution, or write "Freelance" / "Independent" if self-employed
                                "description": string | null // Brief detail of main functions
                            }
                        ],

                        "skills": [string] | null,    // List of technical skills
                            - Always extract the candidate's main skills.  
                            - Avoid being too specific: if multiple skills belong to the same category (e.g., "regulated electrical installations, normal electrical installations, lighting"), group them into one general skill ("Electrical installations").  
                            - Do not list tasks as skills. Only include them if they represent a broader capability or technical area.  
                            - Aim for 6 to 12 concise skills maximum.  
                            - Skills must be short and general (e.g., "Automation", "Electrical networks", "Teamwork").  
                        "languages": [string] | null, // List of languages. If not present, assume ["Spanish"].
                        "education": [string] | null, // List of academic degrees
                        "ai_reason": string | null,   // Brief objective analysis of why this candidate may or may not be suitable for the position, Don't just write “approved” or “not approved.”
                        "status": "Approved" | "Not Approved" // Based on whether they meet the job requirements
                    }

                    Vacancy: Software development.
                    Requirements to filter: work experience and knowledge in Java with SpringBoot.

                    Rules:
                    - If a field does not appear in the CV, use null.
                    - The output must be strictly an array of JSON objects, valid to be parsed.
                    - Include ALL fields even if they are null.
                    - In "status" write "Approved" only if the profile meets the vacancy requirements, otherwise "Not Approved".

                    Output formatting rules (MUST follow strictly):
                    - The response must be ONLY valid JSON, inside an array.
                    - Do NOT concatenate strings with +.
                    - Do NOT insert "\n" or escape characters unless they literally appear in the CV text.
                    - Strings must be plain text inside quotes, on one line if possible.
                    - Do NOT add comments, explanations, or extra text outside the JSON.

                    These are the CVs to process:
                    ${textCv}
                    `;

            const result = await model.generateContent(prompt);

            let rawText = result.response.text();

            //  Quitar bloque de código ```json ... ```
            rawText = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

            let parsed = [];
            parsed = JSON.parse(rawText);

            for (const candidate of parsed) {
                await cvModel.createCandidate(candidate);
            }

            return res.status(200).json({ message: 'Candidates saved successfully', parsed });
              
        } catch (error) {
            console.error('Error in controller:', error);
            return res.status(500).json({ error: 'Error processing a cv' });
        }
    });
};
