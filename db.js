const { Pool } = require('pg');
const dbConfig = require('./db.config');

const pool = new Pool(dbConfig);

// Function to test the database connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Conexión a la base de datos exitosa!');
        client.release(); // Release the client back to the pool
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err; // Re-throw the error to halt execution if needed
    }
};

// Immediately test the connection when this module is loaded
testConnection().catch(err => {
    console.error('La aplicación no se puede iniciar debido a un error de conexión a la base de datos.');
    process.exit(1); // Exit the application if the connection fails
});


const query = async (text, params) => {
    try {
        const result = await pool.query(text, params);
        return result.rows;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
};

module.exports = { query };