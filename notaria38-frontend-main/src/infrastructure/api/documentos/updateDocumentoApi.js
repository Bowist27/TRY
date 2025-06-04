import { baseURL, retryDelay } from '../apiConfig';
import fetchRetry from 'fetch-retry';

// Manejo de reintentos de conexión
const fetch = fetchRetry(window.fetch);

/**
 * Función para rechazar un documento asociado a un trámite.
 * @param {*} documentId - ID del documento a rechazar.
 * @param {*} tramiteId - ID del trámite asociado.
 * @param {*} comment - Comentario del rechazo.
 * @param {*} email - Correo del usuario que rechaza.
 * @returns {Promise<object>} - Un objeto con la respuesta del servidor.
 */
export async function rejectDocumento(documentId, tramiteId, comment, email) {
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };

    const response = await fetch(
        `${baseURL}/api/expedientes/${tramiteId}/documentos/${documentId}/rechazar`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify({
                comment,
            }),
            retries: 3,
            retryDelay,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Error al rechazar el documento. Intente más tarde.'
        );
    }

    return data.message;
}

/**
 * Función para rechazar un documento asociado a un trámite.
 * @param {*} documentId - ID del documento a rechazar.
 * @param {*} tramiteId - ID del trámite asociado.
 * @param {*} email - Correo del usuario que rechaza.
 * @param {*} comment - Comentario de aceptación.
 * @returns {Promise<object>} - Un objeto con la respuesta del servidor.
 */
export async function acceptDocumento(documentId, tramiteId, email, comment) {
    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };

    const response = await fetch(
        `${baseURL}/api/expedientes/${tramiteId}/documentos/${documentId}/aceptar`,
        {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                state: 2,
                comment,
            }),
            retries: 3,
            retryDelay,
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(
            data.message || 'Error al aceptar el documento. Intente más tarde.'
        );
    }

    return data.message;
}
