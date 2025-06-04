/**
 * Componente de botón de acción primaria
 * @param {Function} onClick - Función a ejecutar al hacer clic
 * @param {boolean} isLoading - Estado de carga
 * @param {string} loadingText - Texto a mostrar durante carga
 * @param {string} text - Texto del botón
 * @param {boolean} disabled - Si el botón está deshabilitado
 * @param {boolean} fullWidth - Si el botón debe ocupar todo el ancho disponible
 * @returns {JSX.Element} Botón de acción estilizado
 */
const ActionButton = ({ 
  onClick, 
  isLoading, 
  loadingText, 
  text,
  disabled = false,
  fullWidth = false
}) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`${fullWidth ? 'w-full' : ''} bg-[#c66e2b] text-white font-semibold py-3 px-8 rounded-md hover:bg-[#a95b22] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {isLoading ? loadingText : text}
  </button>
);

export default ActionButton;
