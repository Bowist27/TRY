import React from 'react';

/**
 * Componente de carga con spinner personalizado
 * @returns {JSX.Element} - Componente de carga
 */
const Loader = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#c66e2b]"></div>
  </div>
);

export default Loader;