import {useEffect} from 'react';
import { HiDocumentText } from 'react-icons/hi';
import { IoWarningOutline } from 'react-icons/io5';

/**
 * Componente de modal que muestra un mensaje de advertencia
 * indicando que se requiere la Constancia de Situación Fiscal
 * @param {*} props - Props del componente
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onContinue - Función para continuar con el proceso
 * @returns {JSX.Element} - Componente del modal de constancia requerida
 */
const ConstanciaRequiredModal = ({ onClose, onContinue }) => {
  // Prevenir que el body haga scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 
              10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 
              01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full bg-amber-100 flex items-center justify-center">
              <IoWarningOutline className="text-amber-600 w-12 h-12" />
            </div>
          </div>
          
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Se requiere tu Constancia Fiscal
          </h3>
          
          <p className="text-gray-600 mb-6">
            Para iniciar este trámite, primero necesitamos tu Constancia de 
            Situación Fiscal  para obtener tus datos fiscales completos y correctos.
          </p>
          
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <button
              onClick={onContinue}
              className="flex items-center justify-center gap-2 py-2.5 px-5 bg-[#c66e2b] 
              text-white rounded-lg hover:bg-[#b05e20] transition-colors font-medium"
            >
              <HiDocumentText className="w-5 h-5" /> 
              Subir Constancia Fiscal
            </button>
            
            <button
              onClick={onClose}
              className="py-2.5 px-5 bg-gray-200 text-gray-700 rounded-lg 
              hover:bg-gray-300 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstanciaRequiredModal;