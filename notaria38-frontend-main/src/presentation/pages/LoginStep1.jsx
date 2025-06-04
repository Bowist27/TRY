import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import AuthCardButtonGoogle from '../components/auth/AuthCardButtonGoogle';
import AuthCardError from '../components/auth/AuthCardError';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

/**
 * Primera etapa de inicio de sesión con email y password o Google.
 *
 * @function LoginStep1
 * @returns {JSX.Element} Formulario de login.
 */
export default function LoginStep1() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { loading, error, setError, loginWithEmailAndPassword, loginWithGoogle } =
    useAuth();

  /**
   * Actualiza el estado de credenciales al cambiar un campo.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio de input.
   * @returns {void}
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((previous) => ({ ...previous, [name]: value }));
  };

  /**
   * Envía el formulario de login con email y password.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Evento de envío de formulario.
   * @returns {Promise<void>} Se resuelve tras autenticar.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);

    // Comprueba si los campos están vacíos
    if (!credentials.email || !credentials.password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Comprueba si el email tiene un formato válido
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(credentials.email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return;
    }

    try {
      const { totpRequired } = await loginWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      if (totpRequired) {
        navigate('/iniciar-sesion/verificar');
      } else {
        toast.success('¡Bienvenido de nuevo! 😊');
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  /**
   * Inicia inicio de sesión con Google.
   *
   * @returns {Promise<void>} Se resuelve tras autenticar con Google.
   */
  const handleGoogleLogin = async () => {
    const { totpRequired } = await loginWithGoogle();
    if (totpRequired) {
      navigate('/iniciar-sesion/verificar');
    } else {
      toast.success('¡Bienvenido de nuevo! 😊');
      navigate('/');
    }
    return;
  };

  /**
   * Navega a la página inicial.
   *
   * @returns {void}
   */
  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    setError(null);
  }, [setError]);

  return (
    <AuthCard
      title='Iniciar sesión'
      description='Es un gusto tenerte de regreso.'
      showBackButton
      onBack={handleBack}
    >
      {error && <AuthCardError>{error}</AuthCardError>}

      <form onSubmit={handleSubmit} noValidate>
        <CustomInput
          name='email'
          id='email'
          type='email'
          value={credentials.email}
          onChange={handleChange}
          required
          placeholder='pixel.it.mx@gmail.com'
        >
          Correo electrónico
        </CustomInput>

        <CustomInput
          name='password'
          id='password'
          type='password'
          value={credentials.password}
          onChange={handleChange}
          required
          placeholder='******'
        >
          Contraseña
        </CustomInput>

        <div className='flex justify-end mt-1'>
          <button
            type='button'
            onClick={() => navigate('/recuperar-contrasena')}
            className='text-sm text-[#D07024] hover:underline bg-transparent border-none cursor-pointer'
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <p className='text-sm text-gray-600 mb-4'>
          ¿No tienes cuenta?{' '}
          <button
            type='button'
            onClick={() => navigate('/registro')}
            className='text-[#D07024] hover:underline bg-transparent border-none cursor-pointer'
          >
            Regístrate
          </button>
        </p>

        <CustomButton type='submit' isPrimary disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </CustomButton>
      </form>

      <AuthCardButtonGoogle handleGoogleLogin={handleGoogleLogin} type='login' />
    </AuthCard>
  );
}
