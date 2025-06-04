// application/hooks/useEnviarArchivo.js

import { useState } from 'react';
import { enviarArchivoApi38 } from '../useCases/enviarArchivoApi38';

export function useEnviarArchivo() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [respuesta, setRespuesta] = useState(null);

    const enviarArchivo = async (archivo) => {
        setLoading(true);
        setError(null);

        try {
            const data = await enviarArchivoApi38({ clave: '01', archivo });
            setRespuesta(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { enviarArchivo, loading, error, respuesta };
}
