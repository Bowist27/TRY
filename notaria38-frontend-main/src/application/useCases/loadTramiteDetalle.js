import { fetchTramiteDetalle } from 
    '../../infrastructure/api/tramitesApi';

/**
 * Caso de uso para obtener el detalle de un trámite.
 * @param {number} id - ID del trámite
 * @returns {Promise<object>} Detalle del trámite
 */
export const loadTramiteDetalle = async (id) => {
    return fetchTramiteDetalle(id);
};
