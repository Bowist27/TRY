import { FiMail } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

/**
 * Componente de pie de página compacto.
 * Muestra los accesos rápidos a redes sociales,
 * contacto por correo y enlace al aviso de privacidad.
 * @returns {JSX.Element} Footer compacto de la página.
 * @example
 * <Footer />
 */
export default function Footer() {
  const iconClass = [
    'w-8 h-8',
    'flex items-center justify-center',
    'rounded-md bg-[#D07024]',
    'text-white text-xl',
    'transition-colors hover:bg-[#b6591d]',
  ].join(' ');

  return (
    <footer className='bottom-0 left-0 w-full z-50 bg-gray-900'>
      <div className='flex flex-col md:flex-row items-center justify-center px-[2vw] py-[2vh] space-y-2 md:space-y-0 md:space-x-12'>
        <div className='flex items-center space-x-3'>
          <a href='mailto:contacto@notaria38qro.net' aria-label='Correo'>
            <div className={iconClass}>
              <FiMail />
            </div>
          </a>
          <a
            href='https://www.facebook.com/notarias38y76qro'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Facebook'
          >
            <div className={iconClass}>
              <FaFacebookF />
            </div>
          </a>
          <a
            href='https://www.instagram.com/notarias38y76qro/'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Instagram'
          >
            <div className={iconClass}>
              <FaInstagram />
            </div>
          </a>
          <a
            href='https://www.linkedin.com/company/notarias38y76qro/posts/?feedView=all'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='LinkedIn'
          >
            <div className={iconClass}>
              <FaLinkedinIn />
            </div>
          </a>
        </div>
        <a
          href='/aviso-privacidad'
          className='text-gray-400 text-sm hover:text-orange-600'
        >
          Aviso de privacidad
        </a>
      </div>
    </footer>
  );
}
