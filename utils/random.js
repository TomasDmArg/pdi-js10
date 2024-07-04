import { languages } from "../constants/languages";

/**
 * Esta es una función que retorna una palabra pseudoaleatoria de un array de palabras (en este caso un lenguage de programación).
 * @returns {string} Una palabra pseudoaleatoria de un array de palabras ya predefinido.
 */
export const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * languages.length);
    return languages[randomIndex];
}