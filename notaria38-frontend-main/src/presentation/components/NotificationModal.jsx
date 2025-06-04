// src/presentation/components/NotificationModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function NotificationModal({
  isOpen,
  title,
  message,
  onClose,
  onlyCloseButton = false,  // <-- nueva prop
}) {
  if (!isOpen) {return null;}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Botón de cerrar (tache) */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Contenido */}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>

        {/* Si no soloCloseButton, renderiza los botones de acción */}
        {!onlyCloseButton && (
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
