import { FiHelpCircle } from 'react-icons/fi';

/**
 * Botón de ayuda que muestra un ícono y ejecuta una acción al hacer clic.
 *
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.onClick - Función que se ejecuta al hacer clic en 
 * el botón.
 * @returns {JSX.Element} Botón de ayuda con estilo y funcionalidad.
 */
export default function HelpButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='flex items-center justify-center rounded-full 
                bg-[#D07024] w-12 h-12 sm:w-14 sm:h-14 shadow 
                cursor-pointer transition duration-200 hover:scale-110'
      title='Ayuda'
      type='button'
    >
      <FiHelpCircle className='text-white' size={38} />
    </button>
  );
}