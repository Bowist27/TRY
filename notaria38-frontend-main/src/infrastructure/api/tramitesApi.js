import { baseURL } from './apiConfig.js';
import fetchRetry from 'fetch-retry';

// Usamos el fetch del navegador con reintentos configurados
const fetch = fetchRetry(window.fetch);

/**
 * Obtiene la lista de trámites desde la API.
 * @returns {Promise<Array>} Trámites disponibles
 */
export async function fetchTramites() {
    const endpoint = `${baseURL}/api/tramites`;

    const headers = { 'Content-Type': 'application/json' };

    const res = await fetch(endpoint, {
        method: 'GET',
        headers,
        retries: 3,
        retryDelay: () => 2000,
        retryOn: [429, 500, 502, 503, 504],
    });
    if (res.status === 500) {
        throw new Error('No se pudieron obtener los trámites. Intente más tarde.');
    }
    if (!res.ok) {throw new Error('Error de conexión');}

    const data = await res.json();
    return Array.isArray(data.tramites) ? data.tramites : [];
}

/**
 * Obtiene el detalle de un trámite por su ID.
 * @param {number} id - ID del trámite
 * @returns {Promise<Object>} Detalle del trámite
 */
export async function fetchTramiteDetalle(id) {
    let baseURL = import.meta.env.VITE_API_URL?.trim();
    if (!baseURL) {throw new Error('VITE_API_URL no definida');}

    baseURL = baseURL.replace(/\/$/, '');
    const endpoint = `${baseURL}/api/tramitedetalle/${id}`;

    const headers = { 'Content-Type': 'application/json' };

    const res = await fetch(endpoint, {
        method: 'GET',
        headers,
        retries: 3,
        retryDelay: () => 2000,
        retryOn: [429, 500, 502, 503, 504],
    });
    if (res.status === 500) {
        throw new Error('No se pudo cargar el detalle. Intente más tarde.');
    }
    if (!res.ok) {throw new Error('Error de conexión');}

    const data = await res.json();
    const detalle = data.tramite;

    return detalle;
}

export async function iniciarExpediente(nombreTramite, email) {
    let baseURL = import.meta.env.VITE_API_URL?.trim();
    if (!baseURL) {throw new Error('VITE_API_URL no definida');}

    baseURL = baseURL.replace(/\/$/, '');
    const endpoint = `${baseURL}/api/tramites/iniciar-expediente`;

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreTramite, email }),
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message || 'Error al iniciar expediente');
        error.status = res.status;
        throw error;
    }

    return { data, status: res.status }; 
}
