// src/infrastructure/api/permisosApi.js
import axios from 'axios';

/**
 * Obtiene los permisos del usuario que ya está autenticado (su JWT via Authorization).
 *
 * @returns {Promise<string[]>} - Resuelve con un arreglo de permisos.
 * @throws {Error} - Si VITE_API_URL no está definido o si ocurre algún error HTTP.
 */
export async function fetchPermisos() {
  let baseURL = import.meta.env.VITE_API_URL?.trim();
  if (!baseURL) {
    throw new Error('VITE_API_URL no definida');
  }
  baseURL = baseURL.replace(/\/$/, '');
  const endpoint = `${baseURL}/api/usuarios/permisos`;

  try {
    // axios ya incluirá automáticamente "Authorization: Bearer <token>" porque lo configuramos en AuthContext.
    const response = await axios.get(endpoint);
    const payload = response.data;
    if (Array.isArray(payload)) {
      return payload;
    } else if (Array.isArray(payload.permisos)) {
      return payload.permisos;
    } else {
      return [];
    }
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) {
      throw new Error('No autenticado (401)');
    }
    if (status === 403) {
      throw new Error('Sin permiso (403)');
    }
    throw new Error(`Error HTTP al obtener permisos: ${status || err.message}`);
  }
}
