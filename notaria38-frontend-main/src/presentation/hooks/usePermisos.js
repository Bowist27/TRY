// src/application/hooks/usePermisos.js
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchPermisos } from '../../infrastructure/api/permisosApi';

export function usePermisos() {
  const { user, loading: authLoading, totpRequired, isTotpVerified } = useAuth();
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Mientras Firebase (authLoading) siga en true, mantenemos loading = true y no hacemos nada más.
    if (authLoading) {
      setLoading(true);
      return;
    }

    // 2) Ahora que authLoading ya es false:
    //    – Si no hay usuario, o el TOTP está pendiente, limpiamos permisos y marcamos loading = false.
    if (!user || (totpRequired && !isTotpVerified)) {
      setPermisos([]);
      setLoading(false);
      return;
    }

    // 3) Si tenemos un usuario válido y TOTP ya verificado, iniciamos la carga real de permisos.
    const loadPermisos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Si fetchPermisos espera email, pásalo aquí: fetchPermisos(user.email)
        const data = await fetchPermisos();
        setPermisos(data);
      } catch (e) {
        console.error('⚠️ error cargando permisos:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadPermisos();
  }, [authLoading, user, totpRequired, isTotpVerified]);

  const refresh = () => {
    if (!user) return;
    setLoading(true);
    // Si fetchPermisos necesita email, pásalo como fetchPermisos(user.email)
    fetchPermisos()
      .then(setPermisos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return { permisos, loading, error, refresh };
}
