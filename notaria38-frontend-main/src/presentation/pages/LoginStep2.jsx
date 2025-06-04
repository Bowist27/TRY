import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthCard from '../components/auth/AuthCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AuthCardError from '../components/auth/AuthCardError';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Componente de la segunda etapa de inicio de sesión con verificación TOTP.
 *
 * @function LoginStep2
 * @returns {JSX.Element} Formulario para ingresar el código de autenticación.
 */
export default function LoginStep2() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const { error, setError, verifyTotpCode } = useAuth();

  /**
   * Actualiza el estado del código ingresado.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento al cambiar el input.
   * @returns {void}
   */
  const handleChange = (event) => {
    setCode(event.target.value);
  };

  /**
   * Envía el código de verificación y navega si es correcto.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Evento de envío del formulario.
   * @returns {Promise<void>} Se resuelve tras verificar el código.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await verifyTotpCode(code);
    if (response) {
      toast.success('¡Bienvenido de nuevo! 😊');
      navigate('/');
    }
  };

  /**
   * Navega a la pantalla de inicio de sesión.
   *
   * @returns {void}
   */
  const handleBack = () => {
    navigate('/iniciar-sesion');
  };

  useEffect(() => {
    setError(null);
  }, [setError]);

  return (
    <AuthCard
      title='Verificar código'
      description='Ingresa el código enviado a tu correo electrónico.'
      showBackButton
      onBack={handleBack}
    >
      {error && <AuthCardError>{error}</AuthCardError>}
      <form onSubmit={handleSubmit} noValidate>
        <CustomInput
          name='code'
          id='code'
          type='text'
          value={code}
          onChange={handleChange}
          required
          placeholder='123456'
        >
          Código de verificación
        </CustomInput>
        <CustomButton type='submit' isPrimary>
          Verificar código
        </CustomButton>
      </form>
    </AuthCard>
  );
}
