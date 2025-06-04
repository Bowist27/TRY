import { postAsignacion } from '../../../infrastructure/api/expedientes/assignExpedienteApi';

/**
 * Lógica de negocio para asignar un expediente.
 *
 * @param {string} email – Correo del usuario autenticado.
 * @param {number} expedienteId – ID del expediente.
 * @param {string} abogadoId – ID del abogado al que se asignará el expediente.
 * @returns {Promise<{ success: boolean, message?: string }>}
 * - Resultado de la asignación.
 */
export async function assignExpediente(email, expedienteId, abogadoId) {
    return await postAsignacion(email, expedienteId, abogadoId);
}
