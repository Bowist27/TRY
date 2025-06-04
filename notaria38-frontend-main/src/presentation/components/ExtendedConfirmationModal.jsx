// src/presentation/components/ExtendedConfirmationModal.jsx
import React from 'react';
import { RxCross2 } from 'react-icons/rx';

/**
 * Modal con 3 acciones:
 * - Cancelar
 * - Aceptar sin comentario
 * - Aceptar con comentario
 */
export default function ExtendedConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,              // acepta sin comentario
  onAcceptWithComment,    // abre modal de comentario
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        {/* Close X */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <RxCross2 size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${
              loading ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {loading ? 'Procesando…' : 'Aceptar sin comentario'}
          </button>

          <button
            onClick={onAcceptWithComment}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aceptar con comentario
          </button>
        </div>
      </div>
    </div>
  );
}
