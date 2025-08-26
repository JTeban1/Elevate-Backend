import { DataTypes } from "sequelize";
import sequelize from "../../../config/db_conn";

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
