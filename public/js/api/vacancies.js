import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "vacancies";

// Get all vacancies
export function getVacancies() {
    return fetchData(ENDPOINT);
}

// Create new vacancy
export function createVacancy(vacancy) {
    return createData(ENDPOINT, vacancy);
}

// Update existing vacancy
export function updateVacancy(id, vacancy) {
    return updateData(ENDPOINT, id, vacancy);
}

// Delete vacancy by ID
export function deleteVacancy(id) {
    return deleteData(ENDPOINT, id);
}

// Get all vacancies with application count
export async function getAllVacanciesWithCount() {
    const res = await fetch(`http://localhost:9000/api/vacancies/count`);
    if (!res.ok) throw new Error(`Error fetching data: ${res.status}`);
    return res.json();
}

// Get applications for specific vacancy
export async function getApplicationsByVacancyIdController(id) {
    const res = await fetch(`http://localhost:9000/api/vacancies/${id}`);
    if (!res.ok) throw new Error(`Error fetching data: ${res.status}`);
    return res.json();
}
