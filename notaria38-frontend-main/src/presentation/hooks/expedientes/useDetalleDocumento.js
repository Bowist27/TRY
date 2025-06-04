import { useState, useEffect } from 'react';

/**
 * Hook para verificar acceso y estado de un documento PDF.
 * Realiza una petición HEAD y devuelve el estado de carga y errores.
 *
 * @param {string} url - URL del documento PDF a verificar.
 * @returns {{ checking: boolean, error: string }} Un objeto con el estado de comprobación
 *  y el mensaje de error si existe.
 */
export default function useDetalleDocumento(url) {
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!url) {
            setError('No se recibió URL de documento.');
            setChecking(false);
            return;
        }
        setChecking(true);
        // Verificar acceso HEAD
        fetch(url, { method: 'HEAD' })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar el documento');
                }
            })
            .catch((error) => setError(error.message))
            .finally(() => setChecking(false));
    }, [url]);

    return { checking, error };
}
