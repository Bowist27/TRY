import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTramites } from '../../presentation/hooks/useTramites';
import { useTramiteDetalle } from '../../presentation/hooks/useTramiteDetalle';
import TramiteList from '../components/TramiteList';
import TramiteDetail from '../components/TramiteDetail';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../../presentation/hooks/useAuth';
import { useIniciarExpediente } from '../../presentation/hooks/useIniciarExpediente';
import ConstanciaRequiredModal from '../components/ConstanciaRequiredModal';
import { verificarRolUsuario } from '../../infrastructure/api/Archivos/constanciaApi';

/**
 * Componente de la página de Trámites.
 *
 * Muestra la lista de trámites disponibles, permite visualizar detalles
 * y, si se tiene permiso, iniciar un expediente.
 *
 * @function Tramites
 * @returns {JSX.Element}
 */
export default function Tramites() {
  const { tramites, loading: loadingTramites, error: errorTramites } = useTramites();
  const [selectedId, setSelectedId] = useState(null);
  const { detalle, error: errorDetalle } = useTramiteDetalle(selectedId);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const detailContainerReference = useRef(null);

  const {
    iniciarExpediente,
    showSuccess,
    showError,
    mensajeExito,
    errorExpediente,
    cerrarSuccess,
    cerrarError,
    tienePermiso,
  } = useIniciarExpediente();

  const [showConstanciaModal, setShowConstanciaModal] = useState(false);
  const [userRol, setUserRol] = useState(null);
  const [loadingRol, setLoadingRol] = useState(true);

  useEffect(() => {
    const fetchRol = async () => {
      if (user?.email) {
        try {
          setLoadingRol(true);
          const rolInfo = await verificarRolUsuario(user.email);
          setUserRol(rolInfo);
        } catch (error) {
          console.error('Error al obtener el rol del usuario:', error);
        } finally {
          setLoadingRol(false);
        }
      }
    };
    fetchRol();
  }, [user?.email, location.state?.timestamp]); 

  useEffect(() => {
    if (tramites.length > 0 && selectedId === null && tramites[0]?.ID_Tramite) {
      setSelectedId(tramites[0].ID_Tramite);
    }
  }, [tramites, selectedId]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile && selectedId !== null && detailContainerReference.current) {
      setTimeout(() => {
        detailContainerReference.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selectedId]);

  const handleSelect = (tramiteId) => {
    setSelectedId(tramiteId);
  };

  const handleUploadConstancia = () => {
    setShowConstanciaModal(false);
    navigate('/constancia-fiscal');
  };

  // Función para determinar si debe mostrar el botón
  const shouldShowButton = () => {
    if (loadingRol) return false; // No mostrar mientras carga el rol
    if (!userRol) return false; // Sin rol, no mostrar
    
    return userRol.idRol === 1 || userRol.idRol === 2;
  };

  // Función para manejar el clic en el botón "Iniciar trámite"
  const handleIniciarTramite = async () => {
    if (!selectedTramite) return;

    // Rol 1: Mostrar modal de constancia
    if (userRol && userRol.idRol === 1) {
      setShowConstanciaModal(true);
      return;
    }

    // Rol 2: Crear expediente directamente
    if (userRol && userRol.idRol === 2) {
      const id = await iniciarExpediente(selectedTramite.Titulo, user?.email);
      
      if (id) {
        setTimeout(() => {
          navigate(`/expedientes/${id}`);
        }, 3000);
      }
      return;
    }
  };

  const selectedTramite = tramites.find(
    (tramite) => tramite.ID_Tramite === selectedId
  );

  if (loadingTramites) {
    return <LoadingScreen />;
  }

  return (
    <>
      {showSuccess && (
        <SuccessAlert
          message={mensajeExito}
          onClose={cerrarSuccess}
        />
      )}

      {showError && (
        <ErrorAlert
          message={errorExpediente}
          onClose={cerrarError}
        />
      )}

      {showConstanciaModal && (
        <ConstanciaRequiredModal
          onClose={() => setShowConstanciaModal(false)}
          onContinue={handleUploadConstancia}
        />
      )}

      <section className='flex flex-col bg-[#F0ECE4] p-6 min-h-screen'>
        <section className='px-2 sm:px-8 flex flex-col lg:flex-row gap-6 flex-grow min-h-0 relative z-10'>
          <aside className='w-full lg:w-1/4 bg-[#fafafa] shadow-md rounded-lg p-6 flex flex-col overflow-hidden border border-[#E5E4E2] h-[95vh] justify-start'>
            <h2 className='text-4xl font-semibold text-[#D07024] mb-4'>
              Trámites disponibles
            </h2>

            {errorTramites && (
              <p className='text-gray-400'>
                Tuvimos un problema al cargar los trámites. Para más información, por
                favor contacta a la notaría.
              </p>
            )}

            {!errorTramites && (
              <div className='flex-grow flex flex-col overflow-y-auto'>
                <TramiteList
                  tramites={tramites}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              </div>
            )}
          </aside>

          <main 
            ref={detailContainerReference} 
            className='w-full lg:w-3/4 flex flex-col overflow-hidden h-[95vh] justify-start'
          >
            {selectedTramite ? (
              <TramiteDetail
                tramite={selectedTramite}
                detalle={detalle}
                errorDetalle={errorDetalle}
                tienePermiso={shouldShowButton()}
                onIniciarExpediente={handleIniciarTramite}
                userEmail={user?.email}
                loadingRol={loadingRol}
              />
            ) : (
              <div className='flex-grow flex items-center justify-center bg-[#fafafa] shadow-md rounded-lg p-6 border border-[#E5E4E2]'>
                <p className='text-gray-400 text-xl'>
                  Cargando un trámite de la lista para ver sus detalles...
                </p>
              </div>
            )}
          </main>
        </section>
      </section>
    </>
  );
}