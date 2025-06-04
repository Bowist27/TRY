import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para manejar el acceso al detalle de un trámite.
 * 
 * @param {*} loading - Estado de carga
 * @param {*} acceso - Estado de acceso
 * @returns {void}
 */
export function useDetalleTramiteAccess(loading, acceso) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && acceso === false) {
            navigate('/', { replace: true });
        }

    }, [loading, acceso, navigate]);
}
