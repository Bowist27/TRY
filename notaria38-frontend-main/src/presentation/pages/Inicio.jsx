import HeroSection from '../components/Inicio/HeroSection';
import AboutSection from '../components/Inicio/AboutSection';
import QualitySection from '../components/Inicio/QualitySection';
import SocialCommitmentSection from '../components/Inicio/SectionCommitmentSection';
import FooterInicio from '../components/Inicio/FooterInicio';

/**
 * Renders the main Inicio page with all its sections.
 * @returns {JSX.Element} The rendered Inicio page.
 */
export default function Inicio() {
  return (
    <div className='font-sans text-gray-100 bg-gray-900'>
      <HeroSection />
      <AboutSection />
      <QualitySection />
      <SocialCommitmentSection />
      <FooterInicio />
    </div>
  );
}
