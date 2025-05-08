require('dotenv').config(); // Asegúrate de cargar las variables de entorno al principio
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        // 1. Buscar al Usuario por Email
        const user = await db.query('SELECT * FROM public.usuarios WHERE email = $1', [email]);

        if (user.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Verificar la Contraseña
        const validPassword = await bcrypt.compare(contrasena, user[0].contrasena);

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Generar el JWT
        const token = jwt.sign(
            { userId: user[0].usuario_id, rolId: user[0].rol_id }, // Este es el payload
            process.env.JWT_SECRET, // ¡Usar la variable de entorno!
            { expiresIn: '1h' }  // Tiempo de expiración del token
        );

        // 4. Enviar la Respuesta
        res.json({
            token,
            userId: user[0].usuario_id,
            nombre: user[0].nombre,
            rolId: user[0].rol_id // Enviar solo la información necesaria
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

const register = async (req, res) => {
    const { nombre, email, password, rol_id } = req.body;

    try {
        // 1. Validar los datos de entrada (¡IMPORTANTE!)
        if (!nombre || !email || !password || !rol_id) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // 2. Verificar si el usuario ya existe (por email)
        const existingUser = await db.query('SELECT * FROM public.usuarios WHERE email = $1', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'El email ya está registrado' }); // 409 Conflict
        }

        // 3. Hashear la contraseña (¡CRUCIAL!)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Insertar el nuevo usuario en la base de datos
        const newUser = await db.query(
            'INSERT INTO public.usuarios (nombre, email, contrasena, rol_id) VALUES ($1, $2, $3, $4) RETURNING usuario_id, nombre, email, rol_id',
            [nombre, email, hashedPassword, rol_id]
        );

        // 5. Enviar la respuesta
        res.status(201).json({ // 201 Created
            message: 'Usuario registrado exitosamente',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

module.exports = { login, register };