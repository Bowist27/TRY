/**
 * Modelo que adapta la lista de videos de ayuda de la API
 * a un formato adaptado al dominio.
 * 
 * @param {Array} apiList - Lista de videos de ayuda de la API.
 * @returns {Array} - Lista de videos adaptada al dominio.
 */
export function toVideoAyudaListModel(apiList) {
    return apiList.map(video => ({
        videoId: video.ID_VideoAyuda,
        title: video.Titulo,
        url: video.URL || '',
    }));
}

/**
 * Modelo que adapta un video individual con URL.
 * 
 * @param {object} apiData - Objeto de video de la API.
 * @returns {object} - Video adaptado al dominio.
 */
export function toVideoAyudaDetailModel(apiData) {
    return {
        videoId: apiData.ID_VideoAyuda,
        title: apiData.Titulo,
        url: apiData.URL,
    };
}
