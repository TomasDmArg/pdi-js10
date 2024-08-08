/**
 * @file supabaseClient.js
 * @description Inicializa y exporta el cliente de Supabase.
 */

const SUPABASE_URL = 'https://vphzzaukcfgqornxxwtq.supabase.co';
const SUPABASE_PUBLIC_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwaHp6YXVrY2ZncW9ybnh4d3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxNDkzMDYsImV4cCI6MjAzODcyNTMwNn0.K5KhWUEdEg4WtXVp-3921PVZf3_L2WKUDTVFvuA7awk';

/**
 * @function initSupabase
 * @description Inicializa y retorna el cliente de Supabase.
 * @returns {Object} Cliente de Supabase inicializado.
 */
export function initSupabase() {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
}