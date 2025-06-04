/**
 * Adapta los datos del formulario de video a un modelo de dominio.
 * @param {object} params - Parámetros del video
 * @param {string} params.videoId - ID del video
 * @param {string} params.title - Título del video
 * @param {string} params.url - URL del video
 * @param {Array<string>} params.roles - Roles seleccionados
 * @returns {object} Modelo adaptado
 */
export function toManualFormModel({ videoId, title, url, roles }) {
    return {
        videoId,
        title,
        url,
        roles,
    };
}