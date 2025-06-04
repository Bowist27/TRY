import fetchRetry from 'fetch-retry';

// Usamos el fetch del navegador con reintentos configurados
const fetch = fetchRetry(window.fetch);

/**
 * Llama a la API para eliminar un documento.
 *
 * @param {string} email - Correo electrónico del usuario que realiza la solicitud.
 * @param {string} idDocumento - ID del documento a eliminar.
 * @param {string} url - URL del documento a eliminar.
 * @param {string} expedienteId - ID del expediente al que pertenece el documento.
 * @returns {Promise<boolean>} Resultado de la operación de eliminación.
 */
export async function eliminarDocumento(email, idDocumento, url, expedienteId) {
    const baseURL = import.meta.env.VITE_API_URL;

    if (!baseURL) {
        throw new Error('VITE_API_URL no definido');
    }

    const endpoint = `${baseURL}/api/documentos/eliminar`;

    const headers = {
        'Content-Type': 'application/json',
        'x-user-email': email,
    };

    const response = await fetch(endpoint, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ idDocumento, url, expedienteId }),
        /**
         * Configuración de reintentos para la solicitud.
         * @returns {number} - Tiempo de espera en milisegundos entre reintentos.
         */
        retryDelay: () => 2000,
        retryOn: [429, 500, 502, 503, 504],
    });

    if (response.status === 400 || response.status === 404) {
        throw new Error('Documento no encontrado o ya eliminado.');
    }

    if (response.status === 500) {
        throw new Error('Error al eliminar el documento. Intente nuevamente más tarde.');
    }

    const data = await response.json();
    return data;
}
