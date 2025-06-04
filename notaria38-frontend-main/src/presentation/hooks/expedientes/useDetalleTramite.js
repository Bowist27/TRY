import { loadDetalleTramite } from '../../../application/useCases/expedientes/loadDetalleTramite';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth';

/**
 * Hook para cargar el detalle de un tramite y los comentarios
 * asociados a sus documentos.
 * 
 * @param {*} idTramite - ID del tramite a consultar.
 * @returns {object} - Un objeto con los detalles del tramite y los comentarios.
 * @throws {Error} - Si ocurre un error al cargar el detalle del tramite.
 */
export const useDetalleTramite = (idTramite) => {
    const [acceso, setAcceso] = useState(null);
    const [title, setTitle] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [, setShowError] = useState(false);

    // Obtener usuario autenticado
    const { user } = useAuth();
    const navigate = useNavigate();

    /**
     * Función para cargar los datos del detalle del trámite.
     * 
     * @returns {Promise<void>}
     */
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setShowError(false);
        try {
            const data = await loadDetalleTramite(idTramite, user?.email);
            setAcceso(data.acceso);
            setTitle(data.title);
            setDocumentos(data.expediente);
            setComentarios(data.comentarios);
        } catch (error) {
            const message = error.message || '';
            if (message == '403' || message == '404') {
                navigate('/404', { replace: true });
                return;
            }
            setError('Error al cargar el detalle del trámite');
            setShowError(true);
        } finally {
            setLoading(false);
        }
    }, [idTramite, user?.email, navigate]);

    useEffect(() => {
        let ignore = false;
        
        const loadData = async () => {
            await fetchData();
            if (ignore) {
                return;
            }
        };

        if (idTramite) {
            loadData();
        }
        return () => {
            ignore = true;
        };
    }, [fetchData, idTramite]);

    return { acceso, title, documentos, comentarios, loading, error, reload: fetchData };
};