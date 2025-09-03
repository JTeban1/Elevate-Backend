/**
 * @file Controller for uploading and processing CVs in PDF, extracting structured data using OpenAI, and storing it in the database.
 * @module controllers/UploadCandidate
 */
import multer from "multer";
import pdf from "pdf-extraction";
import OpenAI from "openai";

/**
 * Multer middleware to handle uploading up to 50 PDF files in memory.
 * The expected field is "cv[]".
 * @type {import('multer').Instance}
 */
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).array("cv[]", 50);

/**
 * OpenAI instance for chat/completions API calls.
 * @type {OpenAI}
 */
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

/**
 * Cleans the extracted text from a PDF by removing unnecessary spaces and characters.
 * @param {string} text - Text extracted from the PDF.
 * @returns {string} Clean and normalized text.
 */
function cleanText(text) {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/•|·/g, "-")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/**
 * Extracts and cleans the text from a PDF file buffer.
 * @param {Buffer} buffer - Buffer of the PDF file.
 * @returns {Promise<string>} Clean text extracted from the PDF.
 */
async function extractTextFromPdf(buffer) {
  const data = await pdf(buffer);
  return cleanText(data.text);
}

/**
 * Generates the prompt for OpenAI with instructions and the CVs to process.
 * @param {string[]} cvs - Array of cleaned CV texts.
 * @param {string} vacancy - Vacancy title.
 * @param {string} filters - Vacancy filters or requirements.
 * @returns {string} Prompt ready to send to OpenAI.
 */
function createPrompt(cvs, vacancy, filters) {
  return `
      You are an assistant that extracts structured data from resumes.  
      Each CV is separated by ---CV---.  

      Return ONLY a valid JSON array of objects, no text outside JSON.  

      Schema for each candidate:
      {
        "name": "Full name (e.g., Juan David Barrera Fernandez)",
        "email": "Email address",
        "date_of_birth": "YYYY-MM-DD or empty if unknown",
        "phone": "Phone number",
        "occupation": "Current or main profession",
        "summary": "large professional summary",
        "experience": [
          { "company": "", "position": "", "description": "", "years": YYYY-YYYY }
        ],
        "skills": ["Skill1", "Skill2"],
        "languages": [{ "language": "", "level": "" }],
        "education": [{ "degree": "", "institution": "", "years": "YYYY-YYYY" }],
        "references": [{ "name": "", "occupation": "", "phone": "" }],
        "general_experience": 0,
        "status": "accepted | rejected",
        "ai_reason": "Reason why accepted or rejected"
      }

      Rules:
      - Always return an array, even if there is only one CV.
      - If years of experience are not explicit, estimate based on text.
      - general_experience = sum of all experience.years.
      - status = "accepted" if the candidate meets vacancy requirements (${vacancy}) and has knowledge in ${filters}, else "rejected".
      - ai_reason must justify the status clearly in 1–2 sentences.

      Schema for each candidate (example below) don't use this data, it's just an example: 
        [
          {
            "name": "Juan Guillermo Barrera Fernandez",
            "email": "juan.barrera@gmail.com",
            "date_of_birth": "1990-05-14",
            "phone": "+57 3001234567",
            "occupation": "Software Engineer",
            "summary": "Software engineer with 8+ years of experience in full-stack web development...",
            "experience": [
              { "company": "Tech Solutions", "position": "Backend Developer", "description": "Developed APIs with Node.js", "years": "2015-2018" },
              { "company": "GlobalSoft", "position": "Senior Engineer", "description": "Led a team of 5 developers", "years": "2018-2023" }
            ],
            "skills": ["Node.js", "React", "SQL", "AWS"],
            "languages": [{ "language": "Spanish", "level": "Native" }, { "language": "English", "level": "Advanced" }],
            "education": [{ "degree": "BSc Computer Science", "institution": "Universidad de Medellín", "years": "2008-2012" }],
            "references": [{ "name": "Carlos Perez", "occupation": "CTO", "phone": "+57 3109876543" }],
            "general_experience": 8,
            "status": "accepted",
            "ai_reason": "The candidate has over 8 years of experience in full-stack development and matches the vacancy requirements."
          }
        ]


      CVs:
      ${cvs.map((cv) => `---CV---\n${cv}`).join("\n")}
`;
}

// Helper to split into batches
/**
 * Splits an array into sub-arrays (batches) of a given maximum size.
 * @param {Array} array - Array to split.
 * @param {number} size - Maximum size of each batch.
 * @returns {Array[]} Array of batches.
 */
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * Main controller to process the upload of CVs in PDF, extract structured information using OpenAI, and register candidates and applications in the database.
 *
 * @async
 * @function processUploadedCVsController
 * @param {import('express').Request} req - HTTP request object, expects PDF files and vacancy data in the body.
 * @param {import('express').Response} res - HTTP response object.
 * @returns {Promise<void>} Responds with success or error JSON.
 */
export const processUploadedCVsController = async (req, res) => {
  try {
    const files = req.files;
    const vacancy = req.body.vacancyTitle;
    const filters = req.body.vacancy_filter;
    const vacancyId = req.body.vacancy_id;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files were received." });
    }

  // 1. Extract text from all PDFs
    const cvsText = [];
    for (const file of files) {
      const text = await extractTextFromPdf(file.buffer);
      cvsText.push(text);
    }

  // 2. Process in batches of 5
    const chunks = chunkArray(cvsText, 5);
    let allCandidates = [];

    for (const chunk of chunks) {
      const prompt = createPrompt(chunk, vacancy, filters);

      const result = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 5000,
        temperature: 0,
      });

      let parsedResponse = JSON.parse(result.choices[0].message.content);

  // Normalize if GPT returns { candidates: [...] }
      if (parsedResponse.candidates) {
        parsedResponse = parsedResponse.candidates;
      }

      const candidates = Array.isArray(parsedResponse)
        ? parsedResponse
        : [parsedResponse];

      allCandidates = allCandidates.concat(candidates);
    }

  // 3. Filter out empty candidates (without name or email)
    const validCandidates = allCandidates.filter((c) => c && c.name);

  // 4. Save to the DB
    const Candidate = (await import("../models/entities/CandidateEntity.js"))
      .default;
    const { createCandidate } = await import(
      "../models/services/CandidateServices.js"
    );
    const { createApplication } = await import(
      "../models/services/ApplicationServices.js"
    );
    const Application = (
      await import("../models/entities/ApplicationEntity.js")
    ).default;

    const created = [];

    for (const candidateData of validCandidates) {
      const candidateId = await createCandidate({
        name: candidateData.name,
        email: candidateData.email,
        phone: candidateData.phone_number || candidateData.phone || "",
        date_of_birth: candidateData.date_of_birth,
        occupation: candidateData.occupation,
        summary: candidateData.summary,
        experience: candidateData.experience || null,
        skills: candidateData.skills || null,
        languages: candidateData.languages || null,
        education: candidateData.education || null,
      });

      const candidate = await Candidate.findByPk(candidateId);

      let application;
      try {
        application = await createApplication({
          candidate_id: candidate.candidate_id,
          vacancy_id: vacancyId,
          status: candidateData.status?.toLowerCase() || "pending",
          ai_reason: candidateData.ai_reason || "",
        });
      } catch (err) {
        application = await Application.findOne({
          where: {
            candidate_id: candidate.candidate_id,
            vacancy_id: vacancyId,
          },
        });
      }

  // Avoid duplicates in the response array
      if (
        !created.find(
          (c) =>
            c.candidate.email === candidate.email &&
            c.application.vacancy_id === vacancyId
        )
      ) {
        created.push({ candidate, application });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Cvs processed in chunks and registered in the database",
      data: created,
    });
  } catch (error) {
    console.error("Error processing cvs:", error);
    return res.status(500).json({ error: "Error processing cvs" });
  }
};
