import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "roles";

export function getRoles() {
    return fetchData(ENDPOINT);
}

export function createRole(role) {
    return createData(ENDPOINT, role);
}

export function updateRole(id, role) {
    return updateData(ENDPOINT, id, role);
}

export function deleteRole(id) {
    return deleteData(ENDPOINT, id);
}