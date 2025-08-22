import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
    host: 'bo0qdeicu7wycnbnek7j-mysql.services.clever-cloud.com',
    port: '3306',
    user: 'uv2ba2yvkbzt9hjs',
    password: 'pyyLViwvxFqdqCpPInkR',
    database: 'bo0qdeicu7wycnbnek7j'
});

export default connection;