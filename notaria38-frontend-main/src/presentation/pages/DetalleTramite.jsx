// src/presentation/pages/DetalleTramite.jsx
import { useEffect, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import DataTable from '../components/DataTable';
import Title from '../components/Title';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import DocumentoList from '../components/Expedientes/DocumentoList';
import UploadDocumentModal from '../components/documentos/UploadDocumentModal';
import ConfirmationModal from '../components/ConfirmationModal';

import { useDetalleTramite } from '../hooks/expedientes/useDetalleTramite';
import { useEliminarDocumento } from '../hooks/tramites/useEliminarDocumento';
import { useSubirDocumento } from '../hooks/tramites/useSubirDocumento';
import { useAuth } from '../hooks/useAuth';
import { useBodyScrollLock } from '../hooks/Modal/useBodyScrollLock';

/**
 * Vista del detalle de un trámite
 * @returns {JSX.Element} - Componente que muestra los detalles de un trámite.
 */
export default function DetalleTramite() {
  const columns = [
    { key: 'icono', label: '' },
    { key: 'tipo', label: 'Documento' },
    { key: 'estado', label: 'Estado' },
    { key: 'comentarios', label: 'Comentarios' },
    { key: 'acciones', label: '' },
  ];

  const { id: tramiteId } = useParams();
  const {
    acceso,
    title,
    documentos,
    comentarios: comentariosData,
    loading: tramiteLoading,
    error: tramiteError,
    reload,
  } = useDetalleTramite(tramiteId);

  const { user, loading: authLoading, totpRequired, isTotpVerified } = useAuth();
  const { eliminarDocumento } = useEliminarDocumento();
  const { subirDocumento } = useSubirDocumento();
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [documentoActivo, setDocumentoActivo] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
  const [subiendoDocumento, setSubiendoDocumento] = useState(false);
  const [eliminandoDocumento, setEliminandoDocumento] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotFileError, setShowNotFileError] = useState(false);

  // Manejo de error al cargar trámites
  useEffect(() => {
    if (tramiteError) {
      setShowError(true);
      const timeout = setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [tramiteError, navigate]);

  useBodyScrollLock(modalOpen || modalEliminarOpen);

  // 1) Mientras Firebase aun carga la sesión o se carga el
  // detalle del trámite, mostramos loading
  if (authLoading || tramiteLoading) {
    return <LoadingScreen />;
  }

  // 2) Si el usuario no está autenticado, redirigimos al login (o "/" según tu lógica)
  if (!user) {
    return <Navigate to='/' replace />;
  }

  // 3) Si se requiere TOTP y aún no está verificado,
  // redirigimos a la pantalla de verificación
  if (totpRequired && !isTotpVerified) {
    return <Navigate to='/iniciar-sesion/verificar' replace />;
  }

  // 4) Si hubo un error inicial (ya mostrado más arriba), salimos con el Alert
  if (showError) {
    return <ErrorAlert message={tramiteError} />;
  }

  // 5) Si todavía no llegaron los datos de documentos/comentarios
  // o falta el título, mostramos Loading
  if (!documentos || !comentariosData || !title) {
    return <LoadingScreen />;
  }

  // Función para confirmar subida
  const handleOnConfirmSubir = async () => {
    if (!archivoSeleccionado || !documentoActivo) {
      setShowNotFileError(true);
      return;
    }

    // Si el documento no es PDF, mostramos un error
    const isFileNotPdf =
      archivoSeleccionado && !archivoSeleccionado.name.endsWith('.pdf');
    if (isFileNotPdf) {
      console.error('El archivo no es un PDF válido');
      setModalOpen(false);
      setShowNotFileError(true);
      setSuccessMessage('');
      setErrorMessage('El archivo debe ser un PDF.');
      setShowErrorAlert(true);
      setArchivoSeleccionado(null);
      return;
    }

    // Si el documento pesa más de 5MB, mostramos un error
    const isFileTooLarge =
      archivoSeleccionado && archivoSeleccionado.size > 5 * 1024 * 1024;
    if (isFileTooLarge) {
      setModalOpen(false);
      setShowNotFileError(true);
      setSuccessMessage('');
      setErrorMessage('El archivo excede el límite de tamaño permitido (5 MB).');
      setShowErrorAlert(true);
      setArchivoSeleccionado(null);
      return;
    }

    setShowNotFileError(false);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      setSubiendoDocumento(true);
      await subirDocumento({
        file: archivoSeleccionado,
        emailUsuario: user.email,
        idDocRequerido: documentoActivo.reqDocId,
        idExpediente: tramiteId,
      });

      setModalOpen(false);
      setDocumentoActivo(null);
      setArchivoSeleccionado(null);
      setSubiendoDocumento(false);

      await reload();
      setSuccessMessage('Documento subido con éxito');
      setShowSuccessAlert(true);
    } catch (err) {
      setModalOpen(false);
      setDocumentoActivo(null);
      setArchivoSeleccionado(null);
      setSubiendoDocumento(false);

      setErrorMessage(err.message || 'Error al subir el documento');
      setShowErrorAlert(true);
    }
  };

  // Función para abrir un documento
  const handleOpenDocument = (documento, comentariosDocumento) => {
    if (documento.url) {
      navigate(`/expedientes/${tramiteId}/${documento.documentId}`, {
        state: {
          tramiteId,
          ...documento,
          comentarios: comentariosDocumento,
          tramiteTitle: title,
        },
      });
    }
  };

  // Función para confirmar eliminación
  const handleOnConfirmEliminar = async () => {
    if (!documentoAEliminar) {
      setModalEliminarOpen(false);
      setDocumentoAEliminar(null);
      setErrorMessage('No se ha seleccionado ningún documento para eliminar');
      setShowErrorAlert(true);
      return;
    }

    setSuccessMessage('');
    setErrorMessage('');

    try {
      setEliminandoDocumento(true);
      await eliminarDocumento(
        documentoAEliminar.documentId,
        documentoAEliminar.url,
        tramiteId
      );
      setSuccessMessage('Documento eliminado con éxito');
      setShowSuccessAlert(true);
      await reload();
    } catch (err) {
      setErrorMessage(err.message || 'Error al eliminar el documento');
      setShowErrorAlert(true);
    } finally {
      setEliminandoDocumento(false);
      setModalEliminarOpen(false);
      setDocumentoAEliminar(null);
    }
  };

  return (
    <section className='bg-gray-50 mx-auto px-4 py-6 w-full md:w-4/5 max-w-screen-xl min-h-screen'>
      <Title>{title}</Title>

      <DataTable
        columns={columns}
        data={documentos}
        rowClassName='bg-white rounded-lg shadow border border-[#E5E4E2]'
        emptyMessage='No hay documentos registrados en este trámite.'
        renderRow={(documento, index, rowClass) => {
          const comentariosDocumento = comentariosData.filter(
            (comentario) => comentario.documentId === documento.documentId
          );

          const comentariosConFallback =
            documento.status === 0 && comentariosDocumento.length === 0
              ? [{ comment: 'Un empleado revisará tu documento' }]
              : comentariosDocumento;

          const dynamicClass = documento.url
            ? `${rowClass} transition hover:bg-orange-50 hover:shadow-md cursor-pointer`
            : rowClass;
          return (
            <DocumentoList
              key={documento.documentId || index}
              doc={documento}
              comentariosDoc={comentariosConFallback}
              acceso={acceso}
              rowClassName={dynamicClass}
              onUpload={() => {
                setDocumentoActivo(documento);
                setModalOpen(true);
              }}
              onDelete={() => {
                setDocumentoAEliminar(documento);
                setModalEliminarOpen(true);
              }}
              onClick={
                documento.url
                  ? () => handleOpenDocument(documento, comentariosDocumento)
                  : undefined
              }
            />
          );
        }}
      />

      {documentoActivo && (
        <UploadDocumentModal
          isOpen={modalOpen}
          file={archivoSeleccionado}
          setFile={setArchivoSeleccionado}
          notFileError={showNotFileError}
          onClose={() => {
            setModalOpen(false);
            setDocumentoActivo(null);
            setShowNotFileError(false);
          }}
          onUpload={handleOnConfirmSubir}
          loading={subiendoDocumento}
        />
      )}

      <ConfirmationModal
        isOpen={modalEliminarOpen}
        onCancel={() => {
          setModalEliminarOpen(false);
          setDocumentoAEliminar(null);
        }}
        onConfirm={handleOnConfirmEliminar}
        title='Eliminar Documento'
        message='¿Estás seguro de que deseas eliminar este documento?'
        loading={eliminandoDocumento}
      />

      {showSuccessAlert && (
        <SuccessAlert
          message={successMessage}
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {showErrorAlert && (
        <ErrorAlert message={errorMessage} onClose={() => setShowErrorAlert(false)} />
      )}
    </section>
  );
}
