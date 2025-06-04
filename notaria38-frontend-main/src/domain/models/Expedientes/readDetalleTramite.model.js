import { formatFecha } from '../expedientes/expedientesModel';
/**
 * Mapea un solo documento del expediente.
 * 
 * @param {object} rawDocument - Documento con datos crudos.
 * @returns {object} - Documento mapeado.
 */
function mapDocumento(rawDocument) {
    return {
        reqDocId: rawDocument.ID_DocumentoRequerido,
        type: rawDocument.Tipo_req,
        documentId: rawDocument.ID_Documento,
        fileName: rawDocument.Nombre_pdf_doc,
        expiration: rawDocument.Caducidad,
        url: rawDocument.URL,
        status: rawDocument.Aceptado
    };
}


/**
 * Mapea el arreglo de expedientes.
 * 
 * @param {Array} rawExpediente
 * @returns {Array}
 */
export function mapExpediente(rawExpediente) {
    return rawExpediente.map(mapDocumento);
}


/**
 * Mapea los comentarios de documentos.
 * 
 * @param {Object} rawComentariosWrapper
 * @returns {Array}
 */
export function mapComentarios(rawComentariosWrapper) {
    if (!Array.isArray(rawComentariosWrapper.comentarios)) {
        return [];
    }

    return rawComentariosWrapper.comentarios.map(comment => ({
        commentId: comment.ID_Sube,
        documentId: comment.ID_Documento,
        autor: comment.Nombre,
        comment: comment.Comentario,
        date: formatFecha(comment.Fecha),
    }));

}
