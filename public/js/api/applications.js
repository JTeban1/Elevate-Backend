import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "applications";

export function getApplications() {
    return fetchData(ENDPOINT);
}

export function createApplication(application) {
    return createData(ENDPOINT, application);
}

export function updateApplication(id, application) {
    return updateData(ENDPOINT, id, application);
}

export function deleteApplication(id) {
    return deleteData(ENDPOINT, id);
}