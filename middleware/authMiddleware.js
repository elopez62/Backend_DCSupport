const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // ¡Usar la variable de entorno!
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = user; // Guardar la información del usuario en req.user
        next(); // Continuar con la siguiente middleware o ruta
    });
};

module.exports = authenticateToken;