import { fetchData, createData, updateData, deleteData } from "./api.js";

const ENDPOINT = "users";

// Get all users
export function getUsers() {
    return fetchData(ENDPOINT);
}

// Create new user
export function createUser(user) {
    return createData(ENDPOINT, user);
}

// Update existing user
export function updateUser(id, user) {
    return updateData(ENDPOINT, id, user);
}

// Delete user by ID
export function deleteUser(id) {
    return deleteData(ENDPOINT, id);
}