import CloseButton from './CloseButton';
import { useBodyScrollLock } from '../hooks/Modal/useBodyScrollLock';

/**
 * Componente de alerta de éxito como retroalimentación al usuario.
 * @param {object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar en la alerta de éxito
 * @param {Function} props.onClose - Función a ejecutar al cerrar la alerta
 * @returns {JSX.Element} - Componente de alerta de éxito
 */
const SuccessAlert = ({ message, onClose }) => {
  useBodyScrollLock(true);
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: '#00000066' }}
      role='dialog'
      aria-modal='true'
      onClick={(exa) => {
        // Cerrar el modal con click fuera
        if (exa.target === exa.currentTarget) {
          onClose();
        }
      }}
    >
      <div className='relative p-4 w-full max-w-md'>
        <div className='relative shadow-sm rounded-lg bg-green-50'>
          <CloseButton onClose={onClose} />

          <div className='p-4 md:p-5 text-center'>
            <svg
              className='mx-auto mb-4 text-green-500 w-12 h-12'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                d='
                  M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z
                  m-1.25 14.25-3.5-3.5 1.06-1.06 2.44 2.44 
                  5.44-5.44 1.06 1.06Z
                '
              />
            </svg>
            <h3 className='mb-5 text-lg font-normal text-green-800'>{message}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
