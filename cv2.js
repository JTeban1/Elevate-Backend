import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import PDF from "pdf-extraction";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    // 1. Leer el PDF y convertirlo a texto
    const dataBuffer = fs.readFileSync("cv.pdf");
    const data = await PDF(dataBuffer);
    const cv = data.text;

    // 2. Enviar prompt a Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
        `
        Eres un extractor de información de hojas de vida (CV).
        Debes leer el siguiente texto del CV y devolver únicamente la información solicitada en formato JSON.

        Campos requeridos (usa exactamente estos nombres):

        id (déjalo vacío, lo genera la BD)

        name
        email
        age
        occupation
        experience (experiencia laboral en el àrea, si es necesaria calcula.)
        skills (lista de habilidades técnicas)
        languages (lista idiomas conocidos) en caso de no decir, quiere decir que es español nativo.
        summary (resumen profesional)
        ai_reason (breve análisis de por qué este candidato podría ser apto según su perfil)
        education (lista formación académica)
        Reglas:
        Si algún campo no aparece en el CV, pon el valor como null.
        La salida debe ser estrictamente en formato JSON, sin explicaciones adicionales.
        Ejemplo de salida:
        {
            "id": "",
            "name": "Juan Pérez",
            "email": "juanperez@email.com",
            "age": 29,
            "occupation": "Ingeniero de Software",
            "experience": "5 años en desarrollo web con JavaScript y Python",
            "skills": ["JavaScript", "Python", "React", "Trabajo en equipo"],
            "languages": ["Español", "Inglés"],
            "summary": "Desarrollador con experiencia en aplicaciones web y backend.",
            "ai_reason": "Tiene experiencia en tecnologías modernas y habilidades blandas clave.",
            "education": "Ingeniería de Sistemas - Universidad Nacional",
            "status": "Aprobado"
        }
        Esto es para una vacante de Desarrollo de software, donde se requiere experiencia laboral y conocimineto en Java con SpringBoot,
        Al final debes decir si la persona pasa o no el filtro que te acabo de decir y lo pones en la llave status.
        Texto del CV:
        ${cv}`
        ;

    const result = await model.generateContent(prompt);

    console.log("Respuesta JSON:\n", result.response.text());
}

main();