import { fetchVideosByRol } from '../../../infrastructure/api/Ayuda/readVideosApi';
import { toVideoAyudaListModel } from '../../../domain/models/ayuda/readVideosModel';

/**
 * Caso de uso para obtener la lista de videos para invitados.
 * @param {string} email - Correo electrónico del usuario autenticado (opcional).
 * @returns {Promise<Array>} Lista de videos adaptada al dominio
 */
export const loadVideos = async (email) => {
    try {
        const apiList = await fetchVideosByRol(email);
        return toVideoAyudaListModel(apiList);
    } catch {
        throw new Error('Error al cargar la lista de videos ');
    }
};