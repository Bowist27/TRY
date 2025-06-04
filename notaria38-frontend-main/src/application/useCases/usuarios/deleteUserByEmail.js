import { deleteUser } from '../../../infrastructure/api/usuarios/deleteUserApi';

/**
 * Caso de uso para eliminar un usuario.
 *
 * @param {string} email - Correo del usuario a eliminar.
 * @param {string} executorEmail - Correo del usuario que ejecuta la acción.
 */
export async function deleteUserByEmail(email, executorEmail) {
    try {
        await deleteUser(email, executorEmail);
    } catch (error) {
        throw new Error(error.message);
    }
}
