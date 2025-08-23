import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';

const Candidate = sequelize.define('Candidate', {
    candidate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    occupation: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    experience: {
        type: DataTypes.JSON,
        allowNull: true
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: true
    },
    languages: {
        type: DataTypes.JSON,
        allowNull: true
    },
    education: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: 'candidates',
    timestamps: false // Since the schema doesn't have created_at/updated_at
});

export default Candidate;
