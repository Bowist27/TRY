import { useState, useEffect } from 'react';
import { rejectDocument } from '../../../application/useCases/documentos/updateDocumento';

/**
 * Hook para manejar el rechazo de un documento.
 * Permite abrir un modal para agregar un comentario al rechazar el documento.
 * @param {string} documentId - ID del documento a rechazar.
 * @param {string} tramiteId - ID del trámite asociado al documento.
 * @param {string} initialStatus - Estado inicial del documento.
 * @returns {object} - Funciones y estados relacionados con el rechazo del documento.
 */
export default function useRejectDocumento(documentId, tramiteId, initialStatus) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [, setComment] = useState('');
    const [success, setSuccess] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [status, setStatus] = useState(initialStatus);
    const { loading, error: apiError, reject } = rejectDocument(documentId, tramiteId);

    // Usa error de API para pasarlo a localError y limpiarlo
    useEffect(() => {
        if (apiError) {
            setLocalError(apiError);
        }
    }, [apiError]);

    /**
     * Abre el modal para subir un comentario al rechazar.
     */
    const handleRejectButton = () => {
        setShowCommentModal(true);
        setSuccess(false);
        setLocalError(null);
    };

    /**
     * Maneja el envío del comentario al rechazar el documento.
     * @param {string} comment - Comentario ingresado por el usuario.
     * @returns {void}
     */
    const handleCommentSubmit = async (comment) => {
        setLocalError(null);
        try {
            await reject(comment);
            setShowCommentModal(false);
            setSuccess(true);
            setStatus(1);
        } catch (error) {
            setShowCommentModal(false);
            setLocalError(
                error.message ||
                    'Error al rechazar el documento. Intente nuevamente más tarde.'
            );
            return;
        }
    };

    /**
     * Cancela el comentario y cierra el modal.
     */
    const handleCancelComment = () => {
        setShowCommentModal(false);
        setLocalError(null);
        setComment('');
    };

    return {
        showCommentModal,
        handleRejectButton,
        handleCommentSubmit,
        handleCancelComment,
        loading,
        error: localError,
        success,
        setLocalError,
        status,
    };
}
