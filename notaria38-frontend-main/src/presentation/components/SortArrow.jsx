import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

/**
 * Componente para ordenar columnas en una tabla.
 *
 * @param {Object} props - Props del componente.
 * @param {string} props.direction - Dirección de la flecha.
 * @param {string} props.className - Clases CSS adicionales.
 * @returns {JSX.Element} - Componente de flecha de ordenación.
 */
export default function SortArrow({ direction = 'descending', className = '' }) {
  const iconSize = 28;
  return (
    <span className={className} aria-hidden='true'>
      {direction === 'descending'
        ? <HiChevronDown size={iconSize} />
        : <HiChevronUp size={iconSize} />
      }
    </span>
  );
}
