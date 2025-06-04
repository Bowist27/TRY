import React, { useState, useEffect } from 'react';

/**
 * Componente que muestra un video de ayuda.
 * 
 * @param {object} props - Propiedades del componente.
 * @param {object} props.video - Objeto que contiene la información del video.
 * @returns {JSX.Element} Componente de tarjeta de video.
 */
export default function VideoCard({ video }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cuando cambia el video, muestra el loader solo si hay URL
    if (video?.url) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [video]);

  if (!video) {
    return (
      <div className="flex-grow text-gray-500 flex items-center justify-center">
          Selecciona un video para ver su contenido
      </div>
    );
  }

  /**
   * Función que obtiene la URL embebida del video.
   * 
   * @param {string} url - URL del video.
   * @returns {string} URL embebida del video.
   */
  const getEmbedUrl = (url) => {
    if (!url) {return '';}
    if (url.includes('drive.google.com') && url.includes('/view')) {
      return url.replace('/view', '/preview');
    }
    return url;
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">
        {video.title}
      </h2>
      <div className="flex-grow flex items-center">
        <div className="w-full aspect-video rounded-lg overflow-hidden relative">
          {loading && (
            <div 
              className="absolute inset-0 flex items-center justify-center 
                         bg-white bg-opacity-80 z-10"
            >
              <span className="text-gray-500">Cargando enlace...</span>
            </div>
          )}
          {video.url ? (
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(video.url)}
              title="Video de ayuda"
              allow="
                accelerometer; autoplay; clipboard-write; 
                encrypted-media; gyroscope; picture-in-picture
              "
              allowFullScreen
              onLoad={() => setLoading(false)}
            ></iframe>
          ) : (
            <div 
              className="
                text-red-500 flex items-center justify-center 
                w-full h-full text-center
              "
            >
              {video.message || 'Este video no tiene enlace disponible.'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}