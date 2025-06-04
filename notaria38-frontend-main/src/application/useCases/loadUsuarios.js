// src/application/useCases/loadUsuarios.js
import { fetchUsuarios } from '../../infrastructure/api/usuariosApi';

/**
 * Carga desde el backend tanto la lista de usuarios como de roles.
 * @param {string} email — correo del usuario autenticado.
 * @returns {Promise<{ usuarios: Array, roles: Array }>} - 
 *   Resuelve con un objeto que contiene la lista de usuarios y roles.
 * @throws Error si no hay email o falla la petición.
 */
export async function loadUsuarios(email) {
    if (!email) {
        throw new Error('Usuario no autenticado');
    }
    // fetchUsuarios ya devuelve { usuarios: [...], roles: [...] }
    const { usuarios, roles } = await fetchUsuarios(email);
    return { usuarios, roles };
}
