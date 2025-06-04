import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/index';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AuthCard from '../components/auth/AuthCard';

/**
 * Página de recuperación de contraseña.
 *
 * @function RecuperarContrasenaNew
 * @returns {JSX.Element} Componente de recuperación de contraseña.
 */
export default function RecuperarContrasenaNew() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const SUCCESS_MESSAGE =
    'Si existe una cuenta con ese correo electrónico y permite recuperar contraseña, te hemos enviado un enlace para restablecerla. Revisa tu bandeja de entrada o correo no deseado.';

  /**
   * Establece un mensaje de éxito y actualiza el estado.
   *
   * @param {string} message - Mensaje de éxito a mostrar.
   * @returns {void}
   */
  const sendSuccessMessage = (message) => {
    // Resetea el mensaje de error si estaba presente
    setError(false);

    // Establece el mensaje de éxito y actualiza el estado
    setMensaje(message);
    setSuccess(true);
    setError(false);
  };

  /**
   * Establece un mensaje de error y actualiza el estado.
   *
   * @param {string} message - Mensaje de error a mostrar.
   * @returns {void}
   */
  const sendErrorMessage = (message) => {
    // Resetea el mensaje de éxito si estaba presente
    setSuccess(false);

    // Establece el mensaje de error y actualiza el estado
    setMensaje(message);
    setError(true);
  };

  /**
   * Verifica si se puede enviar el formulario.
   * @returns {boolean} - Indica si se puede enviar el formulario.
   */
  const canSend = () => {
    return !isSubmitting && cooldown <= 0;
  };

  /**
   * Maneja el envío del formulario de recuperación de contraseña.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Evento de envío.
   * @returns {Promise<void>} Promise tras intentar enviar el email.
   */
  const handleRecuperar = async (event) => {
    event.preventDefault();

    // Verifica si el email es válido
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      sendErrorMessage('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // Verifica si se puede enviar el formulario
    if (!canSend()) {
      sendErrorMessage(
        'Por favor, espera antes de volver a enviar el correo de recuperación.'
      );
      return;
    }
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      sendSuccessMessage(SUCCESS_MESSAGE);
      // Iniciar cooldown de 60 segundos
      setCooldown(60);
    } catch (authError) {
      if (authError.code === 'auth/invalid-email') {
        sendErrorMessage('El correo electrónico ingresado no es válido.');
      } else if (authError.code === 'auth/user-not-found') {
        // No revelamos si el usuario existe o no por seguridad
        sendSuccessMessage(SUCCESS_MESSAGE);
        // Iniciar cooldown de 60 segundos
        setCooldown(60);
      } else {
        sendErrorMessage('Ha ocurrido un error. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Navega a la pantalla de iniciar sesión.
   *
   * @returns {void}
   */
  const handleBack = () => {
    navigate('/iniciar-sesion');
  };

  useEffect(() => {
    setError(null);
  }, []);

  // useEffect para manejar el cooldown
  useEffect(() => {
    let interval;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((previous) => previous - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <AuthCard
      title='Recuperar contraseña'
      description='Te enviaremos un enlace para restablecer tu contraseña.'
      showBackButton
      onBack={handleBack}
    >
      {mensaje && success && (
        <div
          className='mb-4 p-3 rounded-lg bg-green-100 border \
            border-green-400 text-green-700'
        >
          {mensaje}
        </div>
      )}

      {mensaje && error && (
        <div
          className='mb-4 p-3 rounded-lg bg-red-100 border \
            border-red-400 text-red-700'
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleRecuperar}>
        <CustomInput
          name='email'
          id='email'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder='pixel.it.mx@gmail.com'
        >
          Correo electrónico
        </CustomInput>
        <CustomButton
          type='submit'
          isPrimary={true}
          disabled={!canSend()}
          onClick={handleRecuperar}
        >
          {isSubmitting
            ? 'Enviando...'
            : success || cooldown > 0
              ? cooldown > 0
                ? `Volver a enviar (${cooldown}s)`
                : 'Volver a enviar'
              : 'Enviar correo de recuperación'}
        </CustomButton>
      </form>
    </AuthCard>
  );
}
