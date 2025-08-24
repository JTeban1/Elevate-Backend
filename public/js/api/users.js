import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "users";

export function getUsers() {
    return fetchData(ENDPOINT);
}

export function createUser(user) {
    return createData(ENDPOINT, user);
}

export function updateUser(id, user) {
    return updateData(ENDPOINT, id, user);
}

export function deleteUser(id) {
    return deleteData(ENDPOINT, id);
}