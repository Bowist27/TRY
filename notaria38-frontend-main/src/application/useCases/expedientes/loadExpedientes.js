import { 
    fetchAllExpedientes
} from '../../../infrastructure/api/expedientes/readExpedientesApi';
import { 
    toExpedienteListModel 
} from '../../../domain/models/expedientes/expedientesModel';

/**
 * Carga los expedientes desde la API.
 *
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<Array>} - Resuelve con un arreglo de objetos de expediente.
 */
export const loadExpedientes = async email => {
    const apiList = await fetchAllExpedientes(email);
    return toExpedienteListModel(apiList);
};