// src/presentation/components/ConfirmationModal.jsx
import React from 'react';
import { RxCross2 } from 'react-icons/rx';

/**
 * Modal de confirmación reutilizable
 * @param {object} param0 - Propiedades del modal
 * @param {boolean} param0.isOpen - Controla la visibilidad del modal
 * @param {string} param0.title - Título del modal
 * @param {string} param0.message - Mensaje de confirmación
 * @param {Function} param0.onConfirm - Callback al confirmar
 * @param {Function} param0.onCancel - Callback al cancelar
 * @param {boolean} [param0.loading=false] - Estado de carga para el botón de confirmación
 *
 * @returns {JSX.Element|null} - Elemento JSX del modal o null si no está abierto
 */
export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(event) => {
        // Si el click es en el backdrop (no en la caja interna), cerramos
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className='relative bg-white bg-opacity-90 rounded-lg shadow-lg 
                   w-11/12 max-w-md p-6'
      >
        {/* Botón de cierre */}
        <button
          onClick={onCancel}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer'
          aria-label='Cerrar'
        >
          <RxCross2 size={20} />
        </button>

        <h2 className='text-xl font-semibold mb-4'>{title}</h2>
        <p className='mb-6 text-gray-700'>{message}</p>
        <div className='flex justify-end space-x-4'>
          <button
            onClick={onCancel}
            className='
              px-4 py-2 
              bg-gray-200 text-gray-800 
              rounded hover:bg-gray-300 
              transition
              cursor-pointer'
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`
              px-4 py-2 
              ${!loading ? 'bg-orange-600' : 'bg-gray-400'}
              text-white 
              rounded 
              ${!loading ? 'hover:bg-orange-700' : ''}
              transition
              cursor-pointer
            `}
            disabled={loading}
            aria-label='Confirmar'
          >
            {loading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
