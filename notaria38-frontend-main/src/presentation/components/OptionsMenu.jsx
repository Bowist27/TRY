import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import Permiso from './Permiso';
import ReactDOM from 'react-dom';
/**
 * Componente de menú de opciones (editar y eliminar)
 * 
 * @param {object} props - Propiedades del componente 
 * @param {Function} props.onEdit - Función a ejecutar al hacer clic en "Editar"
 * @param {Function} props.onDelete - Función a ejecutar al hacer clic en "Eliminar"
 * @param {boolean} props.isOpen - Estado del menú (abierto o cerrado)
 * @param {Function} props.onToggle - Función para alternar el estado del menú
 * @param {boolean} props.editPerm - Permiso para editar (no utilizado actualmente)
 * @param {boolean} props.deletePerm - Permiso para eliminar (no utilizado actualmente)
 * 
 * @returns {JSX.Element} - Componente de menú de opciones
 */
export default function OptionsMenu({
  onEdit,
  onDelete,
  isOpen,
  onToggle,
  editPerm,
  deletePerm,
}) {
  // Referencias del botón y el menú
  const buttonReference = useRef();
  const menuReference = useRef();

  // Estado para la posición del menú
  const [position, setPosition] = useState({ top: 0, left: 0 });
  // Estado para saber si está listo para mostrarse
  const [, setReady] = useState(false);

  /**
   * Efecto para manejar el clic fuera del menú
   * y cerrar el menú si está abierto
   */
  useEffect(() => {
    /**
     * Maneja el clic fuera del menú
     * @param {*} event - Evento de clic
     */
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !menuReference.current?.contains(event.target) &&
        !buttonReference.current?.contains(event.target)
      ) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  /**
   * Efecto para calcular la posición del menú
   * y mostrarlo hasta que esté listo
   */
  useEffect(() => {
    if (isOpen && buttonReference.current && menuReference.current) {
      const rect = buttonReference.current.getBoundingClientRect();
      const menuWidth = menuReference.current.offsetWidth;
      
      // Tres puntos quedan en la esquina superior derecha
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - menuWidth,
      });

      // Listo para mostrarse
      setReady(true);

    } else {
      setReady(false);
    }
  }, [isOpen]);

  return (
    <>
      <div ref={buttonReference}>
        <MoreVertical
          size={16}
          className="cursor-pointer"
          onClick={event => {
            event.stopPropagation();
            onToggle();
          }}
        />
      </div>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={menuReference}
            className="absolute bg-[#fafafa] shadow-md rounded-lg p-2 z-50"
            style={{ top: position.top, left: position.left }}
          >
            <Permiso permiso={editPerm}>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm 
                text-gray-700 hover:bg-gray-100 font-normal"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4 mr-2 text-blue-500" />
                Editar
              </button>
            </Permiso>

            <Permiso permiso={deletePerm}>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm
                 text-gray-700 hover:bg-gray-100 font-normal"
                onClick={() => {
                  onDelete();
                  onToggle();
                }}
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                Eliminar
              </button>
            </Permiso>
          </div>,
          document.body
        )}
    </>
  );
};

// Valida los propTypes del componente
OptionsMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};