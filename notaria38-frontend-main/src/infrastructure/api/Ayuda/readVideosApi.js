import { baseURL, retryDelay } from '../apiConfig';
import fetchRetry from 'fetch-retry';
const fetch = fetchRetry(window.fetch);

/**
 * Obtiene la lista de videos desde el backend, para un usuario no autenticado.
 * 
 * @returns {Promise<Array>} - Resuelve con un arreglo de objetos de video.
 * */
export async function fetchVideosList() {
    const response = await fetch(`${baseURL}/api/videos-ayuda`, {
        method: 'GET',
        retries: 3,
        retryDelay,
    });
    if (!response.ok) {
        throw new Error('Error: No se pudo obtener la lista de videos. ' +
                        'Intente más tarde.');
    }
    return response.json();
}

/**
 * Obtiene la lista de videos desde el backend, para un usuario autenticado,
 * enviando el correo del usuario autenticado como cabecera.
 * 
 * @param {string} email - Correo electrónico del usuario autenticado.
 * @returns {Promise<Array>} - Resuelve con un arreglo de objetos de video.
 * */
export async function fetchVideosByRol(email) {
    if (!email) {
        return fetchVideosList();
    }

    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };

    const response = await fetch(`${baseURL}/api/videos-ayuda`, { 
        method: 'GET', 
        headers,
        retries: 3,
        retryDelay
    });
    if (!response.ok) {
        throw new Error('Error de conexión. Intente más tarde.');}

    return response.json();
}

/**
 * Obtiene los detalles de un video desde el backend.
 * 
 * @param {string} videoId - ID del video seleccionado.
 * @returns {Promise<object>} - Resuelve con un objeto de video.
 * */
export async function fetchVideoById(videoId) {
    const endpoint = `${baseURL}/api/videos-ayuda/${videoId}`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await fetch(endpoint, { 
        method: 'GET', 
        headers, 
        retries: 3,
        retryDelay
    });
    if (!response.ok) {
        throw new Error('Error: No se pudo obtener el video. Intente más tarde.');
    }
    return response.json();
}
