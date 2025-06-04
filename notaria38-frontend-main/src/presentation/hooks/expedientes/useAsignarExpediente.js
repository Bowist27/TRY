import { useState, useEffect } from 'react';
import { postAsignacion } from '../../../infrastructure/api/expedientes/assignExpedienteApi';
import { useAuth } from '../../hooks/useAuth';

/**
 * Hook para asignar un expediente con confirmación.
 *
 * @returns {{
 *   selected: string,
 *   handleChange: (value: string) => void,
 *   modalOpen: boolean,
 *   handleConfirm: () => void,
 *   handleCancel: () => void,
 *   loading: boolean,
 *   successMessage: string,
 *   error: string
 * }}
 */
export default function useAsignarExpediente(expedienteId, initialValue = '') {
    const { user } = useAuth();

    const [selected, setSelected] = useState('');
    const [pendingSelection, setPendingSelection] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    // ✅ Este useEffect inicializa correctamente el selected al montar el componente
    useEffect(() => {
        setSelected(initialValue);
    }, [initialValue]);

    // ✅ Cuando el usuario selecciona un nuevo valor, abre el modal
    const handleChange = (value) => {
        setPendingSelection(value);
        setModalOpen(true);
    };

    // ✅ Cuando confirma, hace la asignación
    const handleConfirm = async () => {
        setLoading(true);
        try {
            const responsableId =
                pendingSelection === '' ? null : Number(pendingSelection);
            const result = await postAsignacion(user.email, expedienteId, responsableId);
            setSelected(pendingSelection);
            setSuccessMessage(result.message || 'Expediente asignado con éxito');
            setError('');
        } catch (err) {
            setError(err.message || 'Error al asignar expediente');
        } finally {
            setLoading(false);
            setModalOpen(false);
            setPendingSelection(null);
        }
    };

    const handleCancel = () => {
        setModalOpen(false);
        setPendingSelection(null);
    };

    const clearSuccess = () => {
        setSuccessMessage('');
    };

    const clearError = () => {
        setError('');
    };

    return {
        selected,
        handleChange,
        modalOpen,
        handleConfirm,
        handleCancel,
        loading,
        successMessage,
        error,
        clearSuccess,
        clearError,
    };
}
