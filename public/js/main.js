import { hangmanAscii } from "./constants/stickman.js";

/**
 * Clase que representa el juego del ahorcado
 */
class HangmanGame {
    /**
     * @constructor
     */
    constructor() {
        /** @private */
        this.word = '';
        /** @private */
        this.guessedWord = [];
        /** @private */
        this.wrongGuesses = 0;
        /** @private */
        this.usedLetters = new Set();

        this.initializeElements();
        this.addEventListeners();
        this.startGame();
    }

    /**
     * Inicializa las referencias a los elementos del DOM
     * @private
     */
    initializeElements() {
        this.hangmanElement = document.getElementById('hangman');
        this.wordElement = document.getElementById('word');
        this.guessesElement = document.getElementById('guesses');
        this.messageElement = document.getElementById('message');
        this.inputElement = document.getElementById('input');
        this.guessButton = document.getElementById('guessButton');
    }

    /**
     * Añade event listeners a los elementos interactivos
     * @private
     */
    addEventListeners() {
        this.guessButton.addEventListener('click', () => this.guessLetter());
    }

    /**
     * Inicia un nuevo juego obteniendo una nueva palabra del servidor
     * @async
     */
    async startGame() {
        try {
            const response = await fetch('/api/word');
            const data = await response.json();
            this.word = data.word.toUpperCase();
            this.guessedWord = Array(this.word.length).fill('_');
            this.wrongGuesses = 0;
            this.usedLetters.clear();
            this.updateDisplay();
        } catch (error) {
            console.error('Error al iniciar el juego:', error);
            this.showMessage('Error al cargar la palabra. Intenta de nuevo.');
        }
    }

    /**
     * Actualiza la interfaz de usuario con el estado actual del juego
     * @private
     */
    updateDisplay() {
        this.hangmanElement.textContent = hangmanAscii[this.wrongGuesses];
        this.wordElement.textContent = this.guessedWord.join(' ');
        this.guessesElement.textContent = 'Letras usadas: ' + Array.from(this.usedLetters).join(', ');
    }

    /**
     * Muestra un mensaje temporal en la interfaz de usuario
     * @param {string} message - El mensaje a mostrar
     * @private
     */
    showMessage(message) {
        this.messageElement.textContent = message;
        setTimeout(() => {
            this.messageElement.textContent = '';
        }, 2000);
    }

    /**
     * Procesa el intento de adivinar una letra
     * @private
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

    /**
     * Verifica si el juego ha terminado (victoria o derrota)
     * @private
     */
    checkGameStatus() {
        if (this.guessedWord.join('') === this.word) {
            this.showMessage('¡Felicidades! Has ganado. La palabra era: ' + this.word);
            this.startGame();
        } else if (this.wrongGuesses === 6) {
            this.showMessage('Game Over. La palabra era: ' + this.word);
            this.startGame();
        }
    }
}

// Iniciar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => new HangmanGame());