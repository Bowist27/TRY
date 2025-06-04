import { useState, useEffect } from 'react';
import { acceptDocument } from '../../../application/useCases/documentos/updateDocumento';

/**
 * Hook para manejar la aceptación de un documento.
 * Permite abrir un modal para agregar un comentario al aceptar el documento.
 * @param {string} documentId - ID del documento a aceptar.
 * @param {string} tramiteId - ID del trámite asociado al documento.
 * @param {string} initialStatus - Estado inicial del documento.
 * @returns {object} - Funciones y estados relacionados con la aceptación del documento.
 */
export default function useAcceptDocumento(documentId, tramiteId, initialStatus) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [, setComment] = useState('');
    const [success, setSuccess] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [status, setStatus] = useState(initialStatus);
    const { loading, error: apiError, accept } = acceptDocument(documentId, tramiteId);

    // Usa error de API para pasarlo a localError y limpiarlo
    useEffect(() => {
        if (apiError) {
            setLocalError(apiError);
        }
    }, [apiError]);

    /**
     * Abre el modal para subir un comentario al aceptar.
     */
    const handleAcceptButton = () => {
        setShowCommentModal(true);
        setSuccess(false);
        setLocalError(null);
    };

    /**
     * Maneja el envío del comentario al aceptar el documento.
     * @param {string} comment - Comentario ingresado por el usuario.
     */
    const handleCommentSubmit = async (comment) => {
        setLocalError(null);
        try {
            await accept(comment);
            setShowCommentModal(false);
            setSuccess(true);
            setStatus(2); // Aceptado
        } catch (error) {
            setShowCommentModal(false);
            setLocalError(
                error.message ||
                    'Error al aceptar el documento. Intente nuevamente más tarde.'
            );
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
        handleAcceptButton,
        handleCommentSubmit,
        handleCancelComment,
        loading,
        error: localError,
        success,
        setLocalError,
        status,
    };
}
