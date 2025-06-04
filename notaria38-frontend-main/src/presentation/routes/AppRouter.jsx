// AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import Inicio from '../pages/Inicio';
import Contacto from '../pages/Contacto';
import Tramites from '../pages/Tramites';
import Usuarios from '../pages/Usuarios';
import Ayuda from '../pages/Ayuda';
import Expedientes from '../pages/Expedientes';
import LoginStep1 from '../pages/LoginStep1';
import LoginStep2 from '../pages/LoginStep2';
import RecuperarContrasena from '../pages/RecuperarContrasena';
import RestablecerContrasena from '../pages/RestablecerContrasena';
import Registro from '../pages/Registro';
import ConstanciaFiscal from '../pages/ConstanciaFiscal';
import ConstanciaFiscal2 from '../pages/ConstanciaFiscal2';
import ConstanciaFiscalActualizar from '../pages/ConstanciaFiscalActualizar';
import DetalleTramite from '../pages/DetalleTramite';
import AvisoPrivacidad from '../pages/AvisoPrivacidad';
import DetalleDocumento from '../pages/DetalleDocumento';
import PageNotFound from '../pages/PageNotFound';

import {
  PERM_VIEW_USERS,
  PERM_VIEW_PROCESS,
  PERM_VIEW_ACTIVE_APPLICATIONS,
  PERM_VIEW_ASSIGNED_APPLICATIONS,
  PERM_ASSIGN_APPLICATIONS,
  PERM_VIEW_APPLICATION_DETAIL,
  PERM_VIEW_CASE_FILE,
  PERM_INITIATE_APPLICATION,
} from '../../application/util/permissions';

/**
 * Componente principal de enrutamiento de la aplicación.
 *
 * Define rutas públicas y protegidas, aplica layouts (Main y Auth),
 * y registra el contenedor de reCAPTCHA.
 *
 * @function AppRouter
 * @returns {JSX.Element} El conjunto de rutas de la aplicación.
 */
export default function AppRouter() {
  const { registerRecaptcha } = useAuth();

  return (
    <>
      <div ref={registerRecaptcha} id='recaptcha-container' className='hidden' />
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Inicio />} />
          <Route path='tramites' element={<Tramites />} />
          <Route path='contacto' element={<Contacto />} />
          <Route path='ayuda' element={<Ayuda />} />
          <Route path='aviso-privacidad' element={<AvisoPrivacidad />} />

          {/* Rutas protegidas */}
          <Route
            path='usuarios'
            element={
              <ProtectedRoute permisoNecesario={PERM_VIEW_USERS}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Constancia Fiscal */}
          <Route
            path='constancia-fiscal'
            element={
              <ProtectedRoute permisoNecesario={PERM_INITIATE_APPLICATION}>
                <ConstanciaFiscal />
              </ProtectedRoute>
            }
          />
          <Route
            path='constancia-fiscal-verificar'
            element={
              <ProtectedRoute permisoNecesario={PERM_INITIATE_APPLICATION}>
                <ConstanciaFiscal2 />
              </ProtectedRoute>
            }
          />
          <Route
            path='constancia-fiscal-actualizar'
            element={
              <ProtectedRoute permisoNecesario={PERM_INITIATE_APPLICATION}>
                <ConstanciaFiscalActualizar />
              </ProtectedRoute>
            }
          />

          <Route
            path='expedientes'
            element={
              <ProtectedRoute
                permisoNecesario={[
                  PERM_VIEW_ACTIVE_APPLICATIONS,
                  PERM_VIEW_PROCESS,
                  PERM_VIEW_ASSIGNED_APPLICATIONS,
                ]}
              >
                <Expedientes />
              </ProtectedRoute>
            }
          />
          <Route
            path='expedientes/:id'
            element={
              <ProtectedRoute
                permisoNecesario={[
                  PERM_VIEW_CASE_FILE,
                  PERM_VIEW_PROCESS,
                  PERM_VIEW_APPLICATION_DETAIL,
                ]}
              >
                <DetalleTramite />
              </ProtectedRoute>
            }
          />
          <Route
            path='abogados'
            element={<ProtectedRoute permisoNecesario={PERM_ASSIGN_APPLICATIONS} />}
          />

          <Route
            path='expedientes/:tramiteId/:documentoId'
            element={<DetalleDocumento />}
          />
          <Route path='documento' element={<DetalleDocumento />} />
        </Route>

        {/* Layout de autenticación */}
        <Route path='iniciar-sesion' element={<AuthLayout />}>
          <Route index element={<LoginStep1 />} />
          <Route path='verificar' element={<LoginStep2 />} />
        </Route>
        <Route path='recuperar-contrasena' element={<RecuperarContrasena />} />
        <Route path='restablecer-contrasena' element={<RestablecerContrasena />} />
        <Route path='registro' element={<Registro />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  );
}
