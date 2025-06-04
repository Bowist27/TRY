// src/application/useCases/initExpediente.js
import { iniciarExpediente } from '../../infrastructure/api/tramitesApi';

/**
 * Caso de uso que inicia un expediente
 * @param {string} nombreTramite - Nombre del trámite a iniciar
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise<object>} - Respuesta de la API
 */
export const iniciarExpedienteUseCase = async (nombreTramite, email) => {
    if (!nombreTramite || !email) {
        throw new Error('Faltan datos obligatorios');
    }

    return await iniciarExpediente(nombreTramite, email); // ya retorna `{ data, status }`
};

