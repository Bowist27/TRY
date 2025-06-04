import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useVerificarDatos } from '../hooks/useVerificarDatos';
import { enviarConstancia } from '../../infrastructure/api/Archivos/constanciaApi';
import AuthCard from '../components/auth/AuthCard';
import FileUploadArea from '../components/files/fileUploadArea';
import ActionButton from '../components/ActionButton';
import DataSection from '../components/DataSection';
import Loader from '../components/Loader';
import AlertsContainer from '../components/AlertsContainer';
import BackButton from '../components/BackButton';
import ErrorAlert from '../components/ErrorAlert';

/**
 * Componente de actualización de constancia fiscal.
 * 
 * @returns {JSX.Element} - Componente de actualización de constancia fiscal.
 */
const ConstanciaFiscalActualizar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [isActualizando, setIsActualizando] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  // Estado para el modal de error detallado
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');
  
  // Usar el hook para obtener los datos actuales
  const {
    loading,
    successMessage,
    errorMessage,
    datosUsuario,
    setSuccessMessage,
    setErrorMessage,
    handleSuccessClose 
  } = useVerificarDatos();

  // Preparar datos para las secciones
  const datosPersonalesFields = [
    { label: 'Apellido Paterno', value: datosUsuario.apellidoPaterno },
    { label: 'Apellido Materno', value: datosUsuario.apellidoMaterno },
    { label: 'Nombre(s)', value: datosUsuario.nombre },
    { label: 'CURP', value: datosUsuario.curp },
    { label: 'RFC', value: datosUsuario.rfc },
    { label: 'Nombre Comercial', value: datosUsuario.nombreComercial }
  ];

  const domicilioFiscalFields = [
    { label: 'Código Postal', value: datosUsuario.codigoPostal },
    { label: 'Tipo de Vialidad', value: datosUsuario.tipoVialidad },
    { label: 'Nombre de Vialidad', value: datosUsuario.nombreVialidad },
    { label: 'Número Exterior', value: datosUsuario.numeroExterior },
    { label: 'Número Interior', value: datosUsuario.numeroInterior },
    { label: 'Nombre de la Colonia', value: datosUsuario.colonia },
    { label: 'Nombre de la Localidad', value: datosUsuario.localidad },
    { label: 'Nombre del Municipio o Demarcación Territorial', value: datosUsuario.municipio },
    { label: 'Nombre de la Entidad Federativa', value: datosUsuario.entidadFederativa },
    { label: 'Entre Calle', value: datosUsuario.entreCalle }
  ];

  /**
   * Maneja la selección de un archivo.
   * @param {*} selectedFile - Archivo seleccionado.
   * @returns {void}
   */
  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      setErrorMessage('');
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
      setErrorMessage('Debes subir tu Constancia de Situación Fiscal en formato PDF.');
      return;
    }

    if (!user?.email) {
      setErrorMessage(
        'No se pudo obtener tu correo electrónico. ' +
        'Por favor, inicia sesión nuevamente.'
      );
      return;
    }

    setIsActualizando(true);

    try {
      await enviarConstancia(user.email, file);
      setSuccessMessage('Constancia actualizada correctamente. ' +
        'En breve se actualizarán tus datos.');
      navigate('/constancia-fiscal-verificar');
    } catch (error) {
      console.error('Error al enviar la constancia:', error);
      // Mostrar el error detallado en el modal
      setErrorModalMessage(error.message || 'Error al subir el archivo. Intenta de nuevo.');
      setShowErrorModal(true);
    } finally {
      setIsActualizando(false);
    }
  };

  // Mostrar datos actuales
  if (!showUpload) {
    return (
      <div className="min-h-screen bg-[#fdf6e3] py-8 px-4">
        <AlertsContainer 
          successMessage={successMessage}
          errorMessage={errorMessage}
          onCloseSuccess={handleSuccessClose} // Usar la nueva función
          onCloseError={() => setErrorMessage('')}
        />

        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <BackButton to="/" />
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Tus Datos Fiscales
          </h1>
          
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor"
                      viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 
                      0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 
                      1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Tu constancia fiscal está verificada. 
                      Estos son los datos que tenemos registrados.
                    </p>
                  </div>
                </div>
              </div>
              
              <DataSection 
                title="Datos personales" 
                fields={datosPersonalesFields} 
              />
              
              <DataSection 
                title="Domicilio fiscal" 
                fields={domicilioFiscalFields} 
              />
              
              <div className="flex justify-center mt-8">
                <ActionButton 
                  onClick={() => setShowUpload(true)}
                  isLoading={false}
                  text="Actualizar mi Constancia Fiscal"
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
  
  // Mostrar formulario de actualización con formato AuthCard
  return (
    <AuthCard
      title="Actualizar Constancia de Situación Fiscal"
      description="Con esta actualización, modificaremos tus datos fiscales."
      showBackButton
      onBack={() => setShowUpload(false)}
    >
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>
      )}
      <form onSubmit={(event) => event.preventDefault()} className="space-y-6">        
        <FileUploadArea
          onFileSelect={handleFileSelected}
          acceptedFileType="application/pdf"
        />
        <ActionButton
          onClick={handleSubmit}
          isLoading={isActualizando}
          loadingText="Procesando..."
          text="Actualizar constancia"
          disabled={!file}
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

export default ConstanciaFiscalActualizar;