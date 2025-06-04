import { Shield } from 'lucide-react';
import SectionWithBackground from './SectionWithBackground';
import Imageb from '../../../../images/inicio/b.jpg';

/**
 * Componente de la sección de calidad y seguridad de la página de inicio.
 * @returns {JSX.Element} Sección de calidad y seguridad de la notaría.
 * @example
 * <QualitySection />
 */
export default function QualitySection() {
  return (
    <SectionWithBackground
      title='La calidad y la seguridad son insignia de nuestra institución'
      content={
        <div>
          <p className='mb-4'>
            Nos comprometemos a proporcionar servicios notariales cumpliendo con
            requisitos legales y expectativas de nuestros clientes.
          </p>
          <p>
            Contamos con medidas de seguridad rigurosas y protocolos de confidencialidad.
          </p>
        </div>
      }
      backgroundImage={Imageb}
      icon={<Shield size={24} />}
    />
  );
}
