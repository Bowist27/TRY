import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Navbar';
import Footer from '../Footer';
import HelpButton from '../Ayuda/HelpButton';

/**
 * Componente principal de diseño que envuelve la aplicación con un diseño
 * consistente, incluyendo un encabezado, contenido principal y pie de página.
 *
 * @returns {JSX.Element} Contenedor principal con diseño y navegación.
 */
export default function MainLayout() {
  const { user, loading, logOut } = useAuth();

  const navigate = useNavigate();

  /**
   * Redirige al usuario a la página de inicio de sesión.
   *
   * @function
   * @returns {void}
   */
  const handleLogin = () => {
    navigate('/iniciar-sesion');
  };

  /**
   * Redirige al usuario a la página de ayuda.
   *
   * @function
   * @returns {void}
   */
  const goToAyuda = () => {
    navigate('/ayuda');
  };

  /**
   * Cierra la sesión del usuario actual utilizando la función logOut.
   *
   * @function
   * @returns {void}
   */
  const handleLogout = () => {
    logOut();
  };

  return (
    <div className='bg-[#F0ECE4] text-gray-900 min-h-screen flex flex-col'>
      <Navbar
        isAuth={user}
        loading={loading}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <div className='h-20' />
      <main className='flex-1 flex flex-col'>
        <Outlet />
      </main>
      {location.pathname !== '/ayuda' && (
        <div className='fixed bottom-6 right-6 z-[100]'>
          <HelpButton onClick={goToAyuda} />
        </div>
      )}
      <Footer />
    </div>
  );
}
