import { Users } from 'lucide-react';
import SectionWithBackground from './SectionWithBackground';
import ImageCard from './ImageCard';
import cImage from '../../../../images/inicio/c.jpg';
import dImage from '../../../../images/inicio/d.jpg';
import damasImage from '../../../../images/inicio/e.png';

/**
 * Componente de la sección de compromiso social de la página de inicio.
 * @returns {JSX.Element} Sección de compromiso social de la notaría.
 * @example
 * <SocialCommitmentSection />
 */
export default function SocialCommitmentSection() {
  return (
    <SectionWithBackground
      title='Compromiso social'
      content={
        <p>
          Desde las Notarías 38 y 76 de Querétaro, asumimos la importancia de retribuir a
          la comunidad
        </p>
      }
      backgroundImage={cImage}
      icon={<Users size={24} />}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
        <ImageCard
          image={dImage}
          title='Iniciativas Sociales'
          description='Nuestra colaboración con Damas Azules busca fortalecer redes de apoyo...'
        />
        <ImageCard
          image={damasImage}
          title='Responsabilidad Social'
          description='Nuestro respaldo a Damas Azules refleja nuestro compromiso ético...'
        />
      </div>
    </SectionWithBackground>
  );
}
