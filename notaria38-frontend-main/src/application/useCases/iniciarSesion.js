import {
    apiIsTotpEnabled,
    apiVerifyTotpCode,
    apiGetIsThisEmailRegistered,
    apiSendTotpByEmail,
    apiGetSignInMethods,
} from '../../infrastructure/api/authApi';

import { registerUserWithGoogle } from '../../infrastructure/api/registroApi';

/**
 * Verifica si el TOTP está habilitado.
 *
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<object>} Respuesta de la API
 */
export const isTotpEnabled = async (email) => await apiIsTotpEnabled(email);

/**
 * Verifica el código TOTP.
 *
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} code - El código TOTP a verificar.
 * @returns {Promise<object>} Respuesta de la API
 */
export const verifyTotpCode = async (email, code) => await apiVerifyTotpCode(email, code);

/**
 * Verifica si el email está registrado.
 *
 * @param {string} email - El correo electrónico a verificar.
 * @returns {Promise<object>} Respuesta de la API
 */
export const isThisEmailRegistered = async (email) =>
    await apiGetIsThisEmailRegistered(email);

/**
 * Registra un usuario en la base de datos.
 *
 * @param {string} idToken - Token de Google
 * @returns {Promise<object>} - Respuesta de la API
 */
export const registerUser = async (idToken) => await registerUserWithGoogle(idToken);

/**
 * Envía el token TOTP al correo del usuario.
 *
 * @param {string} email
 * @returns {Promise<object>} Respuesta de la API
 */
export const sendTotpByEmail = async (email) => await apiSendTotpByEmail(email);

/**
 * Obtiene los métodos de inicio de sesión habilitados para un email.
 *
 * @param {string} email
 * @returns {Promise<string[]>} Lista de métodos como ['google.com', 'password']
 */
export const getSignInMethods = async (email) => {
    const { signInMethods } = await apiGetSignInMethods(email);
    return signInMethods;
};
