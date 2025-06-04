import { baseURL } from '../apiConfig.js';
import fetchRetry from 'fetch-retry';

const fetch = fetchRetry(window.fetch);

let abogadosCache = new Map();
let abogadosPromise = new Map();

export function clearAbogadosCache() {
    abogadosCache.clear();
    abogadosPromise.clear();
}

export async function fetchAbogados(email) {
    if (!email) {
        throw new Error('Usuario no autenticado');
    }

    if (abogadosCache.has(email)) {
        return abogadosCache.get(email);
    }

    if (abogadosPromise.has(email)) {
        return await abogadosPromise.get(email);
    }

    const endpoint = `${baseURL}/api/abogados?rol=3`;
    
    const promise = (async () => {
        const response = await fetch(endpoint, {
            method: 'GET',
            retries: 3,
            retryDelay: () => 2000,
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': email,
            },
        });

        if (response.status === 403) {
            throw new Error('No tienes permiso para ver los abogados');
        }

        if (!response.ok) {
            throw new Error('No se pudieron obtener los abogados. Intente más tarde.');
        }

        const list = await response.json();
        abogadosCache.set(email, list);
        abogadosPromise.delete(email);
        return list;
    })();

    abogadosPromise.set(email, promise);
    return await promise;
}

export async function postAsignacion(email, expedienteId, responsableId) {
    if (!email) {
        throw new Error('Usuario no autenticado');
    }

    const endpoint = `${baseURL}/api/expedientes/asignar`;
    const response = await fetch(endpoint, {
        method: 'POST',
        retries: 3,
        retryDelay: () => 2000,
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': email,
        },
        body: JSON.stringify({
            idExpediente: expedienteId,
            idResponsable: responsableId
        }),
    });

    if (response.status === 403) {
        throw new Error('No tienes permiso para asignar expedientes');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Error al asignar expediente. Intente más tarde.');
    }

    return { success: true, message: data.message };
}