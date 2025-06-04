import React, { useRef, useEffect, useState } from 'react';
import { useManualForm } from '../../hooks/ayuda/useManualForm';
import CloseButton from '../CloseButton';
import TextInputWithLimit from '../TextInputWithLimit';
import { useManualFormSubmit } from '../../hooks/ayuda/useManualFormSubmit';
import { useBodyScrollLock } from '../../hooks/Modal/useBodyScrollLock';

/**
 * Componente de formulario para crear o editar un video.
 * 
 * @param {object} props - Propiedades del componente.
 * @param {string} props.mode - Modo del formulario ('create' o 'edit').
 * @param {string} props.videoToEdit - ID del video a editar.
 * @param {boolean} props.isOpen - Estado de apertura del modal.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onSave - Función para manejar el guardado del video.
 * @param {Function} props.setSuccessMessage - Función para establecer el mensaje 
 * de éxito.
 * @param {Function} props.setErrorMessage - Función para establecer el mensaje de error.
 *  
 * @param {Function} props.refetchVideos - Función para recargar la lista de videos.
 * @returns {JSX.Element} - Componente del formulario de video.
 */
const ManualForm = ({ 
  mode,
  videoToEdit,
  isOpen, 
  onClose,
  onSave,
  setSuccessMessage,
  setErrorMessage,
  refetchVideos
}) => {

  // Hook para previsualizar datos del video al modificar
  const {
    title, setTitulo,
    videoURL, setVideoURL,
    allRoles,
    selectedRoles, setSelectedRoles,
    loading,
    error
  } = useManualForm(videoToEdit, mode);

  // Referencia para saber si el mouse está fuera del modal
  const backdropReference = useRef(null);

  // Estado para manejar el mouse fuera del modal
  const [mouseDownOutside, setMouseDownOutside] = useState(false);

  // Manejo del mensaje de error
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error, setErrorMessage]);

  useBodyScrollLock(isOpen);

  const [touchedFields, setTouchedFields] = useState({ title: false, videoURL: false });
  // eslint-disable-next-line no-unused-vars
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = useManualFormSubmit({
    videoToEdit,
    setErrorMessage,
    setSuccessMessage,
    refetchVideos,
    onSave,
    onClose,
    setTitulo,
    setVideoURL,
    setSelectedRoles,
    selectedRoles,
    title,
    videoURL,
    mode,
    allRoles
  });

  if (!isOpen || loading) {return null;}

  return (
    <div 
      ref={backdropReference}
      className="fixed inset-0 flex items-center justify-center z-50 overflow-auto" 
      style={{ backgroundColor: '#00000066' }}
      onMouseDown={event => {
        // Verifica si el mouse está fuera del modal
        if (event.target === backdropReference.current) {
          setMouseDownOutside(true);
        } else {
          setMouseDownOutside(false);
        }
      }}
      onMouseUp={event => {
        // Si se presiona mouse fuera, cierra modal
        if (mouseDownOutside && event.target === backdropReference.current) {
          onClose();
        }
        setMouseDownOutside(false);
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="
          bg-[#efefef] rounded-lg shadow-md w-full 
          max-w-lg p-6 space-y-6 relative
          max-h-[80vh] overflow-auto
        "
      >

        {/* Botón de cierre */}
        <CloseButton onClose={onClose} />

        {/* Título */}
        <TextInputWithLimit
          id="titulo"
          label="Título"
          value={title}
          onChange={(event) => setTitulo(event.target.value)}
          onBlur={() => setTouchedFields({ ...touchedFields, title: true })}
          maxLength={50}
          placeholder="Escriba el título"
          touched={touchedFields.title}
          required={true}
          submitted={formSubmitted}
        />

        {/* URL */}
        <TextInputWithLimit
          id="url"
          label="Enlace de video"
          value={videoURL}
          onChange={(event) => setVideoURL(event.target.value)}
          onBlur={() => setTouchedFields({ ...touchedFields, videoURL: true })}
          maxLength={200}
          placeholder="Escriba el enlace del video"
          touched={touchedFields.videoURL}
          required={true}
          submitted={formSubmitted}
        />

        {/* Checkboxes de Roles */}
        <div>
          <label className="block text-gray-800 font-medium mb-2">Visible para:</label>
          <div className="space-y-2">
            {allRoles
              .slice() // Copia del array
              .sort((firstRole, secondRole) => 
                firstRole.Nombre.localeCompare(secondRole.Nombre)) // Orden alfabético
              .map((role) => (
                <div key={role.Nombre} className="flex items-center">
                  <input
                    id={`role-${role.Nombre}`}
                    type="checkbox"
                    value={role.Nombre}
                    checked={
                      role.roleId === 5 ? true : selectedRoles.includes(role.Nombre)
                    }
                    disabled={role.roleId === 5} // Administrador inhabilitado
                    onChange={(event) => {
                      if (event.target.checked) {
                        // Agrega el rol seleccionado
                        setSelectedRoles([...selectedRoles, role.Nombre]);
                      } else {
                        // Elimina el rol deseleccionado
                        setSelectedRoles(selectedRoles.filter(
                          (roleName) => roleName !== role.Nombre)
                        );
                      }
                    }}
                    className={`w-4 h-4 text-blue-600 bg-gray-100 
                        border-gray-300 rounded-sm focus:ring-blue-500 ${
                role.id === 5 ? 'cursor-not-allowed' : ''
                }`} 
                  />
                  <label
                    htmlFor={`role-${role.Nombre}`}
                    className="
                      w-full bg-transparent py-1 
                      placeholder-gray-400 focus:outline-none pl-2.5
                    "
                  >
                    {role.Nombre}
                  </label>
                </div>
              ))}
          </div>
        </div>

        {/* Campos obligatorios */}
        <p className="text-xs">
          <span className="text-red-600 font-bold">*</span> Campos obligatorios 
        </p>

        {/* Botones */}
        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="
              bg-gray-400 text-white px-6 py-2 
              rounded-md hover:bg-gray-500 transition
            "
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md transition text-white ${
              !title || !videoURL 
                ? 'bg-gray-300 cursor-not-allowed' // Botón gris y deshabilitado
                : 'bg-orange-600 hover:bg-orange-700 ' + 
                  'cursor-pointer' // Botón naranja y habilitado
            }`}
            disabled={!title || !videoURL} // Deshabilita si los campos están vacíos
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualForm;
