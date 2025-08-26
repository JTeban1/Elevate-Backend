import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';
import Candidate from './CandidateEntity.js';
import User from './UserEntity.js'
import Application from './ApplicationEntity.js';

const CandidateShares = sequelize.define('CandidateShare', {
    share_id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    candidate_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Candidate,
            key: 'candidate_id',
        },
        onDelete: 'SET NULL',
    },
    sender_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'SET NULL',
    },
    receiver_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'user_id'
        },
        onDelete: 'SET NULL',
    },
    application_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Application,
            key: 'application_id'
        },
        onDelete: 'SET NULL',
    },
    status : {
        type : DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue : 'pending'
    },
}, {
    tableName: 'candidate_shares',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['candidate_id', 'sender_id', 'receiver_id', 'application_id']
        }
    ]
});

CandidateShares.belongsTo(Candidate, { foreignKey: 'candidate_id' });
CandidateShares.belongsTo(User, { foreignKey: 'user_id' });
CandidateShares.belongsTo(Application, { foreignKey: 'application_id' });

Candidate.hasMany(CandidateShares, { foreignKey: 'candidate_id' });
User.hasMany(CandidateShares, { foreignKey: 'user_id' });
Application.hasMany(CandidateShares, { foreignKey: 'application_id'});



export default CandidateShares;
