import React from 'react';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';

/**
 * Componente contenedor para alertas de éxito y error
 * @param {string} successMessage - Mensaje de éxito
 * @param {string} errorMessage - Mensaje de error
 * @param {Function} onCloseSuccess - Función para cerrar alerta de éxito
 * @param {Function} onCloseError - Función para cerrar alerta de error
 * @returns {JSX.Element}
 */
const AlertsContainer = ({ 
  successMessage, 
  errorMessage, 
  onCloseSuccess, 
  onCloseError 
}) => (
  <>
    {successMessage && (
      <SuccessAlert message={successMessage} onClose={onCloseSuccess} />
    )}
    
    {errorMessage && (
      <ErrorAlert message={errorMessage} onClose={onCloseError} />
    )}
  </>
);

export default AlertsContainer;