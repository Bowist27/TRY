import { SecureStorage } from './secureStorage.js';
import { STORAGE_KEYS } from './authConstants.js';

/**
 * Estados por defecto para TOTP
 */
const DEFAULT_TOTP_STATE = {
    required: false,
    verified: false,
    email: '',
};

/**
 * Gestor especializado para estado TOTP
 */
export class TotpStorageManager {
    /**
     * Persiste estado TOTP de forma granular
     * @param {object} params - Parámetros de estado TOTP
     * @param {boolean} params.required - Indica si TOTP es requerido
     * @param {boolean} params.verified - Indica si TOTP ha sido verificado
     * @param {string} params.email - Email del usuario
     * @returns {void}
     */
    static persistTotpState({ required, verified, email }) {
        const updates = { required, verified, email };

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                const storageKey = this.#getStorageKey(key);
                SecureStorage.setItem(storageKey, value);
            }
        });

        SecureStorage.updateSessionTimestamp();
    }

    /**
     * Mapea claves de estado a claves de storage
     * @private
     * @param {string} stateKey - Clave del estado TOTP
     * @returns {string} Clave de almacenamiento correspondiente
     */
    static #getStorageKey(stateKey) {
        const keyMap = {
            required: STORAGE_KEYS.TOTP_REQUIRED,
            verified: STORAGE_KEYS.TOTP_VERIFIED,
            email: STORAGE_KEYS.USER_EMAIL,
        };
        return keyMap[stateKey];
    }

    /**
     * Carga estado TOTP con manejo de expiración
     * @param {Function} onSessionExpired - Callback para manejar expiración de sesión
     * @returns {object} Estado TOTP cargado o estado por defecto si la sesión ha expirado
     */
    static loadTotpState(onSessionExpired = null) {
        if (!SecureStorage.isSessionValid()) {
            this.clearTotpState();
            onSessionExpired?.();
            return DEFAULT_TOTP_STATE;
        }

        return {
            required: SecureStorage.getItem(STORAGE_KEYS.TOTP_REQUIRED) || false,
            verified: SecureStorage.getItem(STORAGE_KEYS.TOTP_VERIFIED) || false,
            email: SecureStorage.getItem(STORAGE_KEYS.USER_EMAIL) || '',
        };
    }

    /**
     * Limpia estado TOTP
     */
    static clearTotpState() {
        SecureStorage.clear();
    }

    /**
     * Verifica validez de sesión
     * @returns {boolean} Verdadero si la sesión es válida
     */
    static isSessionValid() {
        return SecureStorage.isSessionValid();
    }

    /**
     * Verifica validez con callback de expiración
     * @param {Function} onSessionExpired - Callback a ejecutar si la sesión ha expirado
     * @returns {boolean} Verdadero si la sesión es válida, falso si ha expirado
     */
    static checkSessionValidity(onSessionExpired = null) {
        const isValid = SecureStorage.isSessionValid();

        if (!isValid) {
            this.clearTotpState();
            onSessionExpired?.();
        }

        return isValid;
    }

    /**
     * Obtiene el email del usuario almacenado
     * @returns {string|null} Email del usuario almacenado o null si no existe
     */
    static getUserEmail() {
        return SecureStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    }

    /**
     * Obtiene el estado de verificación TOTP
     * @returns {boolean} Verdadero si TOTP ha sido verificado, falso en caso contrario
     */
    static getTotpVerifiedStatus() {
        return SecureStorage.getItem(STORAGE_KEYS.TOTP_VERIFIED) || false;
    }

    /**
     * Obtiene el estado de requerimiento TOTP
     * @returns {boolean} Verdadero si TOTP es requerido, falso en caso contrario
     */
    static getTotpRequiredStatus() {
        return SecureStorage.getItem(STORAGE_KEYS.TOTP_REQUIRED) || false;
    }

    /**
     * Marca TOTP como verificado y actualiza el estado
     * @returns {void}
     */
    static markTotpAsVerified() {
        this.persistTotpState({ required: false, verified: true });
    }

    /**
     * Marca TOTP como requerido y actualiza el estado
     * @param {string} email - Email del usuario
     * @returns {void}
     */
    static markTotpAsRequired(email) {
        this.persistTotpState({ required: true, verified: false, email });
    }

    /**
     * Información completa de sesión
     * @returns {object} Información de sesión incluyendo validez, edad, tiempo restante
     *  edad máxima
     * @property {boolean} isValid - Indica si la sesión es válida
     * @property {number|null} age - Edad de la sesión en milisegundos o null si no existe
     * @property {number|null} timeRemaining - Tiempo restante de la sesión en
     * milisegundos o null si no existe
     * @property {number} maxAge - Edad máxima de la sesión en milisegundos
     */
    static getSessionInfo() {
        return {
            isValid: this.isSessionValid(),
            age: SecureStorage.getSessionAge(),
            timeRemaining: SecureStorage.getSessionTimeRemaining(),
            maxAge: SecureStorage.SESSION_MAX_AGE,
        };
    }
}
