import { DataTypes } from "sequelize";
import sequelize from '../../../config/db_conn.js';

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: "roles",
  timestamps: false,
});

export default Role;
