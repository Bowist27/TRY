// src/presentation/components/EncargadoCell.jsx

import SelectField from './SelectField';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import ConfirmationModal from './ConfirmationModal';
import useAsignarExpediente from '../hooks/expedientes/useAsignarExpediente';
import useAbogados from '../hooks/expedientes/useAbogados';
import { useAuth } from '../hooks/useAuth';

/**
 * Dropdown para seleccionar un abogado encargado de un expediente.
 *
 * @param {object} props - Componente de celda para asignar abogado encargado.
 * @param {number|null} props.encargado - ID del abogado asignado inicialmente.
 * @param {string|null} props.nombreAsignado - Nombre completo del abogado asignado
 *   (si existe).
 * @param {number} props.expedienteId - ID del expediente.
 * @returns {JSX.Element} Elemento JSX que representa la celda de encargado.
 */
export default function EncargadoCell({ encargado, nombreAsignado, expedienteId }) {
  const { user } = useAuth();
  const {
    options: baseOptions,
    loading: abLoading,
    error: abError,
  } = useAbogados(user.email);

  const {
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
  } = useAsignarExpediente(expedienteId, encargado != null ? String(encargado) : '');

  let dropdownOptions = [...baseOptions];

  if (encargado != null && nombreAsignado) {
    const assignedValue = String(encargado);
    const assignedOption = { value: assignedValue, label: nombreAsignado };

    dropdownOptions = [
      assignedOption,
      ...baseOptions.filter((opt) => opt.value !== assignedValue),
    ];
  }

  if (abLoading || loading) {
    return <span>—</span>;
  }

  if (abError) {
    return <span className='text-red-500'>{abError}</span>;
  }

  return (
    <>
      <SelectField
        value={selected}
        options={dropdownOptions}
        onChange={(event) => handleChange(event.target.value)}
        className='w-full'
      />

      <ConfirmationModal
        isOpen={modalOpen}
        title='Confirmar asignación'
        message='¿Está seguro de asignar este expediente al abogado seleccionado?'
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={loading}
      />

      {successMessage && <SuccessAlert message={successMessage} onClose={clearSuccess} />}

      {error && <ErrorAlert message={error} onClose={clearError} />}
    </>
  );
}
