import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRegister } from '../hooks/useRegister';

import AuthCard from '../components/auth/AuthCard';
import AuthCardButtonGoogle from '../components/auth/AuthCardButtonGoogle';
import AuthCardError from '../components/auth/AuthCardError';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { validatePassword } from '../../application/util/validatePassword';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

/**
 * Página de registro de usuarios con correo y Google.
 *
 * @function Registro
 * @returns {JSX.Element} Formulario de registro.
 */
export const Registro = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { loginWithEmailAndPassword, loginWithGoogle } = useAuth();
  const { register, registerGoogle, error: registerError } = useRegister();
  const navigate = useNavigate();

  /**
   * Actualiza el estado del formulario al ingresar en un campo.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio en un campo.
   * @returns {void}
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: '' }));
  };

  /**
   * Envía los datos del formulario para registrar al usuario.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Evento de envío del formulario.
   * @returns {Promise<void>} Promise que se resuelve tras completar el registro.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');

    const errors = {
      email: form.email.trim() ? '' : 'Campo requerido',
      password: form.password.trim() ? '' : 'Campo requerido',
      confirmPassword: form.confirmPassword.trim() ? '' : 'Campo requerido',
    };

    if (Object.values(errors).some((fieldError) => fieldError)) {
      setFieldErrors(errors);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setFieldErrors((previous) => ({
        ...previous,
        email: 'Correo electrónico no válido',
      }));
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setFieldErrors((previous) => ({ ...previous, password: passwordError }));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFieldErrors((previous) => ({
        ...previous,
        confirmPassword: 'Las contraseñas no coinciden',
      }));
      return;
    }

    try {
      await register(form.email, form.password);
      const { totpRequired } = await loginWithEmailAndPassword(form.email, form.password);
      if (totpRequired) {
        navigate('/iniciar-sesion/verificar');
      } else {
        toast.success('¡Bienvenido de nuevo! 😊');
        navigate('/');
      }
    } catch (registrationError) {
      setValidationError('Ocurrió un error durante el registro. Intenta de nuevo.');
    }
  };

  /**
   * Autentica usando Google y registra el usuario.
   *
   * @returns {Promise<void>} Promise que se resuelve
   * tras procesar la autenticación con Google.
   */
  const handleGoogleSignIn = async () => {
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
   * Navega a la pantalla de inicio.
   *
   * @returns {void}
   */
  const handleBack = () => {
    navigate('/iniciar-sesion');
  };

  /**
   * Navega a la pantalla de login.
   *
   * @returns {void}
   */
  const handleLogin = () => {
    navigate('/iniciar-sesion');
  };

  return (
    <AuthCard
      title='Registrar cuenta'
      description='Bienvenido a la mejor experiencia notarial.'
      showBackButton
      onBack={handleBack}
    >
      {(validationError || registerError) && (
        <AuthCardError>{validationError || registerError}</AuthCardError>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <CustomInput
          type='email'
          name='email'
          id='email'
          value={form.email}
          onChange={handleChange}
          required
          errorMessage={fieldErrors.email}
          placeholder='pixel.it.mx@gmail.com'
        >
          Correo electrónico
        </CustomInput>

        <CustomInput
          type={'password'}
          name='password'
          id='password'
          value={form.password}
          onChange={handleChange}
          required
          errorMessage={fieldErrors.password}
          placeholder='******'
        >
          Contraseña
        </CustomInput>

        <CustomInput
          type='password'
          name='confirmPassword'
          id='confirmPassword'
          value={form.confirmPassword}
          onChange={handleChange}
          required
          errorMessage={fieldErrors.confirmPassword}
          placeholder='******'
        >
          Confirmar contraseña
        </CustomInput>

        <CustomButton type='submit' isPrimary>
          Registrar cuenta
        </CustomButton>
      </form>

      <AuthCardButtonGoogle handleGoogleLogin={handleGoogleSignIn} type='signup' />
      <p className='mt-4 text-sm text-gray-600 mb-4'>
        ¿Ya tienes una cuenta?{' '}
        <a
          onClick={handleLogin}
          className='text-[#D07024] cursor-pointer hover:underline'
        >
          Inicia sesión
        </a>
      </p>
    </AuthCard>
  );
};

export default Registro;
