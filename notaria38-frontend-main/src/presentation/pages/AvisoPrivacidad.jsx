import React from 'react';
import Title from '../components/Title';

/**
 * Página que muestra el Aviso de Privacidad en un PDF embebido.
 *
 * @returns {JSX.Element} Componente de la página de Aviso de Privacidad.
 */
export default function AvisoPrivacidad() {
  const pdfUrl = '/AvisoPrivacidad.pdf'; 

  return (
    <section className="flex flex-col items-center bg-[#fdf6e3] p-6 min-h-screen">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6 border border-[#E5E4E2] h-[calc(100vh-200px)]">
          <iframe
            src={pdfUrl}
            title="Aviso de Privacidad"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </section>
  );
}