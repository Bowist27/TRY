const API_BASE = import.meta.env.DEV
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL;

if (!API_BASE) {
    throw new Error('VITE_API_URL o VITE_API_URL_DEV no definida');
}

export const baseURL = API_BASE.trim().replace(/\$/, '');

/**
 * Función para manejar el tiempo de espera entre reintentos de conexión.
 * @returns {number} - Tiempo de espera en milisegundos para reintentar la conexión.
 */
export const retryDelay = () => 2000;