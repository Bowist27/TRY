import React, { useState, useEffect } from 'react';
import { useRemoveVideo } from '../../hooks/ayuda/useManuales';
import ManualForm from '../Ayuda/ManualForm';
import OptionsMenu from '../OptionsMenu';
import ConfirmationModal from '../ConfirmationModal';
import { 
  PERM_UPDATE_USER_GUIDE,
  PERM_REMOVE_USER_GUIDE
} from '../../../application/util/permissions';
import Permisos from '../Permisos';

/**
 * Componente de lista de videos.
 * 
 * @param {*} param0 - Props del componente.
 * @returns {JSX.Element} Elemento de lista de videos.
 */
export default function VideoList({
  videos,
  selectedVideoId,
  setSelectedVideoId,
  menuVisible,
  setMenuVisible,
  setSelectedVideo,
  selectedVideo,
  setSuccessMessage,
  setErrorMessage,
  refetchVideos,
  refetchDetalle
}) {
  // Estado local para edición y confirmación
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  // Estado local para los videos (solo para edición/eliminación en UI)
  const [localVideos, setLocalVideos] = useState([]);

  // Sincroniza localVideos con el prop videos cuando cambian
  useEffect(() => {
    setLocalVideos(videos);
  }, [videos]);

  // Hook para eliminar video
  // eslint-disable-next-line no-unused-vars
  const { removeVideo, loading: removing, error: removeError } = useRemoveVideo();

  /**
   * Función para eliminar un video de la lista local.
   * @param {*} videoId - ID del video a eliminar
   * @returns {void}
   */
  const removeVideoFromLocalList = (videoId) => {
    setLocalVideos((previous) =>
      previous.filter((video) => video.videoId !== videoId)
    );

    refetchDetalle();

    if (selectedVideoId === videoId) {
      setSelectedVideoId(null);
      setSelectedVideo(null);
    }
  };

  /**
   * Función para manejar la eliminación del video.
   * @param {*} videoId - ID del video a eliminar
   * @param {*} title - Título del video a eliminar
   * @returns {Promise<void>}
   */
  const handleDelete = async (videoId, title) => {
    try {
      await removeVideo(videoId);
      removeVideoFromLocalList(videoId);
      await refetchVideos();
      setSuccessMessage && setSuccessMessage(`Video "${title}" eliminado exitosamente`);
      setErrorMessage && setErrorMessage(null);
    } catch {
      setErrorMessage &&
        setErrorMessage(
          'Hubo un error eliminando el video. ' +
          'Intente más tarde.'
        );
      setSuccessMessage && setSuccessMessage(null);
    } finally {
      setModalOpen(false);
      setPendingChange(null);
    }
  };

  /**
   * Función para manejar la actualización del video.
   * Actualiza solo el elemento editado en la lista local.
   * 
   * @param {*} updatedVideo - Video actualizado
   * @returns {void}
   */
  const handleVideoUpdate = (updatedVideo) => {
    setLocalVideos((previous) =>
      previous.map((video) =>
        video.videoId === updatedVideo.videoId
          ? {
            ...video,
            title: updatedVideo.title,
            url: updatedVideo.url
          }
          : video
      )
    );

    refetchDetalle();
  };

  /**
   * Función para cancelar la eliminación del video.
   * @returns {void}
   */
  const cancelDelete = () => {
    setModalOpen(false);
    setPendingChange(null);
  };

  /**
   * Función para manejar la edición del video.
   * @param {*} video - Video a editar
   * @returns {void}
   */
  const handleEdit = (video) => {
    const videoWithUrl = {
      ...video,
      url: selectedVideo?.videoId === video.videoId
        ? selectedVideo.url
        : video.url,
    };
    setVideoToEdit(videoWithUrl);
    setIsPopupOpen(true);
  };

  return (
    <>
      <ul className="flex-grow overflow-y-auto mt-4">
        {localVideos.map((video) => (
          <li
            key={video.videoId}
            className={`cursor-pointer p-2 rounded flex items-center justify-between
              border border-transparent hover:border-[#E5E4E2]
              ${selectedVideoId === video.videoId ? 'font-bold' : 'font-normal'}
              hover:bg-orange-50`}
            onClick={() => {
              setSelectedVideoId(video.videoId);
              setSelectedVideo(video);
              setMenuVisible(null);
            }}
          >
            <div
              className="w-full break-words max-w-sm"
            >
              {video.title}
            </div>
            <Permisos permisos={[PERM_UPDATE_USER_GUIDE, PERM_REMOVE_USER_GUIDE]}>
              <OptionsMenu
                onClick={(event) => event.stopPropagation()}
                isOpen={menuVisible === video.videoId}
                onToggle={() => {
                  setSelectedVideoId(video.videoId);
                  setMenuVisible(
                    menuVisible === video.videoId ? null : video.videoId
                  );
                }}
                onEdit={() => {
                  handleEdit(video);
                  setMenuVisible(null);
                }}
                onDelete={() => {
                  setPendingChange({ id: video.videoId, title: video.title });
                  setModalOpen(true);
                }}
                editPerm={PERM_UPDATE_USER_GUIDE}
                deletePerm={PERM_REMOVE_USER_GUIDE}
              />
            </Permisos>
          </li>
        ))}
      </ul>

      {isPopupOpen && videoToEdit && (
        <ManualForm
          mode="edit"
          videoToEdit={videoToEdit}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          setSelectedVideo={setSelectedVideo}
          refetchVideos={refetchVideos}
          onSave={handleVideoUpdate}
        />
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirmar eliminación de video"
        // eslint-disable-next-line quotes
        message={`¿Estás seguro de que deseas eliminar el video "` +
          `${pendingChange?.title}"?`}
        onConfirm={() => handleDelete(pendingChange?.id, pendingChange?.title)}
        onCancel={cancelDelete}
      />
    </>
  );
}