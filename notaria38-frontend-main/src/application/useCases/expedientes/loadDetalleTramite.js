import {
    fetchTramiteById,
    fetchComentarios
} from  '../../../infrastructure/api/expedientes/readDetalleTramiteApi';

import {
    mapExpediente,
    mapComentarios
} from '../../../domain/models/expedientes/readDetalleTramite.model';

/**
 * Función para cargar el detalle de un tramite y los comentarios
 * asociados a sus documentos.
 * 
 * @param {int} idTramite - ID del tramite a consultar.
 * @param {string} email - Correo del usuario.
 * @returns {Promise<object>} - Un objeto con el tipo de acceso,
 * el expediente y los comentarios.
 * @throws {Error} - Si ocurre un error al cargar el detalle del tramite.
 */
export const loadDetalleTramite = async (idTramite, email) => {
    try {

        const [tramiteData, comentariosRaw] = await Promise.all([
            fetchTramiteById(idTramite, email),
            fetchComentarios(idTramite, email)
        ]);

        const { acceso, title, expediente: expedienteRaw } = tramiteData;

        const expediente = mapExpediente(expedienteRaw);
        const comentarios = mapComentarios(comentariosRaw);

        return { acceso, title, expediente, comentarios };
    } catch (error) {
        throw new Error(error.message || 'Error al cargar el detalle del trámite');
    }
};