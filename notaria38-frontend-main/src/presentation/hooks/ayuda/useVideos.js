// src/presentation/hooks/useVideos.js
import { useEffect, useState, useCallback } from 'react';
import { loadVideos } from '../../../application/useCases/ayuda/loadVideos.js';
import { useAuth } from '../useAuth';

/**
 * Hook para cargar la lista de videos desde el backend.
 *
 * - Si no hay usuario autenticado, llama a loadVideos() sin token.
 * - Si existe usuario, obtiene el ID‐token y llama a loadVideos(email, token).
 *
 * @function useVideos
 * @returns {{
 *   videos: any[];
 *   loading: boolean;
 *   error: string|null;
 *   refetch: () => Promise<void>;
 * }}
 */
export const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  /**
   * Función para obtener los videos desde el backend.
   */
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      if (user) {
        // Si el usuario existe, obtenemos su ID‐token y llamamos a loadVideos con email + token
        const token = await user.getIdToken();
        data = await loadVideos(user.email, token);
      } else {
        // Si no hay usuario, cargamos videos anónimos (sin enviar token)
        data = await loadVideos();
      }

      setVideos(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Error al cargar videos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, loading, error, refetch: fetchVideos };
};
