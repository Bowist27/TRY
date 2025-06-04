/* eslint-disable indent */
import { useEffect, useState, useCallback } from 'react';
import { loadVideoDetails } from '../../../application/useCases/ayuda/loadVideoDetalle';

/**
 * Hook para obtener el detalle de un video por ID.
 *
 * @function useVideoDetalle
 * @param {string|null} videoId - ID del video seleccionado.
 * @returns {{ detalle: any, loading: boolean, error: string|null, refetch: () => void }}
 *   Objeto con detalle, estado de carga, error y función refetch.
 */
export const useVideoDetalle = (videoId) => {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para cargar el detalle del video.
   *
   * @returns {Promise<void>} Promise que se resuelve tras cargar o fallar.
   */
  const fetchDetalle = useCallback(async () => {
    if (!videoId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await loadVideoDetails(videoId);
      setDetalle(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Error al cargar detalle');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchDetalle();
  }, [fetchDetalle]);

  return {
    detalle,
    loading,
    error,
    refetch: fetchDetalle,
  };
};
