import { fetchTramites } from 
    '../../infrastructure/api/tramitesApi';

/**
 * Caso de uso para obtener la lista de trámites.
 * @returns {Promise<Array>} Lista de trámites
 */
export const loadTramites = async () => fetchTramites();
