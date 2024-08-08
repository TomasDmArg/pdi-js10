/**
 * @file leaderboardManager.js
 * @description Maneja la tabla de puntuaciones.
 */

/**
 * @class LeaderboardManager
 * @description Gestiona la tabla de puntuaciones.
 */
export class LeaderboardManager {
    /**
     * @constructor
     * @param {Object} supabase - Cliente de Supabase inicializado.
     */
    constructor(supabase) {
        this.supabase = supabase;
        this.leaderboardElement = document.getElementById('leaderboard');
        this.scoresTableBody = document.querySelector('#scoresTable tbody');
    }

    /**
     * @method saveScore
     * @description Guarda la puntuación del jugador.
     * @param {number} points - Puntos obtenidos.
     * @param {number} time - Tiempo empleado.
     */
    async saveScore(points, time) {
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            await fetch('/api/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + session.access_token
                },
                body: JSON.stringify({ puntos: points, tiempo: time })
            });

            console.log('Puntuación guardada con éxito');
            this.loadLeaderboard();
        }
    }

    /**
     * @method loadLeaderboard
     * @description Carga la tabla de puntuaciones.
     */
    async loadLeaderboard() {
        const { data, error } = await this.supabase
            .from('score')
            .select(`
                id,
                puntos,
                tiempo,
                username
            `)
            .order('puntos', { ascending: false });

        if (error) {
            console.error('Error al cargar la tabla de puntuaciones:', error);
        } else {
            //Keep only the row with the highest score for each user
            let formattedData = new Map();
            data.forEach(score => {
                if (!formattedData.has(score.username) || formattedData.get(score.username).puntos < score.puntos) {
                    formattedData.set(score.username, score);
                }
            });

            const newData = Array.from(formattedData.values());

            this.updateLeaderboardUI(newData);
        }
    }

    /**
     * @method updateLeaderboardUI
     * @description Actualiza la interfaz de usuario de la tabla de puntuaciones.
     * @param {Array} scores - Array de puntuaciones.
     */
    updateLeaderboardUI(scores) {
        this.scoresTableBody.innerHTML = '';
        scores.forEach((score, index) => {
            const row = this.scoresTableBody.insertRow();
            row.insertCell(0).textContent = index + 1;
            row.insertCell(1).textContent = score.username;
            row.insertCell(2).textContent = score.puntos;
            row.insertCell(3).textContent = score.tiempo.toFixed(2) + 's';
        });
        this.leaderboardElement.style.display = 'block';
    }
}