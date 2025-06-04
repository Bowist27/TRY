import { Shield, Scale, Award, Users, Info } from 'lucide-react';
import { useState } from 'react';
import SectionWithBackground from './SectionWithBackground';
import FeatureCard from './FeatureCard';
import TramiteInfoModal from './TramiteInfoModal';
import backgroundOne from '../../../../images/inicio/backgroundOne.jpg';

/**
 * Componente principal de la sección hero de la landing page.
 * @returns {JSX.Element} Sección hero principal de la página de inicio.
 * @example
 * <HeroSection />
 */
export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Abre el modal de información de trámite.
   * @returns {void}
   */
  const openModal = () => setIsModalOpen(true);
  /**
   * Cierra el modal de información de trámite.
   * @returns {void}
   */
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <SectionWithBackground
        title='La mejor experiencia notarial en todo Querétaro'
        content={
          <div>
            <p className='mb-6'>
              Servicios notariales profesionales con la más alta calidad, seguridad y
              confianza para todas sus necesidades legales.
            </p>
            <div className='flex flex-wrap gap-4 mt-8'>
              <button
                onClick={openModal}
                className='bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center gap-2'
              >
                <Info size={18} />
                ¿Cómo iniciar un trámite?
              </button>
            </div>
          </div>
        }
        backgroundImage={backgroundOne}
        icon={<Scale size={24} />}
      >
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-16'>
          <FeatureCard
            icon={<Shield size={24} />}
            title='Servicios Notariales'
            description='Ofrecemos una amplia gama de servicios notariales para todas sus necesidades legales, con total seguridad jurídica.'
          />
          <FeatureCard
            icon={<Award size={24} />}
            title='Experiencia y Confianza'
            description='Más de 20 años brindando servicios notariales de la más alta calidad y profesionalismo en Querétaro.'
          />
          <FeatureCard
            icon={<Users size={24} />}
            title='Atención Personalizada'
            description='Acompañamiento profesional durante todo el proceso notarial para su tranquilidad y satisfacción.'
          />
        </div>
      </SectionWithBackground>

      <TramiteInfoModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
