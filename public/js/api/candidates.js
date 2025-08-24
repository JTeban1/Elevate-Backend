import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "candidates";

export function getCandidates() {
    return fetchData(ENDPOINT);
}

export function createCandidate(candidate) {
    return createData(ENDPOINT, candidate);
}

export function updateCandidate(id, candidate) {
    return updateData(ENDPOINT, id, candidate);
}

export function deleteCandidate(id) {
    return deleteData(ENDPOINT, id);
}