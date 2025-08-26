import { DataTypes } from "sequelize";
import sequelize from "../../../config/db_conn";

const Role = sequelize.define("Role", {
    role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    }
}, {
    tableName: "roles",
    timestamps: false
});

export default Role;