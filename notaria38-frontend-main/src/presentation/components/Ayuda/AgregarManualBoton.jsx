// src/presentation/components/AgregarManualBoton.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PERM_ADD_USER_GUIDE } from '../../../application/util/permissions';
import ManualForm from '../Ayuda/ManualForm';
import PropTypes from 'prop-types';

/**
 * Botón flotante para agregar un nuevo manual/video de usuario.
 * Solo visible si el usuario tiene permiso `PERM_ADD_USER_GUIDE`.
 *
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.setSuccessMessage - Función para mostrar mensaje de éxito.
 * @param {Function} props.setErrorMessage - Función para mostrar mensaje de error.
 * @param {Function} props.refetchVideos - Función para recargar la lista de videos.
 * @returns {JSX.Element|null} El botón para agregar un video o null si no hay permisos.
 */
export default function AgregarManualBoton({
  setSuccessMessage,
  setErrorMessage,
  refetchVideos,
}) {
  const { permisos, permisosLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Esperar a que se carguen permisos
  if (permisosLoading) {
    return null;
  }

  // Ocultar si no tiene el permiso requerido
  if (!permisos.includes(PERM_ADD_USER_GUIDE)) {
    return null;
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setIsModalOpen(true)}
        aria-label='Agregar manual'
        className='cursor-pointer mb-4 inline-flex items-center text-white px-3 py-2 rounded-full shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-gray-500'
        style={{ backgroundColor: '#D07024' }}
        onMouseEnter={(error) => (error.currentTarget.style.backgroundColor = '#BD641E')}
        onMouseLeave={(error) => (error.currentTarget.style.backgroundColor = '#D07024')}
      >
        <Plus className='w-6 h-6 mr-2' />
        <span>Agregar video</span>
      </button>

      {isModalOpen && (
        <ManualForm
          mode='create'
          videoToEdit={{}}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          refetchVideos={refetchVideos}
        />
      )}
    </>
  );
}

AgregarManualBoton.propTypes = {
  setSuccessMessage: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  refetchVideos: PropTypes.func.isRequired,
};
