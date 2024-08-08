/**
 * @file constants.js
 * @description Constantes utilizadas en el juego del ahorcado.
 */

/**
 * @constant
 * @description Número máximo de intentos fallidos permitidos.
 * @type {number}
 */
export const MAX_ATTEMPTS = 6;

/**
 * @constant
 * @description Tiempo de espera (en milisegundos) antes de iniciar un nuevo juego.
 * @type {number}
 */
export const NEW_GAME_DELAY = 3000;

/**
 * @constant
 * @description Tiempo de visualización (en milisegundos) para los mensajes.
 * @type {number}
 */
export const MESSAGE_DISPLAY_TIME = 10000;

/**
 * @constant
 * @description URL del API para obtener palabras.
 * @type {string}
 */
export const WORD_API_URL = '/api/word';

/**
 * @constant
 * @description URL del API para guardar puntuaciones.
 * @type {string}
 */
export const SCORE_API_URL = '/api/score';