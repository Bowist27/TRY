import {
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../infrastructure/firebase';
import {
    isTotpEnabled as apiIsTotpEnabled,
    verifyTotpCode as apiVerifyTotpCode,
    isThisEmailRegistered as apiIsThisEmailRegistered,
    registerUser as apiRegisterUser,
    sendTotpByEmail as apiSendTotpByEmail,
    getSignInMethods as apiGetSignInMethods,
} from '../useCases/iniciarSesion';
import { TotpStorageManager } from '../util/auth/totpStorage';
import { ERROR_MESSAGES } from '../util/auth/authConstants';

/**
 * Servicio de autenticación centralizado
 */
export class AuthService {
    /**
     * Maneja respuesta de TOTP después del login
     * @private
     * @param {string} email - Email del usuario
     * @param {boolean} totpEnabled - Indica si TOTP está habilitado
     * @returns {Promise<object>} Objeto con estado TOTP
     */
    static async #handleTotpResponse(email, totpEnabled) {
        if (totpEnabled) {
            TotpStorageManager.markTotpAsRequired(email);
            await apiSendTotpByEmail(email);

            return {
                totpRequired: true,
                totpState: { required: true, verified: false, email },
            };
        }

        const totpState = { required: false, verified: true, email };
        TotpStorageManager.persistTotpState(totpState);
        return {
            totpRequired: false,
            totpState,
        };
    }

    /**
     * Maneja errores de autenticación de forma consistente
     * @private
     * @param {Error} error - Error capturado
     * @param {string} defaultMessage - Mensaje por defecto
     * @throws {Error} Lanza un error con un mensaje específico
     * @returns {void}
     */
    static #handleAuthError(error, defaultMessage) {
        const message = ERROR_MESSAGES[error.code] || defaultMessage;
        throw new Error(message);
    }

    /**
     * Login con email y contraseña
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<object>} Objeto con estado TOTP
     */
    static async loginWithEmailAndPassword(email, password) {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const response = await apiIsTotpEnabled(user.email);
            return this.#handleTotpResponse(user.email, response.enabled);
        } catch (error) {
            try {
                const signInMethods = await apiGetSignInMethods(email);
                if (
                    signInMethods.includes('google.com') &&
                    !signInMethods.includes('password')
                ) {
                    throw new Error(ERROR_MESSAGES.GOOGLE_MESSAGE);
                }
            } catch {
                throw new Error(ERROR_MESSAGES['auth/invalid-credential']);
            }

            this.#handleAuthError(error, ERROR_MESSAGES.LOGIN_GENERIC);
        }
    }

    /**
     * Verificación de código TOTP
     * @param {string} email - Email del usuario
     * @param {string} code - Código TOTP a verificar
     * @returns {Promise<boolean>} Verdadero si el código es válido
     * @throws {Error} Lanza un error si la verificación falla
     */
    static async verifyTotpCode(email, code) {
        try {
            const response = await apiVerifyTotpCode(email, code);

            if (!response.valid) {
                const message =
                    ERROR_MESSAGES[response.error?.code] || ERROR_MESSAGES.TOTP_INVALID;
                throw new Error(message);
            }

            TotpStorageManager.markTotpAsVerified();
            return true;
        } catch (error) {
            console.error('Error al verificar TOTP:', error);
            throw new Error(error.message || ERROR_MESSAGES.TOTP_VERIFICATION_ERROR);
        }
    }

    /**
     * Login con Google
     * @returns {Promise<object>} Objeto con estado TOTP
     */
    static async loginWithGoogle() {
        const googleProvider = new GoogleAuthProvider();
        try {
            const { user: googleUser } = await signInWithPopup(auth, googleProvider);
            await this.#ensureUserRegistration(googleUser);
            const response = await apiIsTotpEnabled(googleUser.email);
            return this.#handleTotpResponse(googleUser.email, response.enabled);
        } catch (error) {
            this.#handleAuthError(error, ERROR_MESSAGES.GOOGLE_LOGIN_ERROR);
        }
    }

    /**
     * Asegura que el usuario esté registrado
     * @private
     * @param {object} user - Usuario de Firebase
     */
    static async #ensureUserRegistration(user) {
        const { registered } = await apiIsThisEmailRegistered(user.email);

        if (!registered) {
            const token = await user.getIdToken();
            await apiRegisterUser(token);
        }
    }

    /**
     * Cierre de sesión
     * @returns {Promise<void>} Promesa que se resuelve al cerrar sesión
     * @throws {Error} Lanza un error si ocurre un problema al cerrar sesión
     */
    static async logout() {
        try {
            await signOut(auth);
            TotpStorageManager.clearTotpState();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw new Error(ERROR_MESSAGES.LOGOUT_ERROR);
        }
    }
}
