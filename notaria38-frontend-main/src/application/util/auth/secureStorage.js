import { AUTH_CONFIG, STORAGE_KEYS } from './authConstants.js';

/**
 * Manejador de almacenamiento seguro con expiración automática
 */
export class SecureStorage {
    /**
     * Crea un item con timestamp para almacenamiento
     * @private
     * @param {any} value - Valor a almacenar
     * @returns {object} Objeto con valor y timestamp
     */
    static #createStorageItem(value) {
        return {
            value,
            timestamp: Date.now(),
        };
    }

    /**
     * Verifica si un item ha expirado
     * @private
     * @param {object} item - Objeto almacenado con valor y timestamp
     * @returns {boolean} Verdadero si el item ha expirado
     */
    static #isItemExpired(item) {
        return Date.now() - item.timestamp > AUTH_CONFIG.SESSION_MAX_AGE;
    }

    /**
     * Maneja errores de storage de forma consistente
     * @private
     * @param {string} operation - Operación que falló (guardar, leer, eliminar)
     * @param {string} key - Clave del item
     * @param {Error} error - Error capturado
     * @returns {void}
     */
    static #handleStorageError(operation, key, error) {
        console.warn(`Error al ${operation} "${key}" en sessionStorage:`, error);
    }

    /**
     * Guarda un elemento en sessionStorage con timestamp
     * @param {string} key - Clave del item
     * @param {any} value - Valor a almacenar
     * @returns {void}
     */
    static setItem(key, value) {
        try {
            const item = this.#createStorageItem(value);
            sessionStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            this.#handleStorageError('guardar', key, error);
        }
    }

    /**
     * Obtiene un elemento verificando expiración
     * @param {string} key - Clave del item
     * @returns {any|null} Valor del item o null si no existe o ha expirado
     */
    static getItem(key) {
        try {
            const itemString = sessionStorage.getItem(key);
            if (!itemString) {
                return null;
            }

            const item = JSON.parse(itemString);

            if (this.#isItemExpired(item)) {
                this.removeItem(key);
                return null;
            }

            return item.value;
        } catch (error) {
            this.#handleStorageError('leer', key, error);
            return null;
        }
    }

    /**
     * Elimina un elemento específico
     * @param {string} key - Clave del item a eliminar
     * @returns {void}
     */
    static removeItem(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            this.#handleStorageError('eliminar', key, error);
        }
    }

    /**
     * Limpia todas las claves de autenticación
     */
    static clear() {
        try {
            Object.values(STORAGE_KEYS).forEach((key) => {
                sessionStorage.removeItem(key);
            });
        } catch (error) {
            console.warn('Error al limpiar sessionStorage:', error);
        }
    }

    /**
     * Verifica validez de sesión
     * @returns {boolean} Verdadero si la sesión es válida
     */
    static isSessionValid() {
        const sessionTimestamp = this.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        if (!sessionTimestamp) {
            return false;
        }

        const sessionAge = Date.now() - sessionTimestamp;
        return sessionAge <= AUTH_CONFIG.SESSION_MAX_AGE;
    }

    /**
     * Actualiza timestamp de sesión
     */
    static updateSessionTimestamp() {
        this.setItem(STORAGE_KEYS.SESSION_TIMESTAMP, Date.now());
    }

    /**
     * Obtiene edad de sesión en milisegundos
     * @returns {number|null} Edad de sesión o null si no existe
     */
    static getSessionAge() {
        const sessionTimestamp = this.getItem(STORAGE_KEYS.SESSION_TIMESTAMP);
        return sessionTimestamp ? Date.now() - sessionTimestamp : null;
    }

    /**
     * Obtiene tiempo restante de sesión
     * @returns {number|null} Tiempo restante en milisegundos o null si no existe
     */
    static getSessionTimeRemaining() {
        const sessionAge = this.getSessionAge();
        if (sessionAge === null) {
            return null;
        }

        const remaining = AUTH_CONFIG.SESSION_MAX_AGE - sessionAge;
        return Math.max(0, remaining);
    }

    static get SESSION_MAX_AGE() {
        return AUTH_CONFIG.SESSION_MAX_AGE;
    }
}
