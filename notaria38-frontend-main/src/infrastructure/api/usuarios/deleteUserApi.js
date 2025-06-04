/**
 * Módulo para operaciones relacionadas con la gestión de usuarios.
 * Contiene funciones para eliminar usuarios mediante peticiones a la API.
 */
import { baseURL } from '../apiConfig';
import fetchRetry from 'fetch-retry';

const fetch = fetchRetry(window.fetch);

/**
 * Función que retorna el retraso para reintentos en milisegundos.
 * @returns {number} Tiempo de espera en ms antes del reintento.
 */
function retryDelayFunction() {
    return 2000;
}

/**
 * Elimina un usuario por correo electrónico.
 *
 * @param {string} userToDeleteEmail - Correo del usuario a eliminar.
 * @param {string} executorEmail - Correo del usuario que realiza la eliminación.
 */
export async function deleteUser(userToDeleteEmail, executorEmail) {
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': executorEmail,
    };

    const encodedEmail = encodeURIComponent(userToDeleteEmail);

    const response = await fetch(`${baseURL}/api/usuarios/${encodedEmail}`, {
        method: 'DELETE',
        headers,
        retries: 3,
        retryDelay: retryDelayFunction,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el usuario');
    }
}
