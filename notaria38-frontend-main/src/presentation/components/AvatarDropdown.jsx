import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PiSignOutBold } from 'react-icons/pi';
import { HiDocumentText } from 'react-icons/hi2';
import Avatar from './Avatar';
import AvatarDropdownItem from './AvatarDropdownItem';
import { verificarRolUsuario } from '../../infrastructure/api/Archivos/constanciaApi';
import toast from 'react-hot-toast';

/**
 * Componente que muestra un dropdown de usuario en la barra de navegación.
 * @param {boolean} highlightDropdown - Si es true,
 *  resalta el botón de "Constancia Fiscal".
 * @returns {JSX.Element} - Componente de dropdown de usuario.
 */
export default function AvatarDropdown({ highlightDropdown }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRol, setUserRol] = useState(null);
  const [loadingRol, setLoadingRol] = useState(true);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const dropdownReference = useRef(null);

  // Obtener el rol del usuario cuando el componente se monta
  useEffect(() => {
    /**
     * Función asincrónica que obtiene el rol del usuario autenticado
     * mediante su correo electrónico.
     *
     * - Establece el estado de carga (`loadingRol`) en true mientras se obtiene el rol.
     * - Llama al servicio `verificarRolUsuario` para obtener la información del rol.
     * - Actualiza el estado `userRol` con la información recibida.
     * - Maneja errores que puedan ocurrir durante la solicitud.
     * - Finaliza estableciendo `loadingRol` en false.
     *
     * @async
     * @function fetchRol
     * @returns {Promise<void>}
     */
    const fetchRol = async () => {
      if (user?.email) {
        try {
          setLoadingRol(true);
          const rolInfo = await verificarRolUsuario(user.email);
          setUserRol(rolInfo);
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
        } finally {
          setLoadingRol(false);
        }
      }
    };

    fetchRol();
  }, [user?.email]);

  /**
   * Función para manejar la apertura y cierre del dropdown.
   * @returns {void}
   */
  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Función para manejar el clic en la constancia fiscal.
   * @returns {void}
   */
  const handleConstancia = async () => {
    setIsOpen(false);
    setIsLoading(true);

    try {
      // Usar el rol que ya tenemos en lugar de hacer otra consulta
      if (userRol) {
        setIsLoading(false);

        // Rol 1: constancia-fiscal (nueva)
        if (userRol.idRol === 1) {
          navigate('/constancia-fiscal');
        }
        // Rol 2: constancia-fiscal-actualizar (actualizar existente)
        else if (userRol.idRol === 2) {
          navigate('/constancia-fiscal-actualizar');
        }
        // Fallback para otros casos
        else {
          navigate('/constancia-fiscal');
        }
      } else {
        // Si no tenemos rol, hacer consulta como fallback
        const rolInfo = await verificarRolUsuario(user.email);
        setIsLoading(false);

        if (rolInfo.success && rolInfo.tieneRolVerificado) {
          navigate('/constancia-fiscal-actualizar');
        } else {
          navigate('/constancia-fiscal');
        }
      }
    } catch (error) {
      console.error('Error al verificar el rol:', error);
      setIsLoading(false);
      // Si hay error, por defecto enviamos a la página original de constancia
      navigate('/constancia-fiscal');
    }
  };

  /**
   * Función para manejar el cierre de sesión.
   * @returns {void}
   */
  const handleSignOut = () => {
    logOut();
    toast.success('¡Nos vemos pronto!👋');
    navigate('/');
  };

  /**
   * Función para obtener las iniciales del usuario.
   * @returns {string} - Iniciales del usuario.
   * Devuelve una cadena vacía si no hay usuario o displayName.
   */
  const initials = () => {
    if (user && user.displayName) {
      return user.displayName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .slice(0, 2);
    }
    return ''; // Devuelve una cadena vacía si user o displayName no existen
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /**
     * Cierra el dropdown si se hace clic fuera de él.
     * @param {*} event - Evento de clic del mouse.
     */
    function handleClickOutside(event) {
      if (
        dropdownReference.current &&
        !dropdownReference.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line consistent-return
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Determina si se debe mostrar la opción de "Constancia Fiscal"
   * en el menú desplegable del avatar del usuario.
   *
   * @returns {boolean} - Retorna `true` si el rol del usuario es 1 o 2
   *                      y no está en estado de carga; de lo contrario, `false`.
   */
  const shouldShowConstancia = () => {
    if (loadingRol) {
      return false;
    }
    if (!userRol) {
      return false;
    }
    return userRol.idRol === 1 || userRol.idRol === 2;
  };

  return (
    <div className='relative' ref={dropdownReference}>
      <button onClick={handleOpenDropdown} className='rounded-full cursor-pointer'>
        <Avatar initials={initials()} size='w-10 h-10' />
      </button>
      {isOpen && (
        <div
          className='absolute right-0 mt-2 w-48 p-2 bg-white
          shadow-lg rounded-lg z-10'
        >
          {(user.displayName || user.email) && (
            <>
              <p className='text-md px-2 py-1 font-light text-gray-800'>
                {user.displayName || user.email}
              </p>
              <hr className='my-2 border-t border-gray-200' />
            </>
          )}

          {shouldShowConstancia() && (
            <>
              <AvatarDropdownItem
                label='Constancia Fiscal'
                icon={<HiDocumentText />}
                onClick={handleConstancia}
                className={highlightDropdown ? 'bg-yellow-300 animate-pulse' : ''}
              />
              <hr className='my-1 border-t border-gray-200' />
            </>
          )}

          <AvatarDropdownItem
            label='Cerrar sesión'
            icon={<PiSignOutBold />}
            onClick={handleSignOut}
          />
        </div>
      )}
    </div>
  );
}
