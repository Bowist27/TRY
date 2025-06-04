// ConstanciaFiscal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { enviarConstancia } from '../../infrastructure/api/Archivos/constanciaApi';
import AuthCard from '../components/auth/AuthCard';
import FileUploadArea from '../components/files/fileUploadArea';
import ActionButton from '../components/ActionButton';
import AlertsContainer from '../components/AlertsContainer';
import ErrorAlert from '../components/ErrorAlert';

/**
 * Componente para la constancia fiscal.
 * @returns {JSX.Element} - Componente de constancia fiscal.
 */
const ConstanciaFiscal = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Nuevo estado para el modal de error detallado
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  /**
   * Maneja la selección de un archivo.
   * @param {*} selectedFile - Archivo seleccionado.
   * @returns {void}
   */
  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      setError('');
    }
  };

  /**
   * Maneja el envío del formulario.
   * @param {*} event - Evento de envío del formulario.
   * @returns {void}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) {
      setError('Debes subir tu Constancia de Situación Fiscal en formato PDF.');
      return;
    }

    if (!user?.email) {
      setError('No se pudo obtener tu correo electrónico. ' +
        'Por favor, inicia sesión nuevamente.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Llamar a la API y esperar respuesta
      const response = await enviarConstancia(user.email, file);
      
      // Verificar si la respuesta contiene lo necesario para avanzar
      if (response.estado === 200 && response.datosOriginalesApiRecibidos?.datos) {
        setSuccessMessage('Constancia procesada correctamente.');
        
        // Redirigir después de un breve momento
        setTimeout(() => {
          navigate('/constancia-fiscal-verificar');
        }, 1500);
      } else {
        // Si llegamos aquí es porque la API devolvió 200 pero sin datos completos
        setErrorModalMessage('La constancia fue procesada pero no contiene todos los datos necesarios. ' +
          'Por favor, verifica que sea una constancia fiscal oficial y actualizada.');
        setShowErrorModal(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      // Mostrar mensaje de error específico en el modal
      setErrorModalMessage(error.message || 
        'Error al procesar el archivo. Por favor, verifica que sea una constancia ' +
        'fiscal oficial y actualizada.');
      setShowErrorModal(true);
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard 
      title="Constancia de Situación Fiscal" 
      description="Para poder realizar trámites, es necesario 
      validar tu información fiscal con tu constancia más reciente."
      showBackButton
      onBack={() => navigate(-1)}
    >
      <AlertsContainer 
        successMessage={successMessage}
        errorMessage={error}
        onCloseSuccess={() => setSuccessMessage('')}
        onCloseError={() => setError('')}
      />
      
      <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
        <FileUploadArea
          onFileSelect={handleFileSelected}
          acceptedFileType="application/pdf"
        />
        
        <ActionButton
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Procesando..."
          text="Continuar"
          disabled={!file || isSubmitting}
          fullWidth={true}
        />
      </form>
      
      {/* Modal de error detallado */}
      {showErrorModal && (
        <ErrorAlert 
          message={errorModalMessage} 
          onClose={() => setShowErrorModal(false)} 
        />
      )}
    </AuthCard>
  );
};

export default ConstanciaFiscal;