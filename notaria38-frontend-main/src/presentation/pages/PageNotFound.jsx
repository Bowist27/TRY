import Navbar from '../components/Navbar';
import FooterInicio from '../components/Inicio/FooterInicio';

/**
 * Componente de la página de error 404 (Página no encontrada).
 * @returns {JSX.Element} - Componente que muestra un mensaje de error 404.
 */
export default function PageNotFound() {
  return (
    <div className='flex flex-col bg-[#fdf6e3] min-h-screen'>
      <Navbar />

      <main className='flex-grow flex flex-col items-center justify-center py-8 px-4 min-h-[60vh]'>
        <div className='h-20' />
        <div className='text-center max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto'>
          {/* Imagen de error */}
          <div className='mb-2'>
            <img
              src='/images/404.png'
              alt='Imagen de error 404'
              className='mx-auto w-auto max-w-full h-auto max-h-56 sm:max-h-64 md:max-h-72'
            />
          </div>
          {/* Textos */}
          <h1 className='text-2xl md:text-3xl font-bold text-[#D07024] mb-1'>
            Página no encontrada
          </h1>
          <p className='text-gray-700 text-sm md:text-base lg:text-lg'>
            Lo sentimos, la página que estás buscando no existe o no está disponible.
          </p>
        </div>
      </main>
      <FooterInicio />
    </div>
  );
}
