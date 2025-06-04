import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import Status from '../components/Expedientes/Status';
import Title from '../components/Title';
import DocumentButton from '../components/documentos/DocumentButton';
import LoadingScreen from '../components/LoadingScreen';
import CommentModal from '../components/documentos/CommentModal';
import useDetalleDocumento from '../hooks/expedientes/useDetalleDocumento';
import useRejectDocumento from '../hooks/documentos/useRejectDocumento';
import useAcceptDocumento from '../hooks/documentos/useAcceptDocumento';
import { sortComments } from '../../application/util/sortComments';
import { PERM_REQUEST_DOCUMENT_FIX } from '../../application/util/permissions';
import Permiso from '../components/Permiso';

/**
 * Componente para mostrar los detalles de un documento.
 * @returns {JSX.Element} - Componente DetalleDocumento.
 */
export default function DetalleDocumento() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    tramiteId,
    documentId,
    fileName,
    url,
    status: initialStatus,
    type,
    comentarios,
  } = state || {};

  const sortedComments = sortComments(comentarios);

  // Verificación de acceso HEAD
  const { checking, error: fetchError } = useDetalleDocumento(url);

  // Reject hook
  const {
    showCommentModal: showRejectModal,
    handleRejectButton,
    handleCommentSubmit: handleRejectSubmit,
    handleCancelComment: handleRejectCancel,
    error: rejectError,
    success: rejectSuccess,
    setLocalError: setRejectError,
    status: rejectStatus,
  } = useRejectDocumento(documentId, tramiteId, initialStatus);

  // Accept hook
  const {
    showCommentModal: showAcceptModal,
    handleAcceptButton,
    handleCommentSubmit: handleAcceptSubmit,
    handleCancelComment: handleAcceptCancel,
    error: acceptError,
    success: acceptSuccess,
    setLocalError: setAcceptError,
    status: acceptStatus,
  } = useAcceptDocumento(documentId, tramiteId, initialStatus);

  const localStatus = acceptSuccess
    ? acceptStatus
    : rejectSuccess
      ? rejectStatus
      : initialStatus;

  // Ruta directa no permitida
  if (!state || !state.url) {
    return <Navigate to='/404' replace />;
  }

  if (checking) {
    return <LoadingScreen />;
  }

  if (fetchError) {
    return (
      <section className='flex flex-col items-center bg-gray-50 p-6 min-h-screen'>
        <div className='w-full max-w-screen-lg mb-6'>
          <h1 className='text-3xl sm:text-4xl font-semibold break-words px-2'>
            {fileName}
          </h1>
        </div>
        <ErrorAlert message={fetchError} onClose={() => navigate(-1)} />
      </section>
    );
  }

  return (
    <section className='bg-gray-50 mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full lg:w-4/5 xl:w-4/5 flex flex-col min-h-screen'>
      {/* Success Alerts */}
      {rejectSuccess && (
        <SuccessAlert
          message='Documento rechazado exitosamente.'
          onClose={() => navigate(-1)}
        />
      )}
      {acceptSuccess && (
        <SuccessAlert
          message='Documento aceptado exitosamente.'
          onClose={() => navigate(-1)}
        />
      )}

      {/* Error Alerts */}
      {rejectError && (
        <ErrorAlert message={rejectError} onClose={() => setRejectError(null)} />
      )}
      {acceptError && (
        <ErrorAlert
          message={acceptError}
          onClose={() => {
            setAcceptError(null);
          }}
        />
      )}

      {/* Título */}
      <Title className='text-left mb-6'>{fileName}</Title>

      <div className='flex flex-col md:flex-row items-start justify-center space-y-6 md:space-y-0 md:space-x-6 flex-1'>
        {/* Visor */}
        <div className='w-full bg-white shadow-md rounded-lg border border-[#E5E4E2] flex-1 overflow-auto'>
          <iframe
            src={url}
            title={fileName}
            className='w-full h-full'
            style={{ border: 'none', minHeight: '90vh' }}
          />
        </div>

        {/* Sidebar */}
        <aside className='w-full md:w-1/4 flex flex-col gap-6'>
          <div className='bg-white shadow-md rounded-lg p-6 border border-[#E5E4E2]'>
            <div className='flex justify-center'>
              <Status status={localStatus} />
            </div>
            <p className='mt-4 text-base text-center'>
              <strong>Tipo:</strong> {type}
            </p>
          </div>

          {/* Revisión */}
          <Permiso permiso={PERM_REQUEST_DOCUMENT_FIX}>
            <div className='bg-white shadow-md rounded-lg p-6 border border-[#E5E4E2]'>
              <h2 className='text-2xl font-semibold mb-4'>Revisión</h2>
              <div className='flex flex-row flex-wrap gap-4 justify-center'>
                {localStatus !== 2 && (
                  <DocumentButton accion='Aceptar' onClick={handleAcceptButton} />
                )}
                {localStatus !== 1 && (
                  <DocumentButton accion='Rechazar' onClick={handleRejectButton} />
                )}
              </div>
            </div>
          </Permiso>

          {/* Comentarios */}
          <div className='bg-white shadow-md rounded-lg p-6 border border-[#E5E4E2] flex-1 overflow-auto max-h-80'>
            <h2 className='text-2xl font-semibold mb-4'>Comentarios</h2>
            {sortedComments.length ? (
              sortedComments.map((comment) => (
                <div key={comment.commentId} className='mb-4'>
                  <p className='text-lg font-semibold text-gray-800'>{comment.autor}</p>
                  <p className='text-base text-gray-600 mb-2'>{comment.date}</p>
                  <p className='text-base text-gray-700'>{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>Sin comentarios</p>
            )}
          </div>
        </aside>
      </div>

      {/* Modales de comentario */}
      <CommentModal
        isOpen={showRejectModal}
        onClose={handleRejectCancel}
        onSubmit={handleRejectSubmit}
      />
      <CommentModal
        isOpen={showAcceptModal}
        onClose={handleAcceptCancel}
        onSubmit={handleAcceptSubmit}
        allowEmpty={true}
      />
    </section>
  );
}
