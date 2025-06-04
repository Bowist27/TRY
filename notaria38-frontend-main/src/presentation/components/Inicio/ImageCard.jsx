import React from 'react';

/**
 * Componente de tarjeta de imagen con título y descripción.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.image - Ruta de la imagen a mostrar.
 * @param {string} props.title - Título de la tarjeta.
 * @param {string} props.description - Descripción de la tarjeta.
 * @returns {JSX.Element} Tarjeta de imagen informativa.
 * @example
 * <ImageCard
 *   image='/ruta/imagen.jpg'
 *   title='Responsabilidad Social'
 *   description='Descripción de la iniciativa.'
 * />
 */
export default function ImageCard({ image, title, description }) {
  return (
    <div className='rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 border border-gray-200 border-opacity-20 group bg-white/10'>
      <div className='relative'>
        <div className='w-full h-56 overflow-hidden'>
          <img
            src={image}
            alt={title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-4'>
          <h3 className='text-2xl font-bold text-white mb-1'>{title}</h3>
        </div>
      </div>
      <div className='p-6'>
        <p className='text-gray-100 text-lg'>{description}</p>
      </div>
    </div>
  );
}
