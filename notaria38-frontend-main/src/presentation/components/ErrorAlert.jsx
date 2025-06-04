import CloseButton from './CloseButton';
import { useBodyScrollLock } from '../hooks/Modal/useBodyScrollLock';

/**
 * Componente de alerta de error como retroalimentación al usuario.
 *
 * @param {object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar en la alerta de error
 * @param {Function} props.onClose - Función a ejecutar al cerrar la alerta
 * @returns {JSX.Element} - Componente de alerta de error
 */
const ErrorAlert = ({ message, onClose }) => {
  useBodyScrollLock(true);
  return (
    <div
      className='fixed inset-0 z-60 flex items-center justify-center'
      style={{ backgroundColor: '#00000066' }}
      role='dialog'
      aria-modal='true'
      onClick={(event) => {
        // Cerrar el modal con click fuera
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className='relative p-4 w-full max-w-md'>
        <div className='relative shadow-md rounded-lg bg-red-50 border border-red-300'>
          <CloseButton onClose={onClose} />

          <div className='p-4 md:p-5 text-center'>
            <svg
              className='mx-auto mb-4 w-12 h-12'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='#DC2626'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-10.46a.75.75 0 
                00-1.06-1.06L10 8.94 7.53 6.47a.75.75 0 10-1.06 1.06L8.94 10l-2.47 
                2.47a.75.75 0 101.06 1.06L10 11.06l2.47 2.47a.75.75 0 101.06-1.06L11.06 
                10l2.48-2.46z'
                clipRule='evenodd'
              />
            </svg>
            <h3 className='mb-5 text-lg font-semibold text-red-800'>{message}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
