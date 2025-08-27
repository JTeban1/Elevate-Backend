import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "candidates";

// Get all candidates
export function getCandidates() {
    return fetchData(ENDPOINT);
}

// Create new candidate
export function createCandidate(candidate) {
    return createData(ENDPOINT, candidate);
}

// Update existing candidate
export function updateCandidate(id, candidate) {
    return updateData(ENDPOINT, id, candidate);
}

// Delete candidate by ID
export function deleteCandidate(id) {
    return deleteData(ENDPOINT, id);
}