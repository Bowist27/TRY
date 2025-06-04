import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Avatar que muestra la imagen de usuario o, en su defecto,
 * un ícono genérico o las iniciales del usuario.
 *
 * Muestra un spinner de carga mientras se valida la imagen.
 * Si la imagen falla al cargar, muestra iniciales o un ícono placeholder.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} [props.src] - URL de la imagen del avatar.
 * @param {string} [props.alt] - Texto alternativo para la imagen.
 * @param {string} [props.initials] - Iniciales del usuario en
 * caso de error o ausencia de imagen.
 * @param {string} [props.size='w-10 h-10'] - Tamaño del avatar
 * (usando clases de Tailwind).
 * @returns {JSX.Element} Componente visual del avatar.
 */
export default function Avatar({ src, alt, initials, size = 'w-10 h-10' }) {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica si la imagen existe
  useEffect(() => {
    if (!src) {
      setImageError(true);
      setLoading(false);
    }

    Avatar.propTypes = {
      src: PropTypes.string,
      alt: PropTypes.string,
      initials: PropTypes.string,
      size: PropTypes.string,
    };

    setImageError(false);
    setLoading(true);

    const img = new Image();
    img.src = src;
    /**
     * Evento que se dispara cuando la imagen se ha cargado exitosamente.
     *
     * Establece los estados `imageError` y `loading` a false,
     * indicando que la imagen es válida y ya no está en proceso de carga.
     *
     * @event HTMLImageElement.onload
     * @function
     */
    img.onload = () => {
      setImageError(false);
      setLoading(false);
    };
    /**
     * Evento que se dispara cuando ocurre un error al cargar la imagen.
     *
     * Establece `imageError` en true para activar el fallback (iniciales o ícono)
     * y `loading` en false para detener el spinner.
     *
     * @event HTMLImageElement.onerror
     * @function
     */
    img.onerror = () => {
      setImageError(true);
      setLoading(false);
    };
  }, [src]);

  if (loading) {
    return (
      <div
        className={`${size} flex items-center justify-center rounded-full bg-gray-200`}
      >
        <div
          className='w-5 h-5 border-2 border-gray-400 
          border-t-transparent rounded-full animate-spin'
        ></div>
      </div>
    );
  }

  if (imageError || !src) {
    // Si no hay iniciales, mostrar un icono de usuario placeholder
    if (!initials) {
      return (
        <div
          className={`relative inline-flex items-center justify-center ${size} 
          overflow-hidden bg-gray-100 rounded-full`}
        >
          <svg
            className='w-1/2 h-1/2 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      );
    }

    // Si hay iniciales, mostrarlas
    return (
      <div
        className={`relative inline-flex items-center justify-center ${size} 
          overflow-hidden bg-gray-100 rounded-full`}
      >
        <span className='font-medium text-gray-600'>{initials}</span>
      </div>
    );
  }

  return (
    <img
      className={`${size} rounded-full`}
      src={src}
      alt={alt || 'Avatar'}
      onError={() => setImageError(true)}
    />
  );
}
