import { useVerificarDatos } from '../hooks/useVerificarDatos';
import DataSection from '../components/DataSection';
import Loader from '../components/Loader';
import ActionButton from '../components/ActionButton';
import AlertsContainer from '../components/AlertsContainer';
import BackButton from '../components/BackButton';

/**
 * Componente para verificar los datos del usuario.
 * @returns {JSX.Element} - Componente de verificación de datos.
 */
const VerificarDatos = () => {
  const {
    loading,
    verificando,
    successMessage,
    errorMessage,
    datosUsuario,
    handleVerificar,
    setErrorMessage,
    handleSuccessClose // Usamos la nueva función
  } = useVerificarDatos();

  const handleSuccessCloseWithRedirect = () => {
    handleSuccessClose();

    window.location.href = '/tramites';
  };

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
    { label: 'Nombre del Municipio o Demarcación Territorial', 
      value: datosUsuario.municipio },
    { label: 'Nombre de la Entidad Federativa', value: datosUsuario.entidadFederativa },
    { label: 'Entre Calle', value: datosUsuario.entreCalle }
  ];

  return (
    <div className="min-h-screen bg-[#fdf6e3] py-8 px-4">
      <AlertsContainer 
        successMessage={successMessage}
        errorMessage={errorMessage}
        onCloseSuccess={handleSuccessCloseWithRedirect} // ✅ Usar función personalizada
        onCloseError={() => setErrorMessage('')}
      />

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <BackButton to="/constancia-fiscal" />
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Verifica que tus datos sean correctos
        </h1>
        
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataSection 
              title="Datos personales" 
              fields={datosPersonalesFields} 
            />
            
            <DataSection 
              title="Domicilio fiscal" 
              fields={domicilioFiscalFields} 
            />
            
            {/* Envolviendo el ActionButton en un div centrado */}
            <div className="flex justify-center mt-8">
              <ActionButton 
                onClick={handleVerificar}
                isLoading={verificando}
                loadingText="Verificando..."
                text="Verificar Datos"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificarDatos;