import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook que permite acceder al contexto de autenticación y sus funciones.
 * @returns {object} Funciones de autenticación y estado del usuario.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
    }
    return context;
}
