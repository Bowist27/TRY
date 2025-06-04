// src/presentation/components/documentos/CommentModal.jsx
import { useBodyScrollLock } from '../../hooks/Modal/useBodyScrollLock';
import { useModalDragClose } from '../../hooks/Modal/useModalDragClose';
import CloseButton from '../CloseButton';
import TextInputWithLimit from '../TextInputWithLimit';
import { useState, useRef, useEffect } from 'react';

/**
 * Componente para mostrar un modal de subida de comentarios.
 * @param {object} props - Las propiedades del componente.
 * @param {boolean} props.isOpen - Indica si el modal está abierto.
 * @param {Function} props.onClose - Función para cerrar el modal.
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el comentario.
 * @param {boolean} [props.allowEmpty=false] - Permite enviar comentario vacío.
 * @returns {JSX.Element|null} - El modal de comentario o null si está cerrado.
 */
export default function CommentModal({ isOpen, onClose, onSubmit, allowEmpty = false }) {
  const [comment, setComment] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setComment('');
      setTouched(false);
      setSubmitted(false);
    }
  }, [isOpen]);

  const backdropReference = useRef(null);
  useBodyScrollLock(isOpen);
  const { handleMouseDown, handleMouseUp } = useModalDragClose(
    backdropReference,
    onClose
  );

  if (!isOpen) {
    return null;
  }

  /**
   * Maneja el evento de desenfoque del campo de comentario.
   * @returns {void}
   */
  const handleBlur = () => setTouched(true);

  /**
   * Maneja el evento de envío del formulario.
   * @returns {Promise<void>} - Envía el comentario y resetea el estado.
   */
  const handleSend = async () => {
    setSubmitted(true);
    const text = comment.trim();
    if (!allowEmpty && !text) {
      return; // sigue siendo requerido al rechazar
    }
    await onSubmit(text);
    setComment('');
    setTouched(false);
    setSubmitted(false);
  };

  // decidir si habilito el botón
  const maxLength = 255;
  const canSend = allowEmpty
    ? !submitted && comment.length <= maxLength
    : !!comment.trim() && !submitted && comment.length <= maxLength;

  // label dinámico
  const labelText = allowEmpty
    ? 'Escribe un comentario (opcional)'
    : 'Escriba un comentario';

  return (
    <div
      ref={backdropReference}
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className='relative bg-white bg-opacity-90 rounded-lg shadow-lg w-11/12 max-w-md p-6'
        onClick={(event) => event.stopPropagation()}
      >
        <CloseButton onClose={onClose} />

        <TextInputWithLimit
          inputId='comentario'
          label={labelText}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          onBlur={handleBlur}
          maxLength={maxLength}
          required={!allowEmpty}
          as='textarea'
          placeholder='Escriba su comentario aquí'
          touched={touched}
          submitted={submitted}
        />

        <div className='flex justify-end space-x-4 pt-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition'
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            className={`px-4 py-2 rounded transition text-white ${
              canSend
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!canSend}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
