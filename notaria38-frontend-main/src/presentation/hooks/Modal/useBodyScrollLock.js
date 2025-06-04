import { useEffect } from 'react';

/**
 * Hook para bloquear el scroll del body.
 * Se utiliza para evitar scroll del fondo en modales.
 * @param {*} locked - Indica si el scroll debe estar bloqueado.
 * @returns {void}
 */
export function useBodyScrollLock(locked) {
    useEffect(() => {
        if (locked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [locked]);
}