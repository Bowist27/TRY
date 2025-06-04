import { subirDocumentoUseCase } from '../../../application/useCases/tramites/subirDocumento';

/**
 * Hook para subir documentos.
 * @returns {object} - Objeto con la función de subir documento y
 * estados de carga, error y éxito.
 */
export const useSubirDocumento = () => {
    /**
     * Función para subir un documento.
     *
     * @param {*} param0 - Objeto con los parámetros necesarios para subir un documento.
     * @param {File} param0.file - El archivo que se desea subir.
     * @param {string} param0.emailUsuario - El correo electrónico del usuario.
     * @param {string} param0.idDocRequerido - El ID del documento requerido.
     * @param {string} param0.idExpediente - El ID del expediente del documento.
     * @returns {Promise<object>} - Promesa que resuelve con la respuesta del servidor.
     */
    const subirDocumento = async ({ file, emailUsuario, idDocRequerido, idExpediente }) =>
        await subirDocumentoUseCase({
            file,
            emailUsuario,
            idDocRequerido,
            idExpediente,
        });

    return { subirDocumento };
};
