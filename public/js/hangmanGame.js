/**
 * @file hangmanGame.js
 * @description Contiene la clase principal del juego del ahorcado.
 */

import { hangmanAscii } from "./constants/stickman.js";
import { initSupabase } from './supabaseClient.js';
import { AuthManager } from './authManager.js';
import { LeaderboardManager } from './leaderboardManager.js';
import { MAX_ATTEMPTS, NEW_GAME_DELAY, MESSAGE_DISPLAY_TIME, WORD_API_URL } from './constants/constants.js';

/**
 * @class HangmanGame
 * @description Clase principal que maneja la lógica del juego del ahorcado.
 */
export class HangmanGame {
    /**
     * @constructor
     */
    constructor() {
        this.word = '';
        this.guessedWord = [];
        this.wrongGuesses = 0;
        this.usedLetters = new Set();
        this.startTime = null;
        this.score = 0;
        this.timerInterval = null;

        this.supabase = initSupabase();
        this.authManager = new AuthManager(this.supabase);
        this.leaderboardManager = new LeaderboardManager(this.supabase);

        this.initializeElements();
        this.addEventListeners();
        this.authManager.initializeAuth();
        this.startGame();
        this.leaderboardManager.loadLeaderboard();
    }

    /**
     * @method initializeElements
     * @description Inicializa las referencias a los elementos del DOM.
     */
    initializeElements() {
        this.hangmanElement = document.getElementById('hangman');
        this.wordElement = document.getElementById('word');
        this.guessesElement = document.getElementById('guesses');
        this.messageElement = document.getElementById('message');
        this.inputElement = document.getElementById('input');
        this.guessButton = document.getElementById('guessButton');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
    }

    /**
     * @method addEventListeners
     * @description Añade los event listeners necesarios.
     */
    addEventListeners() {
        this.guessButton.addEventListener('click', () => this.guessLetter());
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.guessLetter();
            }
        });
    }

    /**
     * @method updateScore
     * @description Actualiza el marcador en la interfaz.
     */
    updateScore() {
        this.scoreElement.textContent = `Puntuación: ${this.score}`;
    }

    /**
     * @method startTimer
     * @description Inicia el temporizador del juego.
     */
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsedTime = (Date.now() - this.startTime) / 1000;
            this.timerElement.textContent = `Tiempo: ${elapsedTime.toFixed(1)}s`;
        }, 100);
    }

    /**
     * @method stopTimer
     * @description Detiene el temporizador del juego.
     */
    stopTimer() {
        clearInterval(this.timerInterval);
    }

    /**
     * @method checkGameStatus
     * @description Verifica el estado actual del juego.
     */
    checkGameStatus() {
        if (this.guessedWord.join('') === this.word) {
            this.stopTimer();
            const time = (Date.now() - this.startTime) / 1000;
            this.score++;
            this.updateScore();
            this.showMessage(`¡Felicidades! Has ganado. La palabra era: ${this.word}. Tiempo: ${time.toFixed(2)}s`);
            this.leaderboardManager.saveScore(this.score, time);
            setTimeout(() => this.startGame(), NEW_GAME_DELAY);
        } else if (this.wrongGuesses === MAX_ATTEMPTS) {
            this.stopTimer();
            this.score = 0;
            this.updateScore();
            this.showMessage('Game Over. La palabra era: ' + this.word);
            setTimeout(() => this.startGame(), NEW_GAME_DELAY);
        }
    }

    /**
     * @method startGame
     * @description Inicia una nueva ronda del juego.
     */
    async startGame() {
        try {
            const response = await fetch(WORD_API_URL);
            const data = await response.json();
            this.word = data.word.toUpperCase();
            this.guessedWord = Array(this.word.length).fill('_');
            this.wrongGuesses = 0;
            this.usedLetters.clear();
            this.updateDisplay();
            this.startTimer();
        } catch (error) {
            console.error('Error al iniciar el juego:', error);
            this.showMessage('Error al cargar la palabra. Intenta de nuevo.');
        }
    }

    /**
     * @method updateDisplay
     * @description Actualiza la interfaz de usuario con el estado actual del juego.
     */
    updateDisplay() {
        this.hangmanElement.textContent = hangmanAscii[this.wrongGuesses];
        this.wordElement.textContent = this.guessedWord.join(' ');
        this.guessesElement.textContent = 'Letras usadas: ' + Array.from(this.usedLetters).join(', ');
        this.updateScore();
    }

    /**
     * @method showMessage
     * @description Muestra un mensaje temporal en la interfaz de usuario.
     * @param {string} message - El mensaje a mostrar.
     */
    showMessage(message) {
        this.messageElement.textContent = message;
        setTimeout(() => {
            this.messageElement.textContent = '';
        }, MESSAGE_DISPLAY_TIME);
    }

    /**
     * @method guessLetter
     * @description Procesa el intento de adivinar una letra.
     */
    guessLetter() {
        const letter = this.inputElement.value.toUpperCase();
        this.inputElement.value = '';

        if (letter.length !== 1 || !letter.match(/[A-Z]/)) {
            this.showMessage('Por favor, ingresa una sola letra.');
            return;
        }

        if (this.usedLetters.has(letter)) {
            this.showMessage('Ya has usado esta letra.');
            return;
        }

        this.usedLetters.add(letter);

        if (this.word.includes(letter)) {
            for (let i = 0; i < this.word.length; i++) {
                if (this.word[i] === letter) {
                    this.guessedWord[i] = letter;
                }
            }
        } else {
            this.wrongGuesses++;
        }

        this.updateDisplay();
        this.checkGameStatus();
    }
}