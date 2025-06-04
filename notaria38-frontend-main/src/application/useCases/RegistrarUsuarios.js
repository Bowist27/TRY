import {
    registerUser as apiRegisterUser,
    registerUserWithGoogle as apiRegisterUserWithGoogle,
} from '../../infrastructure/api/registroApi';
  
/**
 * Lógica de aplicación para registrar usuario tradicional
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>} - Respuesta del backend
 */
export const registerUser = async (email, password) =>
    apiRegisterUser(email, password);
  
/**
 * Lógica de aplicación para registrar usuario con Google
 * @param {string} idToken - Token de autenticación de Google
 * @returns {Promise<object>} - Respuesta del backend
 */
export const registerUserWithGoogle = async (idToken) =>
    apiRegisterUserWithGoogle(idToken);
  