/**
 * Componente de etiqueta de Estado.
 *
 * @param {string} status - Estado recibido del api.
 * @returns {JSX.Element} - Componente de etiqueta de estado.
 */
export default function StatusBadge({ status }) {
  const config = {
    'En progreso': {
      color: 'bg-[#69A818]',
      text: 'En progreso',
      textColor: 'text-[#69A818]',
      description: 'El trámite está en curso y se están realizando acciones.',
    },
    'En revisión': {
      color: 'bg-[#204F7B]',
      text: 'En revisión',
      textColor: 'text-[#204F7B]',
      description: 'El trámite está siendo revisado por el personal correspondiente.',
    },
    'Requiere cambios': {
      color: 'bg-[#B71D1D]',
      text: 'Requiere cambios',
      textColor: 'text-[#B71D1D]',
      description: 'El trámite necesita modificaciones antes de continuar.',
    },
    Terminado: {
      color: 'bg-[#D07024]',
      text: 'Terminado',
      textColor: 'text-[#D07024]',
      description: 'El trámite ha sido completado y cerrado.',
    },
    'Sin asignar': {
      color: 'bg-[#CBB121]',
      text: 'Sin asignar',
      textColor: 'text-[#CBB121]',
      description: 'El trámite aún no tiene asignado a un encargado.',
    },
  };

  const { color, text, textColor, description } = config[status] || {
    color: 'bg-gray-300',
    text: status,
    textColor: 'text-gray-500',
    description: 'Estado desconocido',
  };

  return (
    <div className='relative group'>
      <span className='flex items-center gap-2 cursor-help'>
        <span
          className={`inline-block w-3 h-3 rounded-full ${color} flex-shrink-0`}
        ></span>
        <span className={`font-medium ${textColor}`}>{text}</span>
      </span>

      <div
        className='
          absolute left-0 bottom-full z-50 mb-2 w-64 bg-white text-gray-800 text-sm 
          rounded shadow-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity 
          duration-200 pointer-events-none'
        style={{ minWidth: '200px', maxWidth: '90vw' }}
      >
        {description}

        <div
          className='
            absolute top-full left-4 transform border-4 border-transparent border-t-white'
        ></div>
      </div>
    </div>
  );
}
