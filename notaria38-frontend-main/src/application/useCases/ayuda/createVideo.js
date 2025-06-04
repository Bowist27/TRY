import * as api from '../../../infrastructure/api/Ayuda/createVideosApi';

/**
 * Crea un nuevo video (manual).
 * @param {object} video - Objeto con los datos del video a crear.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} token - ID‐token de Firebase (Bearer).
 * @returns {Promise<object>} - Respuesta del backend.
 */
export async function executeCreateVideo(video, email, token) {
  return api.postVideo(video, email, token);
}
