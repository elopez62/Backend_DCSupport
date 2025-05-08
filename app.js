const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:4200',  // Ejemplo: Dominio de tu aplicación Angular (en desarrollo)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Permitir todas las peticiones (¡Configurar adecuadamente en producción!)
app.use(express.json()); // Para parsear el body de las peticiones como JSON

// Rutas
app.use('/api/auth', authRoutes);

// Manejo de Errores (Ejemplo básico)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});