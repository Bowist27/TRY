import { subirDocumento as apiSubirDocumento } from '../../../infrastructure/api/tramites/subirDocumentoApi';

/**
 * Sube un documento al servidor.
 * @param {*} param0 - Objeto con los parámetros necesarios.
 * @param {File} param0.file - El archivo que se desea subir.
 * @param {string} param0.emailUsuario - El correo electrónico del usuario.
 * @param {string} param0.idDocRequerido - El ID del documento requerido.
 * @param {string} param0.idExpediente - El ID del expediente del documento.
 * @returns {Promise<object>} - Una promesa que resuelve con la respuesta del servidor.
 */
export const subirDocumentoUseCase = async ({
    file,
    emailUsuario,
    idDocRequerido,
    idExpediente,
}) => {
    if (!file || !emailUsuario || !idDocRequerido || !idExpediente) {
        throw new Error('Faltan parámetros necesarios para subir el documento');
    }

    return await apiSubirDocumento({
        file,
        userEmail: emailUsuario,
        idDocRequerido,
        idExpediente,
    });
};
