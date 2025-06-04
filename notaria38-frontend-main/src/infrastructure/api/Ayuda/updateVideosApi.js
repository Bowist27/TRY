import { baseURL, retryDelay } from '../apiConfig';
import fetchRetry from 'fetch-retry';

const fetch = fetchRetry(window.fetch);

/**
 * Se comunica con la API para modificar un video existente.
 * @param {string} email - email del usuario
 * @returns {Promise<Array>} - Un array con los roles disponibles.
 * @throws {Error} - Si ocurre un error al obtener los roles.
 */
export async function fetchRoles(email) {
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };
    const response = await fetch(`${baseURL}/api/roles`, {
        method: 'GET',
        headers,
        retries: 3,
        retryDelay
    });
    if (!response.ok) {
        throw new Error('Error al obtener la lista de roles');
    }
    return response.json();
}
  
/**
 * Se comunica con la API para obtener los roles asignados a un video
 * mediante su ID.
 * @param {string} idVideo - ID del video a consultar.
 * @param {string} email - email del usuario
 * @returns {Promise<Array>} - Un array con los roles asignados al video.
 * @throws {Error} - Si ocurre un error al obtener los roles del video.
 */
export async function fetchRolesFromVideo(idVideo, email) {
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };
    const response = await fetch(`${baseURL}/api/videos-ayuda/roles/${idVideo}`, {
        method: 'GET',
        headers,
        retries: 3,
        retryDelay
    });
    if (!response.ok) {
        throw new Error('Error al obtener los roles del video');
    }
    return response.json();
}
  
/**
 * Se comunica con la API para modificar un video existente.
 * @param {object} video - Objeto que contiene la información del video a modificar.
 * @param {string} email - Email del usuario autenticado.
 * @returns {Promise<object>} - Un objeto que contiene la respuesta de éxito o error.
 * @throws {Error} - Si ocurre un error al modificar el video.
 */
export async function patchVideo(video, email) {
    const { videoId, title, url, roles } = video;
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };
    const response = await fetch(`${baseURL}/api/videos-ayuda/modificar`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ idVideo: videoId, title, url, roles  }),
        retries: 3,
        retryDelay
    });
  
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al modificar el video');
    }
  
    return response.json();
}