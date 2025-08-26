import * as usersModel from "../models/services/UsersServices.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Error fetching users" });
    }
};
