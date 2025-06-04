import React from 'react';
import {
  Scale,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';

/**
 * Componente de pie de página para la página de inicio.
 * Muestra el logotipo, enlaces a redes sociales,
 * información de contacto y derechos reservados.
 *
 * @returns {JSX.Element} Pie de página completo de la landing page.
 *
 * @example
 * <FooterInicio />
 */
const FooterInicio = () => (
  <footer className='bg-gray-900 text-gray-300 pt-16 pb-8'>
    <div className='max-w-6xl mx-auto px-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 items-start'>
        <div className='col-span-1 md:col-span-1 lg:col-span-1'>
          <div className='text-2xl font-bold text-white flex items-center mb-5'>
            <Scale className='mr-2 text-orange-500' />
            <span>Notaría 38 y 76</span>
          </div>
          <p className='mb-6 leading-relaxed'>
            Servicios notariales profesionales con la más alta calidad y seguridad
            jurídica para todas sus necesidades legales.
          </p>
          <div className='flex space-x-4'>
            <a
              href='https://www.facebook.com/notarias38y76qro/'
              className='bg-gray-800 p-2 rounded-full text-orange-400 hover:text-white hover:bg-orange-600 transition-all duration-300'
            >
              <Facebook size={20} />
              <span className='sr-only'>Facebook</span>
            </a>
            <a
              href='https://www.instagram.com/notarias38y76qro/'
              className='bg-gray-800 p-2 rounded-full text-orange-400 hover:text-white hover:bg-orange-600 transition-all duration-300'
            >
              <Instagram size={20} />
              <span className='sr-only'>Instagram</span>
            </a>
            <a
              href='https://www.linkedin.com/company/notarias38y76qro/posts/?feedView=all'
              className='bg-gray-800 p-2 rounded-full text-orange-400 hover:text-white hover:bg-orange-600 transition-all duration-300'
            >
              <Linkedin size={20} />
              <span className='sr-only'>LinkedIn</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className='text-xl font-semibold text-white mb-5 border-b border-gray-800 pb-2'>
            Contacto
          </h3>
          <address className='not-italic space-y-4'>
            <div className='flex items-start'>
              <MapPin className='text-orange-400 mr-3 mt-1 flex-shrink-0' size={18} />
              <div>
                <p>Anillo Vial Fray Junípero Serra 4422</p>
                <p>San Jerónimo, CP 76146</p>
                <p>Querétaro, México</p>
              </div>
            </div>

            <div className='flex items-center'>
              <Phone className='text-orange-400 mr-3 flex-shrink-0' size={18} />
              <p>(442) 384-2538</p>
            </div>

            <div className='flex items-center'>
              <Mail className='text-orange-400 mr-3 flex-shrink-0' size={18} />
              <a>contacto@notaria38qro.net</a>
            </div>

            <div className='flex items-center'>
              <Clock className='text-orange-400 mr-3 flex-shrink-0' size={18} />
              <p>Lun-Vie: 9:00 - 18:00</p>
            </div>
          </address>
        </div>
      </div>

      <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center'>
        <p className='text-gray-500'>
          © 2025 Notaría 38 y 76. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default FooterInicio;
