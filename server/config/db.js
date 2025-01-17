const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const pool = mysql.createPool(dbConfig);

async function checkConnection() {
    try {
        await pool.query('SELECT 1');
        console.log('Подключение к базе данных установлено.');
        return true;
    } catch (error) {
        console.error('Ошибка при подключении к базе данных:', error);
        return false;
    }
}

module.exports = { pool, checkConnection };
