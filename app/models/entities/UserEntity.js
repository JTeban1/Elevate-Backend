import { DataTypes } from "sequelize";
import sequelize from "../../../config/db_conn.js";

/**
 * User entity model representing a user in the system.
 * 
 * @typedef {Object} User
 * @property {number} user_id - Auto-incrementing primary key for the user
 * @property {string} name - User's full name (max 150 characters)
 * @property {string} email - User's unique email address (max 255 characters)
 * @property {string} password - User's encrypted password (max 255 characters)
 * @property {number} role_id - Foreign key reference to the user's role
 * 
 * @description Sequelize model for the 'users' table with timestamps disabled.
 * The email field has a unique constraint to prevent duplicate registrations.
 */
const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "users",
    timestamps: false
});

export default User;
