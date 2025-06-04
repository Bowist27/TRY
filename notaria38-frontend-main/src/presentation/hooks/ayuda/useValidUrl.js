/**
 * Verifica si una URL corresponde a un video de YouTube o un archivo de Google Drive.
 *
 * @function isValidVideoURL
 * @param {string} url - URL a validar.
 * @returns {boolean} True si la URL es válida para YouTube
 * o Google Drive, false en caso contrario.
 */
export function isValidVideoURL(url) {
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.+$/i;
    const driveRegex = /^(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/.+$/i;

    return youtubeRegex.test(url) || driveRegex.test(url);
}

/**
 * Transforma una URL de YouTube en su URL para embeber en un iframe.
 * Si la URL no corresponde a YouTube, se retorna sin cambios.
 *
 * @function transformYouTubeURL
 * @param {string} url - URL de YouTube a transformar.
 * @returns {string} URL en formato embed o la URL original si no aplica.
 */
export function transformYouTubeURL(url) {
    const youtubeMatch = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
    );
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
}
