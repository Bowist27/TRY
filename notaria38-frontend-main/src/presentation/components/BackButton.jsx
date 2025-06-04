import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

/**
 * Botón de regreso reutilizable para toda la aplicación.
 * 
 * @param {object} props - Propiedades del componente
 * @param {string} [props.whereTo] - Ruta específica a la que navegar (opcional)
 * @param {string} [props.text='Volver'] - Texto del botón (por defecto "Volver")
 * @param {Function} [props.onClick] - Función personalizada 
 * a ejecutar al hacer clic (opcional)
 * @param {string} [props.className] - Clases adicionales para el botón (opcional)
 * @returns {JSX.Element} - Componente de botón de regreso
 */
const BackButton = ({
  whereTo,
  text = 'Volver',
  onClick,
  className = '',
}) => {
  const navigate = useNavigate();

  /**
   * Función para manejar el clic en el botón.
   * @returns {void}
   */
  const handleClick = () => {
    if (onClick) {
      // Si hay una función onClick personalizada, la ejecutamos
      onClick();
    } else if (whereTo) {
      // Si hay una ruta específica, navegamos a ella
      navigate(whereTo);
    } else {
      // Si no, volvemos a la página anterior
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center text-[#c66e2b] hover:text-[#a95b22]
         transition-colors ${className}`}
      aria-label="Regresar"
    >
      <IoArrowBack className="mr-1" />
      <span>{text}</span>
    </button>
  );
};

export default BackButton;