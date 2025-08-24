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