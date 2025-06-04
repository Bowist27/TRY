import React from 'react';
import PropTypes from 'prop-types';

/**
 * Botón de cierre 'X' para un modal.
 * 
 * @param {Object} props - Propiedades del componente. 
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el modal.
 * 
 * @returns {JSX.Element} - Componente de botón de cerrar.
 */
const CloseButton = ({ onClose }) => {
  return (
    <button
      type="button"
      onClick={onClose} 
      className={`absolute top-4 right-4 text-gray-400 bg-transparent 
        hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm 
        w-8 h-8 flex justify-center items-center`}
    >
      <svg
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span className="sr-only"> Cerrar modal </span>
    </button>
  );
};
CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CloseButton;