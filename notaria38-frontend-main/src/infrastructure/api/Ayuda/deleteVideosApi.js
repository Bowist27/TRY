// src/infrastructure/api/Ayuda/deleteVideosApi.js
import { baseURL, retryDelay } from '../apiConfig';
import fetchRetry from 'fetch-retry';

const fetch = fetchRetry(window.fetch);

/**
 * Función para eliminar un video de ayuda
 * @param {*} id - id del video a eliminar
 * @param {*} email - email del usuario
 * @param {string} token - ID‐token de Firebase (Bearer).
 * @returns {Promise<object>} - Respuesta de la API
 */
export async function deleteVideo(id, email, token) {
  if (!email) {
    throw new Error('Usuario no autenticado');
  }
  if (!token) {
    throw new Error('Token de autenticación faltante');
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-user-email': email,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(`${baseURL}/api/videos-ayuda/eliminar/${id}`, {
    method: 'DELETE',
    headers,
    retries: 3,
    retryDelay
  });

  if (response.status === 401) {
    throw new Error('No autenticado (401)');
  }
  if (response.status === 403) {
    throw new Error('Sin permiso (403)');
  }
  if (!response.ok) {
    throw new Error(`Error HTTP al eliminar video: ${response.status}`);
  }

  return response.json();
}
