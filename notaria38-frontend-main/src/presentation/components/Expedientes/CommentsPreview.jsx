import { useRef, useState } from 'react';
import CloseButton from '../CloseButton';
import { useModalDragClose } from '../../hooks/Modal/useModalDragClose';
import { useBodyScrollLock } from '../../hooks/Modal/useBodyScrollLock';
import { sortComments } from '../../../application/util/sortComments';

/**
 * Componente para mostrar una vista previa de comentarios.
 *
 * @param {*} param0 - Objeto que contiene los comentarios.
 * @param {Array} param0.comentarios - Lista de comentarios a mostrar.
 * @returns {JSX.Element} - Componente de vista previa de comentarios.
 */
export default function CommentsPreview({ comentarios }) {
  const [showModal, setShowModal] = useState(false);
  const modalReference = useRef(null);

  const { handleMouseDown, handleMouseUp } = useModalDragClose(modalReference, () =>
    setShowModal(false)
  );

  useBodyScrollLock(showModal);

  const previewComentarios =
    comentarios && comentarios.length ? sortComments(comentarios).slice(0, 2) : [];

  return (
    <>
      {/* Vista previa de comentarios */}
      <div
        className='text-xs text-gray-600 cursor-pointer 
        hover:underline max-h-16 overflow-hidden'
        onClick={() => setShowModal(true)}
      >
        {comentarios?.length > 0 ? (
          previewComentarios.map((comentario, index) => {
            const comentarioPendiente =
              comentario.comment === 'Un empleado revisará tu documento';

            return (
              <div key={comentario.commentId || index} className='mb-2'>
                <p className='font-semibold truncate w-32 sm:w-40 md:w-56'>
                  {comentario.autor || ''}
                </p>
                <span className='block text-gray-500 font-light mb-1'>
                  {comentario.date || ''}
                </span>
                <p
                  className={`truncate w-32 sm:w-40 md:w-56 ${
                    comentarioPendiente ? 'text-gray-400' : ''
                  }`}
                >
                  {comentario.comment}
                </p>
              </div>
            );
          })
        ) : (
          <p className='text-gray-400'>Sin comentarios</p>
        )}
      </div>

      {/* Modal manual */}
      {showModal && (
        <div
          ref={modalReference}
          className='fixed inset-0 flex items-center 
        justify-center z-50'
          style={{ backgroundColor: '#00000066' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className='bg-white p-6 rounded-lg 
          shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto relative'
            style={{ overflowX: 'hidden' }}
          >
            {/* Botón de cierre */}
            <CloseButton onClose={() => setShowModal(false)} />

            <h2 className='text-lg font-semibold mb-4'>Comentarios</h2>

            {comentarios?.length > 0 ? (
              sortComments(comentarios).map((comentario) => (
                <div key={comentario.commentId} className='mb-3 pb-2'>
                  <p className='font-semibold break-words'>{comentario.autor}</p>
                  <p className='text-sm text-gray-500 break-words'>{comentario.date}</p>
                  <p className='pt-2 break-words whitespace-pre-line'>
                    {comentario.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>Sin comentarios</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
