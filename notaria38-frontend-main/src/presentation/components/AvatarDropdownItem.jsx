import PropTypes from 'prop-types';

/**
 * Componente de elemento del menú desplegable de avatar.
 * @param {*} props - Props del componente.
 * @param {string} props.label - Etiqueta del elemento.
 * @param {node} props.icon - Icono del elemento.
 * @param {Function} props.onClick - Función a ejecutar al hacer clic en el elemento.
 * @returns {JSX.Element} - Elemento del menú desplegable de avatar.
 */
export default function AvatarDropdownItem({ label, icon, onClick }) {
  return (
    <div
      key={label}
      onClick={onClick}
      className='flex items-center px-4 py-2 text-gray-800 cursor-pointer 
                 hover:text-[#bb6823]'
    >
      {icon}
      <span className='ml-2 cursor-pointer'>{label}</span>
    </div>
  );
}

AvatarDropdownItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func,
};
