import { Trash2, FilePlus } from 'lucide-react';

/**
 * Componente para manejar acciones de documentos en un expediente.
 * Permite subir o eliminar documentos según el estado y acceso del usuario.
 * @param {*} param0 - Props del componente
 * @param {string} param0.acceso - Tipo de acceso del usuario (cliente o responsable).
 * @param {object} param0.documento - Objeto del documento con sus propiedades.
 * @param {Function} param0.onDelete - Función a ejecutar al eliminar el documento.
 * @param {Function} param0.onUpload - Función a ejecutar al subir un nuevo documento.
 * @returns {JSX.Element|null} - Elemento JSX de las acciones o null.
 */
export default function DocumentoActions({ acceso, documento, onDelete, onUpload }) {
  const missing = documento.status === null || documento.status === undefined;
  const canDelete = documento.status === 0 || documento.status === 1;
  const noUrl = !documento.url;

  if (noUrl || missing) {
    return (
      <button onClick={onUpload}>
        <FilePlus size={20} className='text-blue-500 cursor-pointer' />
      </button>
    );
  }

  if (canDelete) {
    return (
      <button onClick={onDelete}>
        <Trash2 size={20} className='text-red-500 cursor-pointer' />
      </button>
    );
  }

  return null;
}
