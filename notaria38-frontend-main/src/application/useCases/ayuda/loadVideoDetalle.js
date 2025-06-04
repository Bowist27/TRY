import { fetchVideoById } from '../../../infrastructure/api/Ayuda/readVideosApi';
import { toVideoAyudaDetailModel } from '../../../domain/models/ayuda/readVideosModel';

/**
 * Caso de uso para obtener los detalles de un video.
 * @param {string} videoId - ID del video
 * @returns {Promise<object>} Detalles del video
 */
export const loadVideoDetails = async (videoId) => {
    try {
        const apiList = await fetchVideoById(videoId);
        return toVideoAyudaDetailModel(apiList);
    } catch {
        throw new Error('Error al cargar la lista de videos ');
    }
};