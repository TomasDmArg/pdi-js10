//Servidor en Express para el juego de ahorcado de lenguages de programación.

import path from 'path';
import cors from 'cors';
import express, { json } from 'express';
import { getRandomWord } from './utils/random';

//Configuraciones básicas del server
const app = express();
const port = 3000;
app.use(cors());
app.use(json());

//Configuración de archivos estáticos
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/js/constants', express.static(path.join(__dirname, 'public/js/constants')));

/**
 * @route GET /api/word
 * @description Obtiene una palabra aleatoria para el juego.
 * @returns {object} Objeto JSON conteniendo la palabra aleatoria.
 */
app.get('/api/word', (req, res) => {
    const word = getRandomWord();
    res.json({ word });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Inicia el servidor Express.
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});