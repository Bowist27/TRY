// src/presentation/components/CrearManualModal.jsx
import React, { useRef, useState, useEffect } from 'react';
import { baseURL } from '../../../infrastructure/api/apiConfig';
import { useCrearManual } from '../../hooks/ayuda/useCrearManual';
import SuccessAlert from '../SuccessAlert';
import CloseButton from '../CloseButton';
import TextInputWithLimit from '../TextInputWithLimit';
import { isValidVideoURL, transformYouTubeURL } from '../../hooks/ayuda/useValidUrl';

/**
 * Modal para la creación de un nuevo manual de usuario.
 *
 * Este componente se muestra como una ventana emergente con un formulario que permite
 * ingresar un título, un enlace de YouTube o Google Drive, y asignar roles autorizados.
 * Está protegido por validaciones de campos y restricciones de enlace,
 * e incluye feedback visual.
 *
 * @param {object} props - Props del componente.
 * @param {boolean} props.isOpen - Indica si el modal debe mostrarse.
 * @param {Function} props.onClose - Función que se ejecuta para cerrar el modal.
 * @param {Function} props.setErrorMessage - Función para definir
 * el mensaje de error global.
 * @param {Function} props.refetchVideos - Función que recarga la lista
 * de videos después de agregar uno nuevo.
 * @returns {JSX.Element|null} Retorna el modal o `null` si está cerrado.
 */
export default function CrearManualModal({
  isOpen,
  onClose,
  setErrorMessage,
  refetchVideos,
}) {
  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [touchedFields, setTouchedFields] = useState({ titulo: false, videoURL: false });
  // eslint-disable-next-line no-unused-vars
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { crearManual, loading, error } = useCrearManual(refetchVideos);

  // Referencia para saber si el mouse está fuera del modal
  const backdropReference = useRef(null);

  // Estado para manejar el mouse fuera del modal
  const [mouseDownOutside, setMouseDownOutside] = useState(false);

  // Evita scroll en el fondo cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Reinicia el formulario cada vez que se abre el modal
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setTitulo('');
    setVideoURL('');
    setRoles([]);
    setValidationError('');
    setShowSuccess(false);
  }, [isOpen]);

  // Carga inicial de roles desde el backend
  useEffect(() => {
    fetch(`${baseURL}/api/roles/all`, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error cargando roles');
        }
        return response.json();
      })
      .then(setAllRoles)
      .catch(() => {
        /* Silenciar error visualmente */
      });
  }, []);

  /**
   * Alterna la selección de un rol en el formulario.
   * @param {number} rolId - ID del rol a seleccionar o deseleccionar.
   * @returns {void}
   */
  const handleCheckboxChange = (rolId) => {
    setRoles((previous) =>
      previous.includes(rolId)
        ? previous.filter((id) => id !== rolId)
        : [...previous, rolId]
    );
  };

  /**
   * Maneja el envío del formulario, validando campos y llamando a `crearManual`.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const urlToSave = transformYouTubeURL(videoURL);

    const rolesToSubmit = Array.from(new Set([5, ...roles]));

    try {
      await crearManual({ titulo, url: urlToSave, roles: rolesToSubmit });
      setShowSuccess(true);
    } catch {
      setErrorMessage(error || 'Error al crear el manual');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Formulario modal */}
      {!showSuccess && (
        <div
          ref={backdropReference}
          className='fixed inset-0 z-50 flex items-center justify-center'
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onMouseDown={(e) => {
            // Verifica si el mouse está fuera del modal
            if (e.target === backdropReference.current) {
              setMouseDownOutside(true);
            } else {
              setMouseDownOutside(false);
            }
          }}
          onMouseUp={(e) => {
            // Si se presiona mouse fuera, cierra modal
            if (mouseDownOutside && e.target === backdropReference.current) {
              onClose();
            }
            setMouseDownOutside(false);
          }}
        >
          <form
            onSubmit={handleSubmit}
            className='bg-[#efefef] rounded-lg shadow-md 
            w-full max-w-lg p-8 space-y-6 relative'
          >
            {/* Botón de cierre */}
            <CloseButton onClose={onClose} />

            {validationError && (
              <div className='text-red-700 bg-red-100 p-2 rounded'>{validationError}</div>
            )}
            {!validationError && error && (
              <div className='text-red-700 bg-red-100 p-2 rounded'>{error}</div>
            )}

            {/* Título */}
            <TextInputWithLimit
              id='titulo'
              label='Título'
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onBlur={() => setTouchedFields({ ...touchedFields, titulo: true })}
              maxLength={50}
              placeholder='Escriba el título'
              touched={touchedFields.titulo}
              required={true}
              submitted={formSubmitted}
            />

            {/* URL */}
            <TextInputWithLimit
              id='url'
              label='Enlace de video'
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              onBlur={() => setTouchedFields({ ...touchedFields, videoURL: true })}
              maxLength={200}
              placeholder='Escriba el enlace del video'
              touched={touchedFields.videoURL}
              required={true}
              submitted={formSubmitted}
            />

            <div>
              <label className='block text-gray-800 font-medium mb-2'>
                Visible para:
              </label>
              <div className='space-y-2'>
                {allRoles.map((r) => (
                  <div key={r.ID_Rol} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={r.ID_Rol === 5 || roles.includes(r.ID_Rol)}
                      disabled={r.ID_Rol === 5}
                      onChange={() => handleCheckboxChange(r.ID_Rol)}
                      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                      rounded-sm focus:ring-blue-500 ${
                        r.ID_Rol === 5 ? 'cursor-not-allowed' : ''
                      }`}
                    />
                    <label
                      htmlFor={`role-${r.Nombre}`}
                      className='
                        w-full bg-transparent py-1 placeholder-gray-400
                        focus:outline-none pl-2.5
                      '
                    >
                      {r.Nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Campos obligatorios */}
            <p className='text-xs'>
              <span className='text-red-600 font-bold'>*</span> Campos obligatorios
            </p>

            {/* Botones */}
            <div className='flex justify-center space-x-4 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='
                  bg-gray-400 text-white px-6 py-2 rounded-md 
                  hover:bg-gray-500 transition
                '
              >
                Cancelar
              </button>
              <button
                type='submit'
                className={`px-6 py-2 rounded-md transition text-white ${
                  !titulo || !videoURL
                    ? 'bg-gray-300 cursor-not-allowed' // Botón gris y deshabilitado
                    : 'bg-orange-600 hover:bg-orange-700 cursor-pointer'
                  // Botón naranja y habilitado
                }`}
                disabled={!titulo || !videoURL} // Deshabilita si los campos están vacíos
              >
                {loading ? 'Creando…' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alerta de éxito */}
      {showSuccess && (
        <SuccessAlert
          message='El manual se ha creado correctamente.'
          onClose={() => {
            onClose();
            setShowSuccess(false);
            setErrorMessage(null);
          }}
        />
      )}
    </>
  );
}
