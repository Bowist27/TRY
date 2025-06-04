import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import VideoList from '../components/Ayuda/VideoList';
import VideoCard from '../components/Ayuda/VideoCard';
import Title from '../components/Title';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import AgregarManualBoton from '../components/Ayuda/AgregarManualBoton';
import LoadingScreen from '../components/LoadingScreen';
import { useVideos } from '../hooks/ayuda/useVideos';
import { useCleanVideos } from '../hooks/ayuda/useCleanVideos';
import { useVideoDetalle } from '../hooks/ayuda/useVideoDetalle';

/**
 * Componente de la sección de Ayuda con lista de videos y detalle.
 *
 * @function Ayuda
 * @returns {JSX.Element} Interfaz para buscar y visualizar videos de ayuda.
 */
export default function Ayuda() {
  const [query, setQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Hook para la lista de videos
  const { videos, loading: loadingVideos, error: errorVideos, refetch } = useVideos();

  // Hook para el detalle del video seleccionado
  const {
    detalle: selectedVideo,
    loading: loadingDetalle,
    error: errorDetalle,
    refetch: refetchDetalle,
  } = useVideoDetalle(selectedVideoId);

  useCleanVideos(selectedVideoId, videos, setSelectedVideoId);

  // Filtrado por término de búsqueda
  const filteredVideos = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) {
      return videos;
    }
    return videos.filter((video) =>
      (video.title || '').toLowerCase().includes(searchTerm)
    );
  }, [query, videos]);

  return (
    <section className='flex flex-col bg-[#F0ECE4] p-6'>
      {successMessage && (
        <SuccessAlert message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
      {errorMessage && (
        <ErrorAlert message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}

      <div className='px-2 sm:px-8 flex items-center justify-between mb-2'>
        <Title>Módulo de Ayuda</Title>
        <AgregarManualBoton
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          refetchVideos={refetch}
        />
      </div>

      <section className='px-2 sm:px-8 flex flex-col lg:flex-row gap-6 flex-grow min-h-0'>
        <div className='w-full lg:w-1/3 bg-[#fafafa] shadow-md rounded-lg p-6 flex flex-col overflow-hidden border border-[#E5E4E2] h-auto lg:h-[80vh] justify-start'>
          <SearchBar placeholder='Buscar...' onSearch={setQuery} />

          {loadingVideos ? (
            <div className='p-4 text-gray-500'>Cargando videos...</div>
          ) : errorVideos ? (
            <div className='p-4 text-gray-500'>
              Tuvimos un problema al cargar los videos de ayuda. Para más información, por
              favor contacta a la notaría.
            </div>
          ) : videos.length === 0 ? (
            <div className='p-4 mt-6 text-center text-gray-500'>
              Oh no, parece que no hay información disponible.
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className='p-4 mt-6 text-center text-gray-500'>
              No encontramos resultados para la búsqueda.
            </div>
          ) : (
            <VideoList
              selectedVideoId={selectedVideoId}
              setSelectedVideoId={setSelectedVideoId}
              menuVisible={menuVisible}
              setMenuVisible={setMenuVisible}
              selectedVideo={selectedVideo}
              setSelectedVideo={() => {}}
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
              videos={filteredVideos}
              refetchVideos={refetch}
              refetchDetalle={refetchDetalle}
            />
          )}
        </div>

        <div className='flex-grow bg-[#fafafa] shadow-md rounded-lg p-6 flex flex-col overflow-hidden border border-[#E5E4E2] h-auto lg:h-[80vh] justify-start'>
          {loadingDetalle ? (
            <div className='p-4 text-gray-500'>Cargando detalle...</div>
          ) : videos.length === 0 ? (
            <div className='flex-grow text-gray-500 flex items-center justify-center'>
              Aún no hay información que mostrar.
            </div>
          ) : selectedVideoId === null ? (
            <div className='flex-grow text-gray-500 flex items-center justify-center'>
              ¿En qué te podemos ayudar? Selecciona un apartado en el cual tengas duda.
            </div>
          ) : errorDetalle ? (
            <div className='p-4 text-red-500'>{errorDetalle}</div>
          ) : (
            <VideoCard video={selectedVideo} />
          )}
        </div>
      </section>
    </section>
  );
}
