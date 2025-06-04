import { eliminarDocumento as apiEliminarDocumento } from '../../../infrastructure/api/tramites/eliminarDocumentoApi';

/**
 * Elimina un documento.
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} idDocumento - El ID del documento a eliminar.
 * @param {string} url - La URL de la API para eliminar el documento.
 * @param {string} expedienteId - El ID del expediente al que pertenece el documento.
 * @returns {Promise<object>} - Una promesa que resuelve con la respuesta del servidor.
 */
export async function eliminarDocumento(email, idDocumento, url, expedienteId) {
    if (!email || !idDocumento || !url) {
        throw new Error('Faltan datos obligatorios para eliminar el documento');
    }

    return apiEliminarDocumento(email, idDocumento, url, expedienteId);
}
