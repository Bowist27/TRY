// src/presentation/hooks/expedientes/useReadExpedientes.js
import { useState, useEffect, useCallback } from 'react';
import { loadExpedientes } from '../../../application/useCases/expedientes/loadExpedientes';
import { useAuth } from '../../hooks/useAuth';

/**
 * Hook para cargar los expedientes del usuario autenticado,
 * ejecuta siempre la petición una vez que el token y email
 * ya están inyectados, independiente de los permisos.
 */
export function useReadExpedientes() {
  const { user, loading: authLoading, totpRequired, isTotpVerified } = useAuth();
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    // No disparar si no hay usuario o falta TOTP verificado
    if (!user || (totpRequired && !isTotpVerified)) {
      setExpedientes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await loadExpedientes(user.email);
      setExpedientes(data);
    } catch (err) {
      setError(err.message || 'Error al cargar expedientes');
      setExpedientes([]);
    } finally {
      setLoading(false);
    }
  }, [user, totpRequired, isTotpVerified]);

  useEffect(() => {
    // Esperar a que auth cargue y el token esté inyectado
    if (authLoading) return;
    reload();
  }, [authLoading, reload]);

  return { expedientes, loading, error, reload };
}
