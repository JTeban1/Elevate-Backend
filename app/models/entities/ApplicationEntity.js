import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';
import Candidate from './CandidateEntity.js';
import Vacancy from './VacanciesEntity.js';

const Application = sequelize.define('Application', {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  application_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('pending', 'interview', 'offered', 'accepted', 'rejected'),
    defaultValue: 'rejected',
  },
  ai_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Candidate,
      key: 'candidate_id',
    },
    onDelete: 'SET NULL',
  },
  vacancy_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Vacancy,
      key: 'vacancy_id',
    },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'applications',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['candidate_id', 'vacancy_id'],
    },
  ],
});

// Relaciones
Application.belongsTo(Candidate, { foreignKey: 'candidate_id' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancy_id' });

Candidate.hasMany(Application, { foreignKey: 'candidate_id' });
Vacancy.hasMany(Application, { foreignKey: 'vacancy_id' });



export default Application;
