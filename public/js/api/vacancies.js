import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "api/vacancies";

export function getVacancies() {
    return fetchData(ENDPOINT);
}

export function createVacancy(vacancy) {
    return createData(ENDPOINT, vacancy);
}

export function updateVacancy(id, vacancy) {
    return updateData(ENDPOINT, id, vacancy);
}

export function deleteVacancy(id) {
    return deleteData(ENDPOINT, id);
}

export async function getAllVacanciesWithCount() {
    const res = await fetch(`http://localhost:9000/api/vacancies/count`);
    if (!res.ok) throw new Error(`Error fetching data: ${res.status}`);
    return res.json();
}

export async function getApplicationsByVacancyIdController(id) {
    const res = await fetch(`http://localhost:9000/api/vacancies/${id}`);
    if (!res.ok) throw new Error(`Error fetching data: ${res.status}`);
    return res.json();
}
