import multer from "multer";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import PDF from "pdf-extraction";
import * as cvModel from "../models/services/CandidateServices.js";

const storage = multer.memoryStorage();
const upload = multer({ storage }).array("cv[]", 200);

export const cvs = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al subir los archivos:", err);
      return res.status(500).json({ error: "Error al subir los archivos" });
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
      });

      dotenv.config();

      let textCv = "";
      for (const file of req.files) {
        const dataBuffer = file.buffer;
        const data = await PDF(dataBuffer);
        const cv = data.text;
        textCv += " Otra cv " + cv;
      }

      const prompt = `
        I need to extract important information from several resumes,
        which should be in JSON format, only JSON format without additional text and inside an array.
        The company is hiring for a Software Development position.
        The person must have knowledge in Java with Spring Boot.
        Required fields:
        name: Full name of the person.
        email: Email of the person.
        date_of_birth: Year of birth, if not found, leave null.
        phone_number: Phone number.
        occupation: What the person does (inferred from their experience and education).
        summary: Complete summary of the person.
        experience: Relevant work experience (freelance, academic, etc.),
        If there are explicit start and end dates (e.g., "January 2020 - December 2022"), calculate the years of experience by subtracting the start year from the end year.
        If the experience is currently ongoing (e.g., "January 2020 - present"), assume the current year (2025) and calculate the years of experience accordingly.
        If there are no explicit dates, but the duration is mentioned in text (e.g., "3 years of experience"), extract the number of years and put it in the "years" field.
        If the duration cannot be determined or is less than 1 year, set the value as 0.
        skills: Technical skills relevant to the occupation.
        languages: Languages the person speaks, if not specified, assume Spanish.
        education: Studies, relevant courses.
        status: "Approved" or "Not Approved". This depends on the job requirements.
        ai_reason: Reason for approval or non-approval. Explain in ai_reason if the candidate has knowledge in Java and Spring Boot. If not, indicate that the candidate does not meet the requirements for the Software Developer position.
        Rules to determine the status:
        Approved: If the candidate has experience or knowledge in Java and Spring Boot, it should be marked as "Approved".
        Not Approved: If the candidate does not have experience in Java or SpringBoot, they should be marked as "Not Approved". In this case, a justification should be provided in the ai_reason field explaining why the candidate does not meet the requirements.
        This is an output example:
        {
          "name": "Carlos Andrés Pérez",
          "email": "carlos.perez@email.com",
          "date_of_birth": "1990-03-15",
          "phone_number": "+57 312 248 2425",
          "occupation": "Software Engineer",
          "summary": "Experienced software engineer with strong expertise in Java, SpringBoot, and full-stack development. Skilled in building scalable applications using modern technologies.",
          "experience": [
            {
              "years": 3,
              "position": "Software Engineer",
              "company": "Tech Solutions Ltd.",
              "description": "Developing and maintaining Java-based applications using SpringBoot and Hibernate. Collaborating with front-end developers to integrate UI components."
            },
            {
              "years": 2,
              "position": "Freelance Developer",
              "company": "Freelance",
              "description": "Worked on multiple client projects, building Java-based backend solutions and integrating REST APIs with front-end systems."
            }
          ],
          "skills": ["Java", "SpringBoot", "Hibernate", "Full-stack development", "REST APIs", "Agile methodology"],
          "languages": ["Spanish", "English"],
          "education": ["B.Sc. in Computer Science - Universidad Nacional de Colombia"],
          "status": "Approved",
          "ai_reason": "This candidate has strong experience in Java and SpringBoot, making him a good fit for the Software Development role."
        } ${textCv}`;

      const result = await openai.chat.completions.create({
        model: 'gpt-4.1',  // Usar el modelo GPT-3.5 Turbo
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,  // Limitar los tokens para reducir costos
        temperature: 0.8,   // Controlar la creatividad/respuesta
      });

      let rawText = result.choices[0].message.content;

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

      console.log(parsed);
      
      return res
        .status(200)
        .json({ message: "Candidates saved successfully", parsed });
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({ error: "Error processing a cv" });
    }
  });
};


export const getAllCandidatesController = async (req, res) => {
    try {
        const allCandidates = await cvModel.getAllCandidates();
        console.log('All candidates from separate function:', allCandidates);
        return res.status(200).json(allCandidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return res.status(500).json({ error: "Error fetching candidates" });
    }
};