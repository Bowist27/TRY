import PropTypes from 'prop-types';

/**
 * Componente de botón personalizado.
 * @param {*} param0 - Propiedades del componente
 * @param {string} [param0.type='button'] - Tipo de botón (submit, button, etc.)
 * @param {boolean} [param0.isPrimary=false] - Si es un botón primario
 * @param {boolean} [param0.disabled=false] - Si el botón está deshabilitado
 * @param {Function} [param0.onClick] - Función a ejecutar al hacer clic
 * @param {React.ReactNode} [param0.children] - Contenido del botón
 * @returns {JSX.Element} Componente de botón personalizado
 */
export default function CustomButton({
  type = 'button',
  isPrimary = false,
  disabled = false,
  onClick,
  children,
}) {
  const primaryClasses =
    'w-full bg-[#D07024] text-white py-2 px-4 mb-4 rounded-md ' +
    'hover:bg-[#bb6823] transition duration-200 cursor-pointer';
  const secondaryClasses =
    'w-full bg-white text-gray-700 py-2 px-4 mb-4 rounded-md ' +
    'border border-gray-300 hover:bg-gray-50 transition duration-200 ' +
    'cursor-pointer';
  const disabledClasses =
    'w-full bg-gray-400 text-white py-2 px-4 mb-4 rounded-md cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      className={
        disabled ? disabledClasses : isPrimary ? primaryClasses : secondaryClasses
      }
      disabled={disabled}
    >
      {children}
    </button>
  );
}

CustomButton.propTypes = {
  type: PropTypes.string,
  isPrimary: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
