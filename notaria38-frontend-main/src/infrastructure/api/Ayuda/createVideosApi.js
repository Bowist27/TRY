import { baseURL, retryDelay } from '../apiConfig.js';
import fetchRetry from 'fetch-retry';

const fetch = fetchRetry(window.fetch);

/**
 * Genera los headers para la petición, incluyendo email y Bearer Token.
 * @param {string} email - Email del usuario
 * @param {string} token - ID‐token de Firebase (Bearer).
 * @returns {object} Headers con email y autorización.
 */
const headersWithAuth = (email, token) => ({
  'Content-Type': 'application/json',
  'x-user-email': email,
  'Authorization': `Bearer ${token}`,
});

const headersWithEmail = (email) => ({
  'Content-Type': 'application/json',
  'x-user-email': email,
});

/**
 * Obtiene los roles disponibles
 * @param {string} email - Email del usuario
 * @param {string} token - ID‐token de Firebase (Bearer).
 * @returns {Promise<object>} - Lista de roles disponibles
 */
export async function fetchRoles(email, token) {
  const response = await fetch(`${baseURL}/api/roles`, {
    method: 'GET',
    headers: headersWithAuth(email, token),
    retries: 3,
    retryDelay,
  });
  if (!response.ok) {
    throw new Error('No autorizado para cargar roles');
  }
  return response.json();
}

/**
 * Función para crear un nuevo video de ayuda
 * @param {*} video - Objeto que contiene los datos del video
 * @param {string} email - Email del usuario
 * @param {string} token - ID‐token de Firebase (Bearer).
 * @returns {Promise<object>} - Respuesta de la API
 */
export async function postVideo(video, email, token) {
  const { title, url, roles } = video;
  const titulo = title;
  const response = await fetch(`${baseURL}/api/videos-ayuda/crear`, {
    method: 'POST',
    headers: headersWithAuth(email, token),
    body: JSON.stringify({ titulo, url, roles }),
    retries: 3,
    retryDelay,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al crear manual');
  }
  return data;
}

/**
 * Función para obtener los videos de ayuda dependiendo del rol
 * @param {string} email - Email del usuario
 * @returns {Promise<object>} - Lista de videos de ayuda
 */
export async function fetchVideos(email) {
  const response = await fetch(`${baseURL}/api/videos-ayuda`, {
    method: 'GET',
    headers: headersWithEmail(email),
    retries: 3,
    retryDelay,
  });
  if (!response.ok) {
    throw new Error('Error al cargar videos');
  }
  return response.json();
}
