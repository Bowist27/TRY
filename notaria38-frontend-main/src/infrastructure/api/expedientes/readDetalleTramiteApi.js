import { baseURL, retryDelay } from '../apiConfig';
import fetchRetry from 'fetch-retry';

// Manejo de reintentos de conexión
const fetch = fetchRetry(window.fetch);

/**
 * Función para obtener los detalles de un trámite por su ID.
 * 
 * @param {*} idTramite - ID del tramite a consultar.
 * @param {*} email - Correo del usuario.
 * @returns {Promise<Array>} - Un array con los detalles del tramite.
 * @throws {Error} - Si ocurre un error al obtener los detalles del tramite.
 */
export async function fetchTramiteById(idTramite, email) {
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };
    const id = idTramite;
    const response = await fetch(`${baseURL}/api/detalle-tramite/${id}`, {
        method: 'GET',
        headers,
        retries: 3,
        retryDelay
    });
    if (!response.ok) {
        throw new Error(response.status);
    }
    const data = await response.json();
    return data;
}

/**
 * Función para obtener los comentarios de un tramite por su ID.
 * 
 * @param {*} idTramite - ID del tramite a consultar.
 * @param {*} email - Correo del usuario.
 * @returns {Promise<Array>} - Un array con los comentarios del tramite.
 * @throws {Error} - Si ocurre un error al obtener los comentarios del tramite.
 */
export async function fetchComentarios(idTramite, email) {
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };
    const id = idTramite;
    const response = await fetch(`${baseURL}/api/detalle-tramite/comentarios/${id}`, {
        method: 'GET',
        headers,
        retries: 3,
        retryDelay
    });
    if (!response.ok) {
        throw new Error(response.status);
    }
    const data = await response.json();
    return data;
}