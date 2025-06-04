// src/presentation/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

/**
 * Componente de ruta protegida que verifica autenticación y permisos.
 * @param {object} props0 - Propiedades del componente.
 * @param {ReactNode} props0.children - Elementos hijos que se renderizarán si el usuario
 * está autorizado.
 * @param {Array<string>} [props0.permisosNecesarios=[]] - Lista de permisos necesarios
 * para acceder a la ruta.
 * @returns {JSX.Element} Componente que renderiza los hijos si el usuario está
 * autorizado, o redirige a la página de inicio o de verificación TOTP según corresponda.
 */
export default function ProtectedRoute({ children, permisosNecesarios = [] }) {
  const {
    user,
    loading: authLoading,
    totpRequired,
    isTotpVerified,
    permisos,
    permisosLoading,
    isAuthenticated,
  } = useAuth();
  const location = useLocation();

  // 1) Si Firebase aún está cargando la sesión, mostramos el spinner
  if (authLoading) {
    return <LoadingScreen />;
  }

  // 2) Si no hay usuario (o la sesión ya expiró), redirigimos
  if (!user) {
    return <Navigate to='/404' replace state={{ from: location }} />;
  }

  // 3) Si se requiere TOTP y aún no está verificado, redirigimos a verificación
  if (totpRequired && !isTotpVerified) {
    return <Navigate to='/iniciar-sesion/verificar' replace state={{ from: location }} />;
  }

  // 4) Ahora que el usuario está autenticado y TOTP resuelto,
  //    esperamos a que terminen de cargar sus permisos
  if (permisosLoading) {
    return <LoadingScreen />;
  }

  // 5) Si la función isAuthenticated() arroja false, sacamos al usuario
  if (!isAuthenticated()) {
    return <Navigate to='/404' replace state={{ from: location }} />;
  }

  // 6) Si hay permisos necesarios, verificamos que al menos uno coincida
  if (
    permisosNecesarios.length > 0 &&
    !permisosNecesarios.some((perm) => permisos.includes(perm))
  ) {
    return <Navigate to='/' replace state={{ from: location }} />;
  }

  // 7) Todo OK: renderizamos los hijos protegidos
  return <>{children}</>;
}
