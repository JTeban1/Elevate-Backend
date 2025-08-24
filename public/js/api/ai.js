import { fetchData, createData, updateData } from "./api.js";

const ENDPOINT = "api/aicv";

export function getApplications() {
    return fetchData(ENDPOINT);
}

export function createApplication(application) {
    return createData(ENDPOINT, application);
}

export function updateApplication(id, application) {
    return updateData(ENDPOINT, id, application);
}