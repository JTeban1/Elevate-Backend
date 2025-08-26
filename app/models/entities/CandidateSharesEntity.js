import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';
import Candidate from './CandidateEntity.js';
import User from './UserEntity.js'

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
    status : {
        type : DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue : 'pending'
    },
}, {
    tableName: 'candidate_shares',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

CandidateShares.belongsTo(Candidate, { foreignkey: 'candidate_id' });
CandidateShares.belongsTo(User, { foreignkey: 'user_id' });

Candidate.hasMany(CandidateShares, { foreignKey: 'candidate_id' });
User.hasMany(CandidateShares, { foreignKey: 'user_id' });

export default CandidateShares;
