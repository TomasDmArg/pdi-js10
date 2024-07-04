# Juego del Ahorcado - Programación

## Descripción
Este proyecto es una implementación del clásico juego del ahorcado, enfocado en lenguajes de programación. Forma parte de la materia Proyecto Diseño e Implementación, 7° 4a EEST N°5.

## Características
- Interfaz gráfica simple y atractiva
- Palabras relacionadas con lenguajes de programación
- Representación visual del ahorcado utilizando ASCII art
- Seguimiento de letras usadas y aciertos

## Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- Bun (como gestor de paquetes)

## Estructura del Proyecto
```
.
├── constants/
├── node_modules/
├── public/
│   ├── css/
│   ├── js/
│   └── index.html
├── utils/
├── .gitignore
├── app.js
├── bun.lockb
├── jsconfig.json
├── package.json
└── README.md
```

## Instalación
1. Clona este repositorio:
   ```
   git clone https://github.com/TomasDmArg/pdi-js10
   ```
2. Navega al directorio del proyecto:
   ```
   cd pdi-js10
   ```
3. Instala las dependencias usando Bun:
   ```
   bun install
   ```

## Ejecución
Para iniciar el servidor de desarrollo:
```
bun run start
```
El juego estará disponible en `http://localhost:3000` (o el puerto que hayas configurado).

## Cómo Jugar
1. Abre el juego en tu navegador.
2. Se te presentará una palabra oculta relacionada con programación.
3. Intenta adivinar la palabra letra por letra.
4. Tienes 6 intentos antes de que se complete el dibujo del ahorcado.
5. ¡Adivina la palabra antes de que se complete el dibujo para ganar!