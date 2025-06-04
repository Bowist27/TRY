import React from 'react';

/**
 * Componente de tarjeta informativa para mostrar características o beneficios.
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.icon - Icono a mostrar en la tarjeta.
 * @param {string} props.title - Título principal de la tarjeta.
 * @param {string} props.description - Descripción del contenido de la tarjeta.
 * @returns {JSX.Element} Tarjeta de característica.
 *
 * @example
 * <FeatureCard
 *   icon={<Icon />}
 *   title='Servicio Personalizado'
 *   description='Acompañamiento profesional durante todo el proceso notarial.'
 * />
 */
export default function FeatureCard({ icon, title, description }) {
  return (
    <div className='rounded-lg p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-200 border-opacity-20 group bg-white/10'>
      <div className='mb-4 p-3 rounded-full bg-orange-600 text-white inline-flex group-hover:bg-orange-700 transition-colors duration-300'>
        {icon}
      </div>
      <h3 className='text-xl font-bold mb-3 text-white'>{title}</h3>
      <p className='text-gray-100'>{description}</p>
    </div>
  );
}
