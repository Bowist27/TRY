import React from 'react';

/**
 * Componente reutilizable para mostrar títulos de sección.
 * Ajusta el tamaño de fuente según el ancho de pantalla para ser responsive.
 * El contenedor se ajusta al ancho del contenido.
 *
 * @param {object} props - Props del componente Title
 * @param {React.ReactNode} props.children - Título a mostrar
 * @param {string} props.className - Clases adicionales de Tailwind
 * @returns {JSX.Element} Un contenedor con el título estilizado.
 */
export default function Title({ children, className = '' }) {
  return (
    <div
      className={`inline-block bg-[#fafafa] shadow-md rounded-lg p-2 border border-[#E5E4E2] mb-4 ${className}`}
    >
      <h2 className="text-2xl sm:text-4xl font-bold text-[#D07024] break-words">
        {children}
      </h2>
    </div>
  );
}
