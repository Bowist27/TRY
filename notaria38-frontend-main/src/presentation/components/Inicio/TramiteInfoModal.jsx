import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Modal informativo sobre cómo iniciar un trámite notarial
 * @param {object} props - Props del componente
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @returns {JSX.Element|null} Modal informativo o null si está cerrado
 * @example
 * <TramiteInfoModal isOpen={isModalOpen} onClose={closeModal} />
 */
export default function TramiteInfoModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  /**
   * Navega a la página de trámites y cierra el modal.
   */
  const handleNavigateToTramites = () => {
    navigate('/tramites');
    onClose();
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 p-4'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className='bg-white bg-opacity-95 backdrop-blur-md rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>
            ¿Cómo iniciar un trámite notarial?
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 transition-colors p-1'
          >
            <X size={24} />
          </button>
        </div>

        <div className='p-6'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2'>
                <span className='bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>
                  1
                </span>
                Identifica tu necesidad
              </h3>
              <p className='text-gray-700 ml-8'>
                Determina qué trámite notarial necesitas: compraventa, testamento, poder
                notarial, constitución de sociedad, etc.
              </p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2'>
                <span className='bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>
                  2
                </span>
                Reúne la documentación
              </h3>
              <p className='text-gray-700 ml-8'>
                Prepara todos los documentos necesarios: identificaciones oficiales,
                comprobantes de domicilio, escrituras, contratos previos, etc.
              </p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2'>
                <span className='bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>
                  3
                </span>
                Inicia tu trámite
              </h3>
              <p className='text-gray-700 ml-8'>
                Selecciona e inicia el trámite que deseas realizar en nuestra página web.
              </p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2'>
                <span className='bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>
                  4
                </span>
                Carga tus documentos
              </h3>
              <p className='text-gray-700 ml-8'>
                Conoce qué documentación necesitas y cárgalos en el apartado
                correspondiente.
              </p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2'>
                <span className='bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>
                  5
                </span>
                Espera la revisión
              </h3>
              <p className='text-gray-700 ml-8'>
                Un miembro de nuestro equipo revisará tu documentación y actualizará el
                estado de tu trámite.
              </p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2'>
                <span className='bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold'>
                  6
                </span>
                Actualiza tus documentos
              </h3>
              <p className='text-gray-700 ml-8'>
                Con base en los comentarios de nuestro equipo, actualiza tus documentos si
                es necesario.
              </p>
            </div>

            <div className='bg-blue-50 bg-opacity-90 p-4 rounded-lg border border-blue-100'>
              <h4 className='text-md font-semibold text-blue-800 mb-2'>
                💡 Consejo importante:
              </h4>
              <p className='text-blue-700 text-sm text-justify'>
                Te recomendamos llamar ante cualquier duda o consulta sobre los documentos
                específicos que necesitas según tu trámite. Esto te ahorrará tiempo y que
                tu proceso sea más eficiente.
              </p>
            </div>
          </div>

          <div className='flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
            >
              Cerrar
            </button>
            <button
              onClick={handleNavigateToTramites}
              className='bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition-colors'
            >
              Ver lista de trámites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
