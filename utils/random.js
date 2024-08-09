/**
 * Array de posibles palabras (lenguajes de programación) para el juego del ahorcado
 * @constant {string[]}
 */
export const languages = [
    "javascript",
    "typescript",
    "php",
    "python",
    "java",
    "csharp",
    "cpp",
    "ruby",
    "swift",
    "kotlin",
    "go",
    "rust",
    "c",
    "assembly",
    "lua",
    "perl",
    "bash",
    "haskell",
    "scala",
    "erlang",
    "clojure",
    "sql",
    "r",
    "julia",
    "solidity",
    "cairo",
    "dart",
    "elixir",
    "fortran",
    "cobol",
    "pascal",
    "prolog",
    "lisp",
    "matlab",
    "objective-c",
    "groovy",
    "visualbasic",
    "delphi",
    "ada",
    "scheme",
    "forth",
    "abap",
    "ocaml",
];

/**
 * Esta es una función que retorna una palabra pseudoaleatoria de un array de palabras (en este caso un lenguage de programación).
 * @returns {string} Una palabra pseudoaleatoria de un array de palabras ya predefinido.
 */
export const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * languages.length);
    return languages[randomIndex];
}