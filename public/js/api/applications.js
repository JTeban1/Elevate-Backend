import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "api/applications";

// Get all applications
export function getApplications() {
    return fetchData(ENDPOINT);
}

// Create new application
export function createApplication(application) {
    return createData(ENDPOINT, application);
}

// Update existing application
export function updateApplication(id, application) {
    return updateData(ENDPOINT, id, application);
}

// Delete application by ID
export function deleteApplication(id) {
    return deleteData(ENDPOINT, id);
}