import { useCallback, useState } from 'react';
import { deleteUserByEmail } from '../../../application/useCases/usuarios/deleteUserByEmail';

/**
 * Custom hook para eliminar un usuario por correo electrónico.
 *
 * Gestiona el estado de carga y error durante el proceso de eliminación.
 *
 * @returns {object} Objeto con funciones y estados para eliminar un usuario.
 * @property {function(string, string): Promise<void>} deleteUser -
 *  Función que elimina un usuario dado su correo y el correo del ejecutor.
 * @property {boolean} loading - Indica si la operación de eliminación está en progreso.
 * @property {string|null} error -
 * Mensaje de error si la eliminación falla, o null si no hay error.
 */
export function useDeleteUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Elimina un usuario por correo.
     *
     * @param {string} email - Correo del usuario a eliminar.
     * @param {string} executorEmail - Correo del usuario
     * autenticado que realiza la eliminación.
     * @returns {Promise<void>} Promise que se resuelve
     *  cuando la eliminación termina o falla.
     */
    const handleDeleteUser = useCallback(async (email, executorEmail) => {
        setLoading(true);
        setError(null);
        try {
            await deleteUserByEmail(email, executorEmail);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteUser: handleDeleteUser,
        loading,
        error,
    };
}
