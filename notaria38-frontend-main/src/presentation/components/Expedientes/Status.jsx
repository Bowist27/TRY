import { Info } from 'lucide-react';
import { useState } from 'react';

/**
 * Tag para mostrar el estado de revisión de un archivo
 *
 * @param {string} props El estado del archivo. Puede ser
 * "pendiente", "aprobado", "rechazado" o "desconocido".
 * @returns {React.ReactNode} Un elemento div que muestra el estado del archivo.
 */
export default function Status({ status }) {
  const [showInfo, setShowInfo] = useState(false);
  const statusStyles = {
    null: '#949392', // Gris claro (Faltante)
    0: '#E1C911', // Amarillo (Pendiente)
    1: '#B71D1D', // Rojo (Rechazado)
    2: '#69A818', // Verde (Aceptado)
  };

  const statusText = {
    null: 'Faltante',
    0: 'Pendiente',
    1: 'Rechazado',
    2: 'Aceptado',
  };

  const statusInfo = {
    null: 'No se ha enviado ningún archivo. Por favor, envíelo para que pueda ser revisado.',
    0: 'El archivo ha sido recibido y está pendiente de revisión. Por favor, espere a que sea revisado.',
    1: `Por favor, revise los comentarios, elimine el archivo actual 
    y envíelo nuevamente considerando las indicaciones señaladas.`,
    2: 'El archivo ha sido aceptado. Por favor, revise los comentarios en caso de que los haya.',
  };

  /**
   * Maneja el clic en el ícono de información.
   * @param {React.MouseEvent} event - Evento de clic.
   */
  const handleInfoClick = (event) => {
    event.stopPropagation();
    setShowInfo((previous) => !previous);
  };

  /**
   * Maneja el evento de hover del mouse.
   * @returns {void}
   */
  const handleMouseEnter = () => setShowInfo(true);
  /**
   * Maneja el evento de salir del hover del mouse.
   * @returns {void}
   */
  const handleMouseLeave = () => setShowInfo(false);

  return (
    <div className='flex items-center gap-2 relative'>
      {/* Contenedor que maneja hover y click para ambos elementos */}
      <span
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleInfoClick}
        className='flex items-center cursor-pointer'
        style={{ outline: 'none' }}
      >
        <Info className='w-5 h-5 mr-1' color={statusStyles[status]} />
        <div
          className='w-fit flex items-center justify-center py-1 px-2 rounded-full text-sm text-white'
          style={{ backgroundColor: statusStyles[status] }}
        >
          <span>{statusText[status]}</span>
        </div>
        {showInfo && (
          <div
            className='absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 bg-white text-gray-800 text-xs rounded shadow-lg p-3'
            style={{ minWidth: '200px', maxWidth: '90vw' }}
          >
            {statusInfo[status]}
          </div>
        )}
      </span>
    </div>
  );
}
