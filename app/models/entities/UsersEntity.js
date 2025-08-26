import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';
import Role from './RolEntity.js';

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255), // hashed password
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "roles", // nombre de la tabla referenciada
      key: "role_id",
    },
    onDelete: "RESTRICT",
  },
}, {
  tableName: "users",
  timestamps: false, // o true si quieres createdAt/updatedAt
});

Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

export default User;