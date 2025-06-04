// src/presentation/components/SearchBar.jsx
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Componente reutilizable de barra de búsqueda.
 * 
 * Permite capturar la entrada de texto del usuario y ejecutar una función de búsqueda.
 * La búsqueda puede activarse automáticamente con cada cambio o al presionar Enter.
 *
 * @component
 * @param {Object} props - Props del componente
 * @param {string} [props.placeholder="Buscar..."] - Texto que se 
 * muestra como sugerencia en el campo de búsqueda.
 * @param {function} props.onSearch - Función que se ejecuta al 
 * cambiar el valor o presionar Enter.
 * @returns {JSX.Element}
 * @example
 * <SearchBar placeholder="Buscar trámite..." onSearch={handleBusqueda} />
 */
const SearchBar = ({ placeholder = 'Buscar...', onSearch }) => {

  const [query, setQuery] = useState('');

  /**
   * Maneja el cambio del input y llama a la función onSearch si está definida.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del cambio en el input.
   * @returns {void}
   */
  const handleChange = e => {
    const q = e.target.value;
    setQuery(q);
    if (onSearch) {onSearch(q);}
  };

  /**
   * Llama a la función onSearch cuando se presiona la tecla Enter.
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Evento de teclado.
   * @returns {void}
   */
  const handleKeyDown = e => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-full px-6 py-3 w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="bg-transparent flex-grow outline-none text-gray-800 
                   placeholder:text-gray-500"
      />
      <FiSearch className="text-blue-900 text-xl" />
    </div>
  );
};

export default SearchBar;
