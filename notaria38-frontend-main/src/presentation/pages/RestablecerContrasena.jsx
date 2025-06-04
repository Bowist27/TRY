import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/index';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AuthCard from '../components/auth/AuthCard';
import { validatePassword } from '../../application/util/validatePassword';

/**
 * Página para restablecer la contraseña utilizando el código de recuperación de Firebase.
 *
 * @function ResetPassword
 * @returns {JSX.Element} Componente de restablecimiento de contraseña.
 */
export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [oobCode, setOobCode] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParameters = new URLSearchParams(window.location.search);
    const code = urlParameters.get('oobCode');
    if (code) {
      verifyPasswordResetCode(auth, code)
        .then((emailFromCode) => {
          setEmail(emailFromCode);
          setOobCode(code);
        })
        .catch(() => {
          setError('El enlace de recuperación no es válido o ha expirado.');
          setTimeout(() => navigate('/iniciar-sesion'), 3000);
        });
    } else {
      setError('No se encontró un código de recuperación válido.');
      setTimeout(() => navigate('/iniciar-sesion'), 3000);
    }
  }, [navigate]);

  /**
   * Maneja el cambio en el campo de nueva contraseña con validación
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio
   */
  const handleNewPasswordChange = (event) => {
    const password = event.target.value;
    setNewPassword(password);

    // Validar contraseña solo si no está vacía
    if (password.trim()) {
      const validationError = validatePassword(password);
      setPasswordError(validationError);
    } else {
      setPasswordError('');
    }

    // Si hay confirmación de contraseña, validar que coincidan
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  };

  /**
   * Maneja el cambio en el campo de confirmación de contraseña
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio
   */
  const handleConfirmPasswordChange = (event) => {
    const confirmPass = event.target.value;
    setConfirmPassword(confirmPass);

    // Validar que las contraseñas coincidan
    if (confirmPass && newPassword !== confirmPass) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  };

  /**
   * Maneja el envío del formulario de restablecimiento de contraseña.
   *
   * @param {import('react').FormEvent<HTMLFormElement>} event
   * - Evento de envío del formulario.
   * @returns {Promise<void>} Se resuelve cuando finaliza el intento de restablecimiento.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validar que los campos no estén vacíos
    if (!newPassword.trim()) {
      setPasswordError('Campo requerido');
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Campo requerido');
      return;
    }

    // Validar fortaleza de la contraseña
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess('¡Contraseña restablecida correctamente!');
      setTimeout(() => navigate('/iniciar-sesion'), 3000);
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/weak-password') {
        setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('No se pudo restablecer la contraseña. Intenta de nuevo.');
      }
    }
  };

  return (
    <AuthCard
      title='Restablecer contraseña'
      description={email ? `Para el correo: ${email}` : ''}
    >
      {error && (
        <div className='mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700'>
          {error}
        </div>
      )}

      {success && (
        <div className='mb-4 p-3 rounded-lg bg-green-100 border border-green-400 text-green-700'>
          {success}
        </div>
      )}

      {!success && oobCode && (
        <form onSubmit={handleSubmit}>
          <CustomInput
            type='password'
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            placeholder='******'
            errorMessage={passwordError}
          >
            Contraseña nueva
          </CustomInput>
          <CustomInput
            type={'password'}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            placeholder='******'
            errorMessage={confirmPasswordError}
          >
            Confirmar contraseña nueva
          </CustomInput>
          <CustomButton
            type='submit'
            isPrimary
            disabled={
              !!passwordError ||
              !!confirmPasswordError ||
              !newPassword ||
              !confirmPassword
            }
          >
            Restablecer contraseña
          </CustomButton>
        </form>
      )}
    </AuthCard>
  );
}
