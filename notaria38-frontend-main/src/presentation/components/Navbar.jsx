// src/presentation/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AvatarDropdown from './AvatarDropdown';
import NavbarLoginButton from './NavbarLoginButton';
import { Menu } from 'lucide-react';
import {
  PERM_VIEW_USERS,
  PERM_VIEW_PROCESS,
  PERM_VIEW_ACTIVE_APPLICATIONS,
  PERM_VIEW_ASSIGNED_APPLICATIONS,
  PERM_VIEW_GROUP_APPLICATIONS,
} from '../../application/util/permissions';
import { useNavbarHeight } from '../../presentation/contexts/navbarHeight';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/usuarios', label: 'Usuarios', permiso: PERM_VIEW_USERS },
  { to: '/tramites', label: 'Trámites' },
  {
    to: '/expedientes',
    label: 'Mis trámites',
    permisos: [
      PERM_VIEW_PROCESS,
      PERM_VIEW_ACTIVE_APPLICATIONS,
      PERM_VIEW_ASSIGNED_APPLICATIONS,
      PERM_VIEW_GROUP_APPLICATIONS
    ],
  },
];

/**
 * Componente Navbar que muestra el encabezado de navegación principal,
 * incluyendo enlaces condicionales según los permisos del usuario autenticado,
 * con soporte para menú colapsable en vista móvil y acceso al avatar o botón de login.
 *
 * @function Navbar
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.handleLogin - Función que se
 * ejecuta al presionar el botón de login.
 * @returns {JSX.Element} Elemento JSX que representa la barra de navegación.
 *
 * @example
 * <Navbar handleLogin={loginFunction} />
 */
export default function Navbar({ handleLogin }) {
  const { navbarReference } = useNavbarHeight();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    totpRequired,
    isTotpVerified,
    permisos,
    permisosLoading,
  } = useAuth();

  const loading = authLoading || permisosLoading;
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuReference = useRef(null);

  /**
   * Hook de efecto que cierra el menú móvil
   *  cuando se hace clic fuera del contenedor del menú.
   *
   * Este efecto agrega un listener al evento 'mousedown' en el documento solo cuando el
   * menú móvil está abierto. Si el clic ocurre
   * fuera del elemento referenciado por `menuReference`,
   * se ejecuta la función `closeMenu` para cerrar el menú. El listener se elimina
   * automáticamente cuando el componente se desmonta o cambia el estado de `isMenuOpen`.
   *
   * @function useEffect
   * @param {MouseEvent} event - Evento de clic que se verifica contra el menú.
   */
  useEffect(() => {
    /**
     * Maneja el evento de clic fuera del menú móvil.
     *
     * Si el elemento clicado no está dentro del contenedor referenciado
     * por `menuReference`, se ejecuta `closeMenu` para cerrar el menú.
     *
     * @function
     * @param {MouseEvent} event - El evento del clic del mouse.
     * @returns {void}
     */
    const handleClickOutside = (event) => {
      if (menuReference.current && !menuReference.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  /**
   * Alterna el estado del menú móvil entre abierto y cerrado.
   *
   * @function
   * @returns {void}
   */
  const toggleMenu = () => setIsMenuOpen((previous) => !previous);

  /**
   * Cierra el menú móvil estableciendo su estado como falso.
   *
   * @function
   * @returns {void}
   */
  const closeMenu = () => setIsMenuOpen(false);

  /**
   * Genera los enlaces de navegación filtrados por permisos del usuario.
   *
   * @function
   * @param {string} [className=''] - Clases CSS aplicadas a cada enlace.
   * @returns {JSX.Element[]} Lista de elementos <Link> renderizados.
   */
  const renderLinks = (className = '') =>
    /**
     * Lista de enlaces de navegación disponibles en la aplicación.
     * Cada enlace puede ser público o requerir uno o varios permisos.
     *
     * @constant {Array<object>}
     */
    navLinks.map((link) => {
      const isActive = location.pathname === link.to;
      const activeClass = isActive ? 'underline font-semibold' : '';

      // Si el usuario no está autenticado y el link requiere autenticación
      if (!isAuthenticated() && (link.permiso || link.permisos)) {
        return null;
      }

      // permiso único
      if (link.permiso) {
        if (permisosLoading || !permisos.includes(link.permiso)) {
          return null;
        }
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={`${className} ${location.pathname === link.to ? 'underline font-semibold' : ''}`}
          >
            {link.label}
          </Link>
        );
      }
      // array de permisos (solo uno requerido)
      if (link.permisos) {
        if (
          permisosLoading ||
          !link.permisos.some((permiso) => permisos.includes(permiso))
        ) {
          return null;
        }
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={`${className} ${activeClass}`}
          >
            {link.label}
          </Link>
        );
      }
      // link público
      return (
        <Link
          key={link.to}
          to={link.to}
          onClick={closeMenu}
          className={`${className} ${activeClass}`}
        >
          {link.label}
        </Link>
      );
    });

  return (
    <>
      <header
        ref={navbarReference}
        className='fixed top-0 left-0 w-full bg-gradient-to-r bg-[#D07024] text-[#F0ECE4] py-4 px-6 flex justify-between items-center z-20'
      >
        <div className='flex flex-col'>
          <span className='text-xs uppercase tracking-wider opacity-80'>
            NOTARÍAS ASOCIADAS
          </span>
          <h1 className='text-2xl font-normal'>
            38<span className='font-light text-lg'> y </span>76
          </h1>
        </div>

        {/* Menú horizontal para pantallas medianas en adelante */}
        <nav className='hidden md:block'>
          <ul className='flex space-x-10'>
            {renderLinks('hover:underline font-light text-lg')}
          </ul>
        </nav>

        {/* Botón Login / Avatar + hamburguesa en móvil */}
        <div className='flex items-center space-x-4'>
          <div className='md:hidden'>
            <button onClick={toggleMenu} aria-label='Abrir menú'>
              <Menu className='w-6 h-6' />
            </button>
          </div>
          <div>
            {isAuthenticated() ? (
              <AvatarDropdown />
            ) : (
              <NavbarLoginButton handleLogin={handleLogin} loading={loading} />
            )}
          </div>
        </div>
      </header>

      {/* Menú desplegable móvil */}
      {isMenuOpen && (
        <div
          ref={menuReference}
          className='md:hidden bg-[#D07024] text-white px-6 py-4 space-y-4 fixed top-16 right-4 w-64 rounded-lg shadow-lg z-50 border border-[#Eb9552]'
        >
          {renderLinks('block hover:underline')}
        </div>
      )}
    </>
  );
}
