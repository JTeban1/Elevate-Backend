import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config();

/**
 * Sequelize instance configured for MySQL database connection.
 * 
 * This instance connects to a MySQL database using environment variables for configuration.
 * SSL is enabled with unauthorized certificates allowed for compatibility with cloud database services.
 * SQL query logging is disabled for cleaner console output.
 * 
 * @type {Sequelize}
 * @description Database connection instance using the following environment variables:
 * - MYSQL_ADDON_DB: Database name
 * - MYSQL_ADDON_USER: Database username
 * - MYSQL_ADDON_PASSWORD: Database password
 * - MYSQL_ADDON_HOST: Database host address
 * - MYSQL_ADDON_PORT: Database port number
 * 
 * @example
 * // Test the connection
 * await sequelize.authenticate();
 * console.log('Connection has been established successfully.');
 */
const sequelize = new Sequelize(process.env.MYSQL_ADDON_DB, process.env.MYSQL_ADDON_USER, process.env.MYSQL_ADDON_PASSWORD, {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: 'mysql',
    logging: false, // Disable SQL query logging
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected successfully (Sequelize)');
    })
    .catch(error => {
        console.error('❌ Database connection error:', error.message);
    });

export default sequelize;
