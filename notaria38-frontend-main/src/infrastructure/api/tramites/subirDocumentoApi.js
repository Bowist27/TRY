import { baseURL } from '../apiConfig';
import fetchRetry from 'fetch-retry';

const fetch = fetchRetry(window.fetch);

/**
 * Sube un documento al servidor.
 * @param {*} param0 - Objeto con los parámetros necesarios para subir un documento.
 * @param {File} param0.file - El archivo que se desea subir.
 * @param {string} param0.userEmail - El correo electrónico del usuario.
 * @param {string} param0.idDocRequerido - El ID del documento requerido.
 * @param {string} param0.idExpediente - El ID del expediente del documento.
 * @returns {Promise<object>} - Una promesa que resuelve con la respuesta del servidor.
 */
export async function subirDocumento({ file, userEmail, idDocRequerido, idExpediente }) {
    const endpoint = `${baseURL}/api/documentos/crear`;
    const headers = {
        'x-user-email': userEmail,
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('idDocRequerido', idDocRequerido);
    formData.append('idExpediente', idExpediente);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        retries: 3,
        /**
         * Función para definir el tiempo de espera entre reintentos.
         * @returns {number} - Tiempo de espera en milisegundos.
         */
        retryDelay: () => 2000,
        body: formData,
    });

    const data = await response.json();

    if (response.status === 400) {
        throw new Error('El archivo excede el límite de tamaño permitido (5 MB).');
    }

    if (response.status === 404) {
        throw new Error(
            'Documento no encontrado. Refresque la página e intente nuevamente.'
        );
    }

    if (response.status === 500) {
        throw new Error(
            data.message || 'Error al intentar subir el documento. Intente más tarde.'
        );
    }

    return data;
}
