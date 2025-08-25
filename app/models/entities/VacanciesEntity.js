import { DataTypes } from 'sequelize';
import sequelize from '../../../config/db_conn.js';

const Vacancy = sequelize.define('Vacancy', {
    vacancy_id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    title : {
        type : DataTypes.STRING,
        allowNull :  false
    },
    description : {
        type : DataTypes.TEXT
    },
    salary : {
        type : DataTypes.DECIMAL(10,2)
    },
    status : {
        type : DataTypes.ENUM('open', 'closed', 'paused'),
        defaultValue : 'closed'
    },
    creation_date : {
        type : DataTypes.DATE
    }
}, {
    tableName: 'vacancies',
    timestamps: false
});

//For this to make sense we need applications entities!
/*Vacancie.hasMany(Application, {
    foreignKey : 'vacancy_id', //the one in applications
    sourceKey : 'vacancy_id' //the one in vacancies
});

Application.belongsTo(Vacancie, {
    foreignKey : 'vacancy_id', //the one in applications
    targetId : 'vacancy_id' //the one in vacancies
});*/

export default Vacancy;