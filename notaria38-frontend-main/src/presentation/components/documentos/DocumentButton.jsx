/**
 * Botón reutilizable para aceptar o rechazar documentos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {'Aceptar'|'Rechazar'} props.accion - Acción del botón.
 * @param {Function} props.onClick - Función a ejecutar al hacer clic.
 * @param {string} [props.className] - Clases adicionales.
 * @returns {JSX.Element} - Componente del botón de acción.
 */
export default function ActionButton({ accion = 'Aceptar', onClick, className = '' }) {
  const isAceptar = accion === 'Aceptar';
  const bgColor = isAceptar ? 'bg-[#D07024] hover:bg-[#C2631E] focus:ring-[#D07024]' : 
    'bg-[#B71D1D] hover:bg-[#9D070A] focus:ring-[#B71D1D] ';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${bgColor}
        text-white
        text-lg
        font-medium
        py-2
        px-3
        rounded-xl
        shadow-sm
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        cursor-pointer
        ${className}
      `}
    >
      {accion}
    </button>
  );
}