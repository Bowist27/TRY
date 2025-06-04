import React from 'react';

/**
 *
 * Se utiliza para estructurar distintas secciones de landing page con un estilo uniforme.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - Título de la sección.
 * @param {React.ReactNode} props.content - Contenido principal de la sección.
 * @param {React.ReactNode} props.children - Elementos hijos adicionales (opcional).
 * @param {string} props.backgroundImage - Ruta de la imagen de fondo.
 * @param {React.ReactNode} [props.icon=null] -
 *   Icono opcional que se muestra antes del título.
 * @param {string} [props.className=''] -
 *   Clases adicionales para personalizar el contenedor.
 * @returns {JSX.Element} Sección visual con fondo e información central.
 *
 * @example
 * <SectionWithBackground
 *   title='Mi Título'
 *   content={<p>Mi contenido principal</p>}
 *   backgroundImage='/ruta/imagen.jpg'
 *   icon={<MyIcon />}
 * />
 */
export default function SectionWithBackground({
  title,
  content,
  children,
  backgroundImage,
  icon = null,
  className = '',
}) {
  return (
    <div
      className={`relative min-h-screen w-full flex items-center justify-center ${className}`}
    >
      {/* Imagen de fondo con overlay */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className='absolute inset-0 bg-gradient-to-b from-black/30 to-black/30'></div>
      </div>

      {/* Contenido */}
      <div className='relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 py-16'>
        {title && content ? (
          <div
            className='w-full rounded-lg shadow-xl p-6 md:p-8 border border-gray-200 border-opacity-20 backdrop-blur-sm'
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            {icon && (
              <div className='mb-4 flex justify-center md:justify-start'>
                <div className='p-3 rounded-full bg-orange-600 text-white inline-flex'>
                  {icon}
                </div>
              </div>
            )}
            <h2 className='text-3xl md:text-4xl font-bold mb-5 text-white'>{title}</h2>
            <div className='text-lg md:text-xl text-gray-100 leading-relaxed'>
              {content}
            </div>
          </div>
        ) : null}

        {children && <div className='mt-8'>{children}</div>}
      </div>
    </div>
  );
}
