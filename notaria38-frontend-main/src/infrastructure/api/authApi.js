import fetchRetry from 'fetch-retry';
import axios from 'axios';

// Usamos el fetch del navegador con reintentos configurados
const fetch = fetchRetry(window.fetch);

/**
 * Llama a la API para verificar si el TOTP está habilitado.
 *
 * @param {string} email
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function apiIsTotpEnabled(email) {
    const baseURL = import.meta.env.VITE_API_URL;

    if (!baseURL) {
        throw new Error('VITE_APIN_URL no definido');
    }

    const url = `${baseURL}/api/totp-habilitado`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const body = {
        email: email,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        retries: 5,
        retryDelay: () => 200,
        retryOn: [429, 500, 502, 503, 504],
    });

    const data = await response.json();
    return data;
}

/**
 * Llama a la API para verificar el código TOTP.
 *
 * @param {string} email
 * @param {int} code
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function apiVerifyTotpCode(email, code) {
    const baseURL = import.meta.env.VITE_API_URL;

    if (!baseURL) {
        throw new Error('VITE_APIN_URL no definido');
    }

    const url = `${baseURL}/api/verificar-totp`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const body = {
        email: email,
        token: code,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        retries: 5,
        retryDelay: () => 200,
        retryOn: [429, 500, 502, 503, 504],
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
}

/**
 * Llama a la API para verificar si el email está registrado.
 *
 * @param {string} email
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function apiGetIsThisEmailRegistered(email) {
    const baseURL = import.meta.env.VITE_API_URL;

    if (!baseURL) {
        throw new Error('VITE_APIN_URL no definido');
    }

    const url = `${baseURL}/api/email-registrado`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const body = {
        email: email,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        retries: 1,
        retryDelay: () => 200,
        retryOn: [429, 500, 502, 503, 504],
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
}

/**
 * Llama a la API para enviar un token TOTP por correo.
 *
 * @param {string} email
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function apiSendTotpByEmail(email) {
    const baseURL = import.meta.env.VITE_API_URL;

    if (!baseURL) {
        throw new Error('VITE_API_URL no definido');
    }

    const url = `${baseURL}/api/enviar-totp`; // Ajusta esta ruta si usas otro endpoint

    const headers = {
        'Content-Type': 'application/json',
    };

    const body = {
        email: email,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        retries: 1,
        retryDelay: () => 200,
        retryOn: [429, 500, 502, 503, 504],
        body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
}

/**
 * Llama a la API para obtener los métodos de inicio de sesión disponibles para un correo.
 *
 * @param {string} email
 * @returns {Promise<Object>} Objeto con el arreglo de signInMethods
 */
export async function apiGetSignInMethods(email) {
    const baseURL = import.meta.env.VITE_API_URL;

    if (!baseURL) {
        throw new Error('VITE_API_URL no definido');
    }

    const url = `${baseURL}/api/firebase/signin-methods`;

    const headers = {
        'Content-Type': 'application/json',
    };

    const body = {
        email,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        retries: 3,
        retryDelay: () => 200,
        retryOn: [429, 500, 502, 503, 504],
    });

    const data = await response.json();
    return data;
}
