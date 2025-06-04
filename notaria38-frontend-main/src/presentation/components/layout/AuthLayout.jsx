import { Outlet } from 'react-router-dom';

/**
 * Componente de diseño para la autenticación.
 * 
 * @returns {JSX.Element} Contenedor de diseño para la autenticación.
 */
export default function AuthLayout() {
  return (
    <main
      className='w-full h-screen flex flex-col items-center justify-center bg-gray-100'
    >
      <Outlet />
    </main>
  );
}
