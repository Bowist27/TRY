import { useState, useEffect } from 'react';
import { fetchAbogados } from '../../../infrastructure/api/expedientes/assignExpedienteApi';
import { toAbogadoListModel } from '../../../domain/models/Expedientes/abogadosModel';

/**
 * Hook para obtener la lista de abogados.
 * 
 * @param {*} email - Correo del usuario autenticado
 * @returns {object} - Objeto con las opciones, estado de carga y error
 */
export default function useAbogados(email) {
    const [options, setOptions] = useState([{ value: '', label: 'Por asignar' }]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        if (!email) {
            setError("Usuario no autenticado");
            setLoading(false);
            return;
        }

        fetchAbogados(email)
            .then(list => {
                const abogados = toAbogadoListModel(list);
                const options = abogados
                    .filter(user => user.name != null)
                    .map(user => ({
                        value: String(user.userId),
                        label: [user.name, user.firstLastName, user.secondLastName]
                            .filter(part => part != null && part.trim() !== '')
                            .join(' ')
                    }));
                setOptions([{ value: '', label: 'Por asignar' }, ...options]);
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, [email]);

    return { options, loading, error };
}