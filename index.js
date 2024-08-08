import path from 'path';
import cors from 'cors';
import express, { json } from 'express';
import { getRandomWord } from './utils/random.js';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(express.static('public'));
app.use('/css', express.static(path.join(process.cwd(), 'public/css')));
app.use('/js', express.static(path.join(process.cwd(), 'public/js')));
app.use('/js/constants', express.static(path.join(process.cwd(), 'public/js/constants')));

app.get('/api/word', (req, res) => {
    const word = getRandomWord();
    res.json({ word });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

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

// Exporta la aplicación Express
export default app;