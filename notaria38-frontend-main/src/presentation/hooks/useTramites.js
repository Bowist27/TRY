import { useEffect, useState } from 'react';
import { loadTramites } from '../../application/useCases/loadTramites';

/**
 * Hook para obtener la lista de trámites.
 * Maneja el estado de carga, datos y errores.
 *
 * @function useTramites
 * @returns {{ tramites: any[]; loading: boolean; error: string|null }}
 *   Objeto con la lista de trámites, estado de carga y mensaje de error.
 */
export const useTramites = () => {
    const [tramites, setTramites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    /**
     * Función para cargar los trámites desde el backend.
     *
     * @returns {Promise<void>}
     */
        const fetchTramites = async () => {
            try {
                const data = await loadTramites();
                setTramites(data);
            } catch (fetchError) {
                setError(fetchError.message || 'Error al cargar trámites');
            } finally {
                setLoading(false);
            }
        };

        fetchTramites();
    }, []);

    return {
        tramites,
        loading,
        error,
    };
};
