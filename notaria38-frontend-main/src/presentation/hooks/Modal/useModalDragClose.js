import { useState } from 'react';
/**
 * Hook para manejar el cierre de un modal al arrastrar el mouse fuera de él.
 * @param {*} backdropReference - Referencia al fondo del modal (backdrop)
 * @param {*} onClose - Función para cerrar el modal
 * @returns {object} - Manejadores de mouse
 */
export function useModalDragClose(backdropReference, onClose) {
    const [mouseDownOnBackdrop, setMouseDownOnBackdrop] = useState(false);

    /**
     * Maneja el evento de mouse down en el backdrop del modal.
     * @param {*} event - Evento de mouse
     * @returns {void}
     */
    const handleMouseDown = (event) => {
        if (!backdropReference?.current) {
            return;
        }

        if (event.target === backdropReference.current) {
            setMouseDownOnBackdrop(true);
        } else {
            setMouseDownOnBackdrop(false);
        }
    };

    /**
     * Maneja el evento de mouse up en el backdrop del modal.
     * @param {*} event - Evento de mouse
     * @returns {void}
     */
    const handleMouseUp = (event) => {
        if (!backdropReference?.current) {
            return;
        }

        if (mouseDownOnBackdrop && event.target === backdropReference.current) {
            onClose();
        }
        setMouseDownOnBackdrop(false);
    };

    return { handleMouseDown, handleMouseUp };
}
