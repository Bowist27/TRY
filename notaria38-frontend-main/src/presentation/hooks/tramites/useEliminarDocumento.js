import { eliminarDocumento as useCaseEliminarDocumento } from '../../../application/useCases/tramites/eliminarDocumento';
import { useAuth } from '../useAuth';

/**
 * Hook para eliminar un documento.
 * @returns {object} - Objeto con la función de eliminar documento.
 */
export function useEliminarDocumento() {
    const { user } = useAuth();
    const email = user?.email;

    /**
     * Función para eliminar un documento.
     *
     * @param {string} idDocumento - El ID del documento a eliminar.
     * @param {string} url - La URL de la API para eliminar el documento.
     * @param {string} expedienteId - El ID del expediente al que pertenece el documento.
     * @returns {Promise<object>} - Promesa que resuelve con la respuesta del servidor.
     */
    const eliminarDocumento = async (idDocumento, url, expedienteId) =>
        await useCaseEliminarDocumento(email, idDocumento, url, expedienteId);

    return { eliminarDocumento };
}
