import { useState, useEffect, useRef } from 'react';
import { Info } from 'lucide-react';

/**
 * Componente de mensaje informativo con tooltip que siempre aparece abajo.
 *
 * @param {object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenido del mensaje
 * @returns {JSX.Element} Componente InfoMessage
 */
export default function InfoMessage({ children }) {
  const [showMessage, setShowMessage] = useState(false);
  const tooltipReference = useRef(null);

  useEffect(() => {
    /**
     * Función para manejar el clic fuera del tooltip.
     *
     * @param {Event} event - Evento de clic
     * @returns {void}
     */
    const handleClickOutside = (event) => {
      if (tooltipReference.current && !tooltipReference.current.contains(event.target)) {
        setShowMessage(false);
      }
    };

    if (showMessage) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMessage]);

  return (
    <div className='relative inline-block'>
      <button
        type='button'
        onClick={() => setShowMessage(!showMessage)}
        className='text-gray-600 hover:text-gray-700 transition-colors'
        aria-label='Información'
      >
        <Info className='w-6 h-6' />
      </button>

      {showMessage && (
        <div
          ref={tooltipReference}
          className='absolute z-[9999] transform top-full mt-2 left-1/2 -translate-x-1/2 
            w-64 max-w-xs p-3 bg-white rounded-md shadow-lg border border-gray-200 text-md text-gray-700 break-words'
        >
          {children}
        </div>
      )}
    </div>
  );
}
