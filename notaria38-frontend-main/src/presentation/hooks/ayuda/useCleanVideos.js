import { useEffect } from 'react';

/**
 * Función para limpiar la selección de videos cuando el video 
 * seleccionado ya no existe.
 * @param {*} selectedVideoId - ID del video seleccionado
 * @param {*} videos - Lista de videos
 * @param {*} setSelectedVideoId - Función para actualizar el ID del 
 * video seleccionado
 */
export function useCleanVideos(
    selectedVideoId, 
    videos, 
    setSelectedVideoId
) {
    useEffect(() => {
        if (
            selectedVideoId &&
            !videos.some((video) => video.videoId === selectedVideoId)
        ) {
            setSelectedVideoId(null);
        }
    }, [selectedVideoId, videos]);
}