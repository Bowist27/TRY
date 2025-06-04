import { useState, useCallback, useRef } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline'; 

// Tamaño máximo permitido para archivos (5MB en bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Función para obtener la extensión de un tipo MIME.
 * @param {string} mimeType - Tipo MIME del archivo.
 * @returns {string} - Extensión del archivo.
 */
const getMimeExtension = (mimeType) => {
  const mimeMap = {
    'application/pdf': '.PDF',
    'image/png': '.PNG',
    'image/jpeg': '.JPG',
    'image/jpg': '.JPG'
    // Puedes añadir más tipos MIME según sea necesario
  };

  return mimeMap[mimeType] || mimeType.split('/')[1].toUpperCase();
};

/**
 * Función para crear un área de carga de archivos.
 * Permite arrastrar y soltar archivos o seleccionarlos desde el explorador.
 * @param {*} props - Props del componente.
 * @returns {JSX.Element} - Elemento del área de carga de archivos.
 */
const FileUploadArea = ({ onFileSelect, acceptedFileType = 'application/pdf' }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputReference = useRef(null);

  // Obtener extensión amigable del tipo aceptado
  const acceptedExtension = getMimeExtension(acceptedFileType);

  /**
   * Función para manejar el cambio de archivo.
   * Valida el tipo y tamaño del archivo seleccionado.
   * @param {*} selectedFile - Archivo seleccionado.
   * @returns {void}
   */
  const handleFileChangeInternal = (selectedFile) => {
    if (selectedFile) {
      // Validar tipo de archivo
      if (selectedFile.type !== acceptedFileType) {
        setFileName('');
        onFileSelect(null);
        setError(`Solo se aceptan archivos ${acceptedExtension}. 
          El archivo seleccionado es ${getMimeExtension(selectedFile.type)}`);
        if (fileInputReference.current) {
          fileInputReference.current.value = null;
        }
        return;
      }
      
      // Validar tamaño de archivo
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileName('');
        onFileSelect(null);
        setError('El archivo es demasiado grande. El tamaño máximo permitido es 5 MB');
        if (fileInputReference.current) {
          fileInputReference.current.value = null;
        }
        return;
      }

      // Si pasa ambas validaciones
      setFileName(selectedFile.name);
      onFileSelect(selectedFile);
      setError('');
    } else {
      setFileName('');
      onFileSelect(null);
      setError('');
      if (fileInputReference.current) {
        fileInputReference.current.value = null;
      }
    }
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChangeInternal(files[0]);
      event.dataTransfer.clearData();
    }
  }, []);

  /**
   * Maneja el cambio de archivo desde el input.
   * @param {*} event - Evento de cambio de archivo.
   * @returns {void}
   */
  const handleInputChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileChangeInternal(event.target.files[0]);
    } else {
      if (!fileName) {
        handleFileChangeInternal(null);
      }
    }
  };

  /**
   * Maneja el clic en el área de carga para abrir el explorador de archivos.
   * @returns {void}
   */
  const handleClickToSelectFile = () => {
    if (fileInputReference.current) {
      fileInputReference.current.click();
    }
  };

  /**
   * Maneja el clic en el botón para limpiar el archivo seleccionado.
   * @param {*} event - Evento de clic para limpiar el archivo seleccionado.
   * @returns {void}
   */
  const handleClearFile = (event) => {
    event.stopPropagation();
    handleFileChangeInternal(null);
  };

  const dropzoneBaseClass = [
    'border-2 border-dashed rounded-lg p-6 h-auto min-h-[7rem]',
    'flex flex-col items-center justify-center cursor-pointer',
    'transition duration-150 ease-in-out'
  ].join(' ');
  const dropzoneStyle = isDraggingOver
    ? 'border-indigo-600 bg-indigo-50'
    : 'border-gray-300 hover:border-gray-400';

  // Actualizar el texto informativo para usar la extensión
  const fileTypeText = acceptedExtension.toLowerCase();

  return (
    <div className="space-y-2 w-full">
      <div
        className={`${dropzoneBaseClass} ${dropzoneStyle}`}
        onClick={handleClickToSelectFile}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => { 
          if (event.key === 'Enter' || event.key === ' ') {
            handleClickToSelectFile(); 
          }
        }}
        aria-label={fileName ? `Archivo seleccionado: ${fileName}. 
          Clic para cambiar o arrastrar nuevo archivo.` : 
          `Área para subir archivos. Clic para seleccionar o 
          arrastrar un archivo ${fileTypeText}.`}
      >
        <input
          ref={fileInputReference}
          id="fileInputInternal"
          type="file"
          accept={acceptedFileType}
          onChange={handleInputChange}
          className="hidden"
        />
        {fileName ? (
          <div className="relative flex items-center justify-between w-full pr-10 pl-2">
            <span className="flex items-center flex-grow min-w-0 max-w-[calc(100% - 4rem)] 
              truncate text-lg text-gray-700 font-medium" 
            title={fileName}>
              <DocumentTextIcon className="h-6 w-6 text-gray-500 mr-2 inline-block" />
              {fileName}
            </span>
            <button
              type="button"
              onClick={handleClearFile}
              className="absolute top-1/2 right-2 -translate-y-1/2 ml-3 flex-shrink-0 
              p-1 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 
              transition-colors duration-150 ease-in-out"
              aria-label="Quitar archivo seleccionado"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" 
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" 
              fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 
              01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 
              015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-[#D07024] hover:underline">
                Sube un archivo
              </span> o arrástralo aquí
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {fileTypeText} hasta 5MB
            </p>
          </>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-start text-sm text-red-600
         bg-red-50 p-3 rounded-md">
          <svg className="flex-shrink-0 h-5 w-5 text-red-400 mr-2" 
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" 
            fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 
            10-2 0v4a1 1 0 102 0V7zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;