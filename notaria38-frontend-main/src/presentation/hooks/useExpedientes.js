import { useEffect, useState, useCallback } from 'react';
import { loadExpedientes } from '../../application/useCases/expedientes/loadExpedientes';
import { useAuth } from './useAuth';

export function useExpedientes() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const reload = useCallback(async () => {
        if (!user?.email) {
            setError('Usuario no autenticado');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const expedientes = await loadExpedientes(user.email);
            setData(expedientes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        reload();
    }, [reload]);

    return { data, loading, error, reload };
}