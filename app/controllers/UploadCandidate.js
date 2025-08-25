import multer from "multer";
import PDFParser from "pdf2json";
import { OpenAI } from "openai";

// Multer en memoria
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).array("cv[]", 200);

// Funciones de limpieza de texto
function fixBrokenWords(text) {
  return text
    .replace(/([A-Z])\s+(?=[A-Z])/g, "$1")
    .replace(/([a-z])\s+(?=[a-z])/g, "$1")
    .replace(/(\d)\s+(?=\d)/g, "$1")
    .replace(/\s*@\s*/g, "@")
    .replace(/\s*\.\s*/g, ".")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function mergeBullets(paragraphs) {
  let result = [];
  for (let line of paragraphs) {
    if (/^[-•·]/.test(line)) {
      if (result.length > 0) {
        result[result.length - 1] += "\n" + line.trim();
      } else {
        result.push(line.trim());
      }
    } else {
      result.push(line.trim());
    }
  }
  return result;
}

function extractCleanText(pdfData) {
  let paragraphs = [];

  pdfData.Pages.forEach(page => {
    const sorted = page.Texts.sort((a, b) => {
      if (Math.abs(a.y - b.y) < 0.5) return a.x - b.x;
      return a.y - b.y;
    });

    let lastY = null;
    let buffer = [];

    for (const t of sorted) {
      const text = decodeURIComponent(t.R[0].T).trim();
      if (!text) continue;

      if (lastY !== null && Math.abs(t.y - lastY) > 0.8) {
        paragraphs.push(fixBrokenWords(buffer.join(" ")));
        buffer = [];
      }

      buffer.push(text);
      lastY = t.y;
    }

    if (buffer.length) paragraphs.push(fixBrokenWords(buffer.join(" ")));
  });

  paragraphs = mergeBullets(paragraphs);

  return paragraphs
    .map(p => p.replace(/\s([,.])/g, "$1").replace(/\( /g, "(").replace(/ \)/g, ")").trim())
    .join("\n\n");
}

// Función para generar prompt para IA
function createPrompt(cvs, vacancy, filters) {
  return `
      You are an assistant that extracts information from resumes.
      Each CV is separated by ---CV---.

      You must return an array of objects in JSON.
      Return a JSON with the following structure for each candidate:
      You are an assistant that **only returns valid JSON** following the specified structure. Do not add any extra text.

      This is for a job vacancy of ${vacancy} that requires knowledge in ${filters}

      {
        "name": "",
        "email": "",
        "date_of_birth": "",
        "phone_number": "",
        "occupation": "",
        "summary": "",
        "experience": [],
        "skills": [],
        "languages": [],
        "education": [],
        "status": "",
        "ai_reason": "",
        "references": [],
        "general_experience": ""
      }

      Rules:
      name: Full name of the person
      email: Person’s email
      date_of_birth: Person’s date of birth
      phone_number: Person’s phone number
      occupation: Person’s profession
      summary: A complete summary of the person
      experience: Work experiences of the person, freelancer work also applies
      skills: Technical skills of the person according to their profession
      languages: Languages spoken by the person and their level
      education: Person’s education, starting with high school, technical, technologist, etc., and then the institution
      status: Status to determine if the person meets the job requirements; if yes, “Approved”, otherwise “Not Approved”
      ai_reason: Reason why the person is approved or not for the vacancy. If approved, explain why they would be a good addition to the company
      references: Personal references of the person with their information

      Important:
      The experience must include a field “year”, where if explicit info is not provided, you should calculate how many years the person worked at the company.
      Add up the work experiences and store the total in the key general_experience (integer number of years).


    CVs:
    ${cvs.map(cv => `---CV---\n${cv}`).join("\n")}
    `;
}

// Controller completo
export const processUploadedCVsController = async (req, res) => {
  try {
    const files = req.files;
    const vacancy = req.body.vacancy;
    const vacancyFilter = req.body.vacancy_filter;

    console.log(vacancy, vacancyFilter);

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No se enviaron archivos" });
    }

    let cvsText = [];

    for (const file of files) {
      const pdfParser = new PDFParser();

      const pdfText = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", err => reject(err.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => resolve(extractCleanText(pdfData)));
        pdfParser.parseBuffer(file.buffer);
      });

      cvsText.push(pdfText);
    }

    const prompt = createPrompt(cvsText, vacancy, vacancyFilter);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    const result = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.5,
    });


    let aiResponse = result.choices[0].message.content;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);

    } catch (err) {
      parsedResponse = aiResponse;
    }

    return res.status(200).json({ cvs: parsedResponse });

  } catch (error) {
    console.error("Error processing CVs:", error);
    return res.status(500).json({ error: "Error processing CVs" });
  }
};


