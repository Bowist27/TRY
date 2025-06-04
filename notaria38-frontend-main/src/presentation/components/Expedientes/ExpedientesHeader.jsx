import { Link } from 'react-router-dom';
import Title from '../Title';
import SearchBar from '../SearchBar';
import InfoMessage from '../InfoMessage';
import { PERM_VIEW_ACTIVE_APPLICATIONS } from '../../../application/util/permissions';

/**
 * Header component for the Expedientes page.
 * Contains the title and search bar.
 *
 * @param {object} props Component props
 * @param {Function} props.onSearch Callback function when search term changes
 * @param {string[]} props.permisos Array of user permissions
 * @returns {JSX.Element} ExpedientesHeader component
 */
export default function ExpedientesHeader({ onSearch, permisos = [] }) {
  const showTramitesMessage = permisos.includes(PERM_VIEW_ACTIVE_APPLICATIONS);

  // Construir el contenido del mensaje
  const infoContent = (
    <>
      <p>Para ver el detalle de un trámite haz clic en un elemento de la lista.</p>

      {showTramitesMessage && (
        <p className='mt-2'>
          Para iniciar un trámite haz clic en el apartado{' '}
          <Link to='/tramites' className='text-[#D07024] hover:underline'>
            Trámites
          </Link>
          .
        </p>
      )}
    </>
  );

  return (
    <div className='mb-6'>
      <div className='flex items-center gap-3'>
        <Title>Mis trámites</Title>
        <InfoMessage position='bottom'>{infoContent}</InfoMessage>
      </div>
      <div className='mt-4'>
        <SearchBar placeholder='Buscar trámite...' onSearch={onSearch} />
      </div>
    </div>
  );
}
