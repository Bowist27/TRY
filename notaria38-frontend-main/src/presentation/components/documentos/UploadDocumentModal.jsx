import { FiUpload } from 'react-icons/fi';
import CloseButton from '../CloseButton';

/**
 * Componente para subir un documento.
 * @param {*} param0 - Objeto con las propiedades del componente.
 * @param {object} param0.isOpen - Indica si el modal está abierto.
 * @param {Function} param0.setFile - Función para establecer el archivo seleccionado.
 * @param {boolean} [param0.notFileError=false] - Error por no subir un archivo.
 * @param {Function} param0.onClose - Función para cerrar el modal.
 * @param {Function} param0.onUpload - Función para manejar la subida del archivo.
 * @param {boolean} [param0.loading=false] - Indica si se está subiendo el archivo.
 * @returns {JSX.Element|null} - Modal de subida de documento o null si no está abierto.
 */
export default function UploadDocumentModal({
  isOpen,
  setFile,
  file,
  notFileError = false,
  onClose,
  onUpload,
  loading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div className='relative bg-white bg-opacity-90 rounded-lg shadow-lg w-11/12 max-w-md p-6'>
        {/* Botón de cierre */}
        <CloseButton onClose={onClose} />

        <div className='flex flex-col items-center text-center'>
          <FiUpload className='text-orange-400 text-5xl mb-4' />
          <h2 className='text-xl font-semibold mb-4'>Subir documento</h2>
          {notFileError && (
            <p className='text-red-500 mb-4'>
              Por favor, selecciona un archivo para subir.
            </p>
          )}
          <input
            type='file'
            accept='.pdf'
            className='mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100'
            onChange={({ target }) => setFile(target.files[0])}
          />

          <div className='flex justify-center space-x-4 w-full'>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition'
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className={`px-4 py-2 rounded transition text-white ${
                loading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-400 hover:bg-orange-600 cursor-pointer'
              }`}
              onClick={onUpload}
              disabled={loading || !file}
            >
              {loading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
