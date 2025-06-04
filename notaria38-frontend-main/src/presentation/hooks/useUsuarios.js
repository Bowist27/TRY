// src/hooks/useUsuarios.js
import { useEffect, useState, useCallback } from 'react';
import { fetchUsuarios, fetchActualizarRol } from '../../infrastructure/api/usuariosApi';
import { useAuth } from './useAuth';

/**
 * Hook para gestionar la lista de usuarios y roles, con carga y actualización
 * protegidas mediante Bearer token de Firebase y envío de email en cabecera.
 *
 * @returns {{
 *   usuarios: any[];
 *   roles: any[];
 *   loading: boolean;
 *   error: string|null;
 *   updateUserRole: (userId: number|string, roleId: number|string) => Promise<void>;
 *   reload: () => Promise<void>;
 * }}
 */
export function useUsuarios() {
  const {
    user,
    loading: authLoading,
    totpRequired,
    isTotpVerified
  } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true); // inicialmente true hasta que auth esté listo
  const [error, setError] = useState(null);

  /**
   * Recarga la lista de usuarios y roles desde el backend,
   * pasando el email y el token de Firebase.
   */
  const reload = useCallback(async () => {
    // Si el user aún no está definido, o si TOTP está pendiente, no hacemos nada
    if (!user?.email || (totpRequired && !isTotpVerified)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Obtenemos el ID-token de Firebase
      const token = await user.getIdToken();

      // Llamada protegida al backend
      const { usuarios: uList, roles: rList } = await fetchUsuarios(user.email, token);

      setUsuarios(uList);
      setRoles(rList);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, [user, totpRequired, isTotpVerified]);

  /**
   * Efecto para disparar `reload` apenas `authLoading` termine
   * y TOTP (si aplica) se haya verificado.
   */
  useEffect(() => {
    // Si Firebase aún está cargando la sesión, o TOTP pendiente, dejamos loading=true
    if (authLoading || (totpRequired && !isTotpVerified)) {
      return;
    }

    // En cuanto Firebase cargó el user y TOTP ya está resuelto, disparamos la recarga
    reload();
  }, [authLoading, user, totpRequired, isTotpVerified, reload]);

  /**
   * Función para cambiar el rol de un usuario, reusando `fetchActualizarRol`.
   */
  const updateUserRole = useCallback(
    async (userId, roleId) => {
      if (!user?.email) {
        setError('Usuario no autenticado');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Obtenemos el ID-token de Firebase
        const token = await user.getIdToken();

        // Llamada PUT protegida al backend
        await fetchActualizarRol(user.email, token, userId, roleId);

        // Luego de actualizar, recargamos la lista
        await reload();
      } catch (err) {
        setError(err.message || 'Error al actualizar rol');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, reload]
  );

  return { usuarios, roles, loading, error, updateUserRole, reload };
}
