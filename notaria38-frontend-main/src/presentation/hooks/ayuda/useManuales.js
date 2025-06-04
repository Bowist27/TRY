// src/presentation/hooks/useRemoveVideo.js
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePermisos } from '../../hooks/usePermisos';
import { deleteVideoById } from '../../../application/useCases/ayuda/deleteVideo';
import { PERM_REMOVE_USER_GUIDE } from '../../../application/util/permissions';

/**
 * Hook personalizado para eliminar un video de capacitación.
 * @returns {object} - { loading, error, removeVideo }
 */
export function useRemoveVideo() {
  const { user } = useAuth();
  const { permisos, loading: permisosLoading } = usePermisos();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  /**
   * Función para eliminar un video de ayuda.
   * @param {string} id - ID del video a eliminar
   * @returns {Promise<object>} - Respuesta del backend
   */
  const removeVideo = async (id) => {
    // 1) Esperar a permisos
    if (permisosLoading) {
      return;
    }

    // 2) Verificar que el usuario tenga el permiso
    if (!user?.email) {
      setError('Usuario no autenticado');
      return;
    }
    if (!permisos.includes(PERM_REMOVE_USER_GUIDE)) {
      setError('Sin permiso para eliminar manuales.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 3) Pedir el ID-token de Firebase
      const token = await user.getIdToken();
      // 4) Llamar al caso de uso pasándole email y token
      const res = await deleteVideoById(id, user.email, token);
      setResponse(res);
      return res;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al eliminar el video. Intente nuevamente más tarde.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, removeVideo };
}
