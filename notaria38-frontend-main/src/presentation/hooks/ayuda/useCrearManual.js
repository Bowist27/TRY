import { useState } from 'react';
import { executeCreateVideo } from '../../../application/useCases/ayuda/createVideo';
import { useAuth } from '../useAuth';

/**
 * Hook personalizado que encapsula la lógica para crear 
 * un nuevo manual de usuario (video de capacitación).
 * 
 * @function
 * @param {Function} onSuccess - Función que se ejecuta 
 * después de crear exitosamente un manual.
 * @returns {object} Objeto que contiene:
 *  - crearManual {Function} Función para crear un manual con los datos proporcionados.
 *  - loading {boolean} Indicador de estado de carga.
 *  - error {string|null} Mensaje de error si ocurre alguno.
 */
export function useCrearManual(onSuccess) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  /**
   * Envía la solicitud para crear un nuevo manual (video) en el sistema.
   *
   * @async
   * @param {object} video - Objeto que contiene los datos del video a crear.
   * @returns {Promise<object>} Resultado de la operación del caso de uso.
   * @throws {Error} Si ocurre un fallo durante la creación del manual.
   */
  const crearManual = async (video) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      // 1) Pedimos el ID token de Firebase
      const token = await user.getIdToken();

      // 2) Ejecutamos el caso de uso pasándole video, email y token
      const result = await executeCreateVideo(video, user.email, token);

      if (onSuccess) {
        onSuccess();
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { crearManual, loading, error };
}
