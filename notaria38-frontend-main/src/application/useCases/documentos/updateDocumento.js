import { useState } from 'react';
import {
    rejectDocumento,
    acceptDocumento,
} from '../../../infrastructure/api/documentos/updateDocumentoApi';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { usePermisos } from '../../../presentation/hooks/usePermisos';
import { PERM_REQUEST_DOCUMENT_FIX } from '../../util/permissions';

/**
 * Rechaza un documento asociado a un trámite.
 *
 * @param {*} documentId - ID del documento a rechazar.
 * @param {*} tramiteId - ID del trámite asociado.
 * @returns {object} - Un objeto con el estado de la operación y la función para rechazar.
 */
export const rejectDocument = (documentId, tramiteId) => {
    const { user } = useAuth();
    const { permisos, loading: permisosLoading } = usePermisos();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    /**
     * Rechaza un documento asociado a un trámite.
     * @param {string} comment - Comentario del rechazo.
     * @returns {Promise<void>}
     */
    const reject = async (comment) => {
        if (!user?.email || permisosLoading) {
            return;
        }

        if (!permisos.includes(PERM_REQUEST_DOCUMENT_FIX)) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await rejectDocumento(
                documentId,
                tramiteId,
                comment,
                user.email
            );
            setResponse(response);
        } catch (error) {
            setError(
                error.message ||
                    'Error al rechazar el documento. Intente nuevamente más tarde.'
            );
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, response, reject };
};

/**
 * Acepta un documento asociado a un trámite.
 * @param {*} documentId - ID del documento a aceptar
 * @param {*} tramiteId - ID del trámite asociado.
 * @returns {object} - Un objeto con el estado de la operación y la función para aceptar.
 */
export const acceptDocument = (documentId, tramiteId) => {
    const { user } = useAuth();
    const { permisos, loading: permisosLoading } = usePermisos();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    /**
     * Acepta un documento asociado a un trámite.
     * @param {string} comment - Comentario de aceptación.
     * @returns {Promise<void>}
     */
    const accept = async (comment = '') => {
        if (!user?.email || permisosLoading) {
            return;
        }

        if (!permisos.includes(PERM_REQUEST_DOCUMENT_FIX)) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await acceptDocumento(
                documentId,
                tramiteId,
                user.email,
                comment
            );
            setResponse(response);
        } catch (error) {
            setError(
                error.message ||
                    'Error al aceptar el documento. Intente nuevamente más tarde.'
            );
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, response, accept };
};
