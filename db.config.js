require('dotenv').config(); // Cargar las variables de entorno

// db.config.js
module.exports = {
    user: process.env.DB_USER,
    host: 'localhost',         // Reemplazar con el host de tu base de datos (e.g., 'localhost')
    database: 'postgres', // Reemplazar con el nombre de tu base de datos
    password: process.env.DB_PASSWORD,
    port: 5432,             // Puerto de PostgreSQL (generalmente 5432)
};


