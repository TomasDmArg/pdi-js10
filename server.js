/**
 * @file Servidor Express para una aplicación de juego de palabras
 * @author TomasDmArg
 * @description Este archivo configura un servidor Express con rutas para obtener palabras aleatorias,
 * registrar usuarios y guardar puntuaciones. Utiliza Supabase como base de datos.
 */

import path from 'path';
import cors from 'cors';
import express, { json } from 'express';
import { getRandomWord } from './utils/random.js';
import { createClient } from '@supabase/supabase-js';

/**
 * @type {express.Application}
 * @description Instancia principal de la aplicación Express
 */
const app = express();
app.use(cors());
app.use(json());

/**
 * @type {import('@supabase/supabase-js').SupabaseClient}
 * @description Cliente de Supabase para interactuar con la base de datos
 */
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Configuración de archivos estáticos
app.use(express.static('public'));
app.use('/css', express.static(path.join(process.cwd(), 'public/css')));
app.use('/js', express.static(path.join(process.cwd(), 'public/js')));
app.use('/js/constants', express.static(path.join(process.cwd(), 'public/js/constants')));

/**
 * @route GET /
 * @description Sirve la página principal de la aplicación
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

/**
 * @route GET /api/word
 * @description Obtiene una palabra aleatoria
 * @returns {Object} Objeto JSON con la palabra aleatoria
 */
app.get('/api/word', (req, res) => {
    const word = getRandomWord();
    res.json({ word });
});

/**
 * @route POST /api/register
 * @description Registra un nuevo usuario en Supabase
 * @param {Object} req.body - Datos del usuario a registrar
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {string} req.body.username - Nombre de usuario
 * @returns {Object} Mensaje de éxito o error
 */
app.post('/api/register', async (req, res) => {
    const { email, password, username } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    const { data: userInsertData, error: userInsertDataError } = await supabase
        .from('users')
        .insert([{ id: data.user.id, username: username }]);

    if (userInsertDataError) {
        return res.status(500).json({ error: 'Error al registrar usuario' });
    }

    res.json({ message: 'Registro exitoso. Por favor, verifica tu email.' });
});

/**
 * @route POST /api/score
 * @description Guarda la puntuación de un usuario autenticado
 * @param {Object} req.body - Datos de la puntuación
 * @param {number} req.body.puntos - Puntos obtenidos
 * @param {number} req.body.tiempo - Tiempo empleado
 * @param {string} req.headers.authorization - Token de autenticación del usuario
 * @returns {Object} Mensaje de éxito o error
 */
app.post('/api/score', async (req, res) => {
    const { puntos, tiempo } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No se proporcionó token de autenticación' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    const { data, error: insertError } = await supabase
        .from('score')
        .insert([{ username: user?.identities?.[0]?.identity_data.username, puntos, tiempo }]);

    if (insertError) {
        return res.status(500).json({ error: 'Error al guardar la puntuación' });
    }

    res.json({ message: 'Puntuación guardada con éxito' });
});

/**
 * @description Inicia el servidor en el puerto 3000
 */
app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
});

export default app;