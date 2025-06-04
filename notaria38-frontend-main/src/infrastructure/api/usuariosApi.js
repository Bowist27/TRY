// src/infrastructure/api/usuariosApi.js
import fetchRetry from 'fetch-retry';
import { baseURL } from './apiConfig';

const fetch = fetchRetry(window.fetch);

/**
 * Obtiene la lista de usuarios desde el backend,
 * enviando el correo del usuario autenticado como cabecera,
 * y también el ID‐token de Firebase en el header Authorization.
 *
 * @param {string} email - Correo electrónico del usuario autenticado.
 * @param {string} token - ID‐token de Firebase (Bearer).
 * @returns {Promise<{ usuarios: any[], roles: any[] }>}
 * @throws {Error} - Si VITE_API_URL no está definido, el usuario no está autenticado 
 * o ocurre un error HTTP.
 */
export async function fetchUsuarios(email, token) {
  const endpoint = `${baseURL}/api/usuarios`;

  if (!email) {
    throw new Error('Usuario no autenticado');
  }
  if (!token) {
    throw new Error('Token de autenticación faltante');
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    retries: 3,
    retryDelay: () => 2000,
    retryOn: [429, 500, 502, 503, 504],
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': email,
      'Authorization': `Bearer ${token}`
    },
  });

  if (response.status === 401) {
    throw new Error('No autenticado (401)');
  }
  if (response.status === 403) {
    throw new Error('Sin permiso (403)');
  }
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  // La respuesta es { usuarios: [...], roles: [...] }
  const data = await response.json();
  return data;
}

/**
 * Actualiza el rol de un usuario.
 * Envía el correo del administrador autenticado y el ID‐token en Authorization.
 *
 * @param {string} email — correo del admin autenticado.
 * @param {string} token — ID‐token de Firebase (Bearer).
 * @param {number|string} userId — ID del usuario a modificar.
 * @param {number|string} newRoleId — ID del nuevo rol.
 * @returns {Promise<object>} - Resuelve con el objeto de respuesta del backend.
 */
export async function fetchActualizarRol(email, token, userId, newRoleId) {
  let base = import.meta.env.VITE_API_URL?.trim();
  if (!base) {
    throw new Error('VITE_API_URL no definida');
  }
  base = base.replace(/\/$/, '');
  const endpoint = `${base}/api/usuarios/${userId}`;

  if (!email) {
    throw new Error('Usuario no autenticado');
  }
  if (!token) {
    throw new Error('Token de autenticación faltante');
  }

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': email,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ idRol: newRoleId }),
  });

  if (response.status === 401) {
    throw new Error('No autenticado (401)');
  }
  if (response.status === 403) {
    throw new Error('Sin permiso (403)');
  }
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  return response.json();
}
