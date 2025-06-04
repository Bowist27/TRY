import { baseURL } from '../apiConfig.js';
import fetchRetry from 'fetch-retry';

// Usamos el fetch del navegador con reintentos configurados
const fetch = fetchRetry(window.fetch);

/**
 * Obtiene la lista de trámites desde la API.
 * 
 * @param {string} email - Correo electrónico del usuario autenticado.
 * @returns {Promise<Array>} Trámites disponibles.
 * @throws {Error} Si no se puede obtener la lista de trámites.
 */
export async function fetchAllExpedientes(email) {
    const endpoint = `${baseURL}/api/expedientes`;

    if(!email) {throw new Error('Usuario no autenticado');}

    const res = await fetch(endpoint, {
        method: 'GET',
        retries: 3,
        retryDelay: () => 2000,
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': email,
        },
    });
    if (!res.ok) {
        throw new Error('No se pudieron obtener los expedientes. Intente más tarde.');
    }
    const expedientes = await res.json();
    return expedientes;
}