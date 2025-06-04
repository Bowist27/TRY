// src/hooks/useTramiteDetalle.js
import { useEffect, useState, useCallback, useRef } from 'react';
import { loadTramiteDetalle } from '../../application/useCases/loadTramiteDetalle';

/**
 * Hook para obtener el detalle de un trámite por ID.
 * Maneja la carga, estado y errores, y expone también una función `reload`.
 *
 * @param {number|null} tramiteId - ID del trámite seleccionado (o null para limpiar).
 * @returns {{
 *   detalle: any | null,
 *   loading: boolean,
 *   error: string | null,
 *   reload: () => Promise<void>
 * }}
 */
export const useTramiteDetalle = (tramiteId) => {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref para poder cancelar si el componente se desmonta o cambia tramiteId
  const isCurrent = useRef(true);

  // Función para cargar el detalle, memoizada con useCallback
  const fetchDetalle = useCallback(async () => {
    if (!tramiteId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await loadTramiteDetalle(tramiteId);
      // Solo escribimos estado si seguimos “montados” y sigue siendo el mismo trámite
      if (isCurrent.current) {
        setDetalle(data);
      }
    } catch (fetchError) {
      if (isCurrent.current) {
        setError(fetchError.message || 'Error al cargar detalle');
      }
    } finally {
      if (isCurrent.current) {
        setLoading(false);
      }
    }
  }, [tramiteId]);

  // Cada vez que cambie trámite:
  useEffect(() => {
    // Marcamos que esta instancia está “activa”
    isCurrent.current = true;

    if (!tramiteId) {
      // Si no hay ID, limpiamos todo
      setDetalle(null);
      setError(null);
      setLoading(false);
    } else {
      // Cargamos el detalle
      fetchDetalle();
    }

    // Cuando el componente se desmonte o tramiteId cambie, marcamos como “no actual”
    return () => {
      isCurrent.current = false;
    };
  }, [tramiteId, fetchDetalle]);

  return {
    detalle,
    loading,
    error,
    reload: fetchDetalle, // permite recargar manualmente
  };
};
