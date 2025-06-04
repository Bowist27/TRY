import { useState } from 'react';
import {
    registerUser,
    registerUserWithGoogle,
} from '../../application/useCases/RegistrarUsuarios';

/**
 * Hook para gestionar el registro de usuarios con email/contraseña o Google.
 *
 * @function useRegister
 * @returns {{
 *   register: (email: string, password: string) => Promise<any>;
 *   registerGoogle: (idToken: string) => Promise<any>;
 *   error: string|null;
 * }} Objeto con funciones de registro y estado de error.
 */
export const useRegister = () => {
    const [error, setError] = useState(null);

    /**
     * Registra un usuario con email y contraseña.
     *
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<any>} Resultado del registro.
     * @throws Error si ocurre un problema en el registro.
     */
    const register = async (email, password) => {
        try {
            const response = await registerUser(email, password);
            return response;
        } catch (error_) {
        console.error('ERROR DETECTADO EN useRegister:', error_);
        
        if (error_.status === 409) {
            setError(
            'Este correo ya fue registrado. Por favor, intenta iniciar sesión.'
            );
        } else {
            setError('Ocurrió un error durante el registro.');
        }

        throw error_;
        }
    };

    /**
     * Registra un usuario usando autenticación con Google.
     *
     * @param {string} idToken - Token de identidad de Google.
     * @returns {Promise<any>} Resultado del registro.
     * @throws Error si ocurre un problema en el registro con Google.
     */
    const registerGoogle = async (idToken) => {
        try {
            const response = await registerUserWithGoogle(idToken);
            return response;
        } catch (error_) {
        if (error_.status === 409) {
            setError(
            'Este correo ya está registrado. Inicia sesión en lugar de crear otra cuenta.'
            );
        } else {
            setError('Error al registrar con Google.');
        }

        throw error_;
        }
    };

    return {
        register,
        registerGoogle,
        error,
    };
};
