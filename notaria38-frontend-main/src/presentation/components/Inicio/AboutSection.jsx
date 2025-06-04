import { Users } from 'lucide-react';
import SectionWithBackground from './SectionWithBackground';
import aImage from '../../../../images/inicio/a.jpg';

/**
 * Componente de la sección "¿Quiénes somos?" de la página de inicio.
 * Presenta una breve descripción de la Notaría 38, su historia y su equipo de trabajo.
 * @returns {JSX.Element} Sección de presentación de la notaría.
 * @example
 * <AboutSection />
 */
export default function AboutSection() {
  return (
    <SectionWithBackground
      title='¿Quiénes somos?'
      content={
        <div>
          <p className='mb-4'>
            La Notaría 38 fue creada en diciembre de 2016 en Querétaro y asignada al
            Licenciado Enrique Burgos Hernández.
          </p>
          <p>Los notarios, abogados y colaboradores han conformado un sólido equipo.</p>
        </div>
      }
      backgroundImage={aImage}
      icon={<Users size={24} />}
    />
  );
}
