// src/application/useCases/ayuda/deleteVideo.js
import { deleteVideo } from '../../../infrastructure/api/Ayuda/deleteVideosApi';

/**
 * Caso de uso para eliminar un video.
 * @param {string} idVideo - ID del video a eliminar.
 * @param {string} email - Correo electrónico del usuario que elimina el video.
 * @param {string} token - ID‐token de Firebase (Bearer).
 * @returns {Promise<any>} - Promesa que se resuelve con la respuesta de la API.
 */
export const deleteVideoById = async (idVideo, email, token) => {
  // Simplemente delegamos a la capa de infraestructura
  return deleteVideo(idVideo, email, token);
};
