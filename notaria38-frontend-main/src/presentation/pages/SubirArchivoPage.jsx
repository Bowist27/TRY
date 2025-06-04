import React from 'react';
import { useEnviarArchivo } from '../hooks/useEnviarArchivo';

/**
 * Página para subir un archivo PDF.
 *
 * @function SubirArchivoPage
 * @returns {JSX.Element} Formulario de carga de archivo.
 */
export default function SubirArchivoPage() {
  const { enviarArchivo, loading, error, respuesta } = useEnviarArchivo();

  /**
   * Maneja el envío del formulario de archivo.
   *
   * @param {import('react').FormEvent<HTMLFormElement>} event 
   * - Evento de envío del formulario.
   * @returns {Promise<void>} Promise que se resuelve al completar el envío.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const archivo = event.currentTarget.archivo.files[0];

    if (!archivo) {
      alert('Por favor selecciona un archivo.');
      return;
    }

    if (archivo.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF.');
      return;
    }

    await enviarArchivo(archivo);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="file"
        name="archivo"
        accept="application/pdf"
        className="border p-2 mb-2 block"
      />
      <button
        type="submit"
        className="bg-orange-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Enviando...' : 'Enviar Archivo PDF'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {respuesta && (
        <pre className="mt-2 bg-gray-200 p-2 rounded">
          {JSON.stringify(respuesta, null, 2)}
        </pre>
      )}
    </form>
  );
}
