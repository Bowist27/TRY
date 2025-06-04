import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { onAuthStateChanged, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase';
import { fetchPermisos } from '../../infrastructure/api/permisosApi';
import { TotpStorageManager } from '../../application/util/auth/totpStorage';
import { AuthService } from '../../application/services/authService';
import { AUTH_CONFIG, PUBLIC_ROUTES } from '../../application/util/auth/authConstants';

/**
 * Estados iniciales del contexto
 */
const INITIAL_STATE = {
  user: null,
  error: null,
  loading: true,
  totpRequired: false,
  isTotpVerified: false,
  userEmail: '',
  permisos: [],
  permisosLoading: true,
};

/**
 * Contexto de autenticación
 */
export const AuthContext = createContext();

/**
 * Proveedor de contexto de autenticación
 * @param {object} props - Props del componente
 * @param {React.ReactNode} props.children - Hijos del proveedor
 * @returns {JSX.Element} Componente de contexto de autenticación
 */
export function AuthProvider({ children }) {
  // Estados principales
  const [state, setState] = useState(INITIAL_STATE);
  const recaptchaReference = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Actualiza estado de forma controlada
   */
  const updateState = useCallback((updates) => {
    setState((previousState) => ({ ...previousState, ...updates }));
  }, []);

  /**
   * Establece un error en el estado
   * @param {string|Error} error - Mensaje de error o objeto Error
   */
  const setError = useCallback((error) => {
    updateState({ error: error });
  }, []);

  /**
   * Verifica autenticación completa
   */
  const isAuthenticated = useCallback(() => {
    if (!state.user) {
      return false;
    }
    if (state.totpRequired && !state.isTotpVerified) {
      return false;
    }
    return TotpStorageManager.checkSessionValidity(() => {
      return false; // Si la sesión no es válida, se redirige al logout
    });
  }, [state.user, state.totpRequired, state.isTotpVerified]);

  /**
   * Carga estado TOTP inicial
   */
  const loadTotpState = useCallback(() => {
    const currentPath = location.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    const totpState = TotpStorageManager.loadTotpState(() => {
      // Solo hacer logout si no estamos en una ruta pública
      if (!isPublicRoute) {
        logOut();
      }
    });

    updateState({
      totpRequired: totpState.required,
      isTotpVerified: totpState.verified,
      userEmail: totpState.email,
    });

    return totpState;
  }, [updateState]);

  /**
   * Limpia estado TOTP
   */
  const clearTotpState = useCallback(() => {
    TotpStorageManager.clearTotpState();
    updateState({
      totpRequired: false,
      isTotpVerified: false,
      userEmail: '',
    });
  }, [updateState]);

  /**
   * Configura headers de axios
   */
  const setupAxiosHeaders = useCallback(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['x-user-email'] = user.email;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['x-user-email'];
    }
  }, []);

  /**
   * Actualiza estado después de operaciones de auth
   */
  const updateAuthState = useCallback(
    (authResult) => {
      updateState({
        totpRequired: authResult.totpState.required,
        isTotpVerified: authResult.totpState.verified,
        userEmail: authResult.totpState.email,
        error: null,
      });
    },
    [updateState]
  );

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<object>} Resultado de la autenticación
   */
  const loginWithEmailAndPassword = async (email, password) => {
    updateState({ error: null, loading: true });
    try {
      const result = await AuthService.loginWithEmailAndPassword(email, password);
      updateAuthState(result);
      return result;
    } catch (error) {
      updateState({ error: error.message });
      throw error;
    } finally {
      updateState({ loading: false });
    }
  };

  /**
   * Verifica el código TOTP ingresado por el usuario
   * @param {string} code - Código TOTP ingresado por el usuario
   * @returns {Promise<boolean>} Verdadero si el código es válido, falso en caso contrario
   */
  const verifyTotpCode = async (code) => {
    updateState({ error: null });
    try {
      await AuthService.verifyTotpCode(state.userEmail, code);
      updateState({
        totpRequired: false,
        isTotpVerified: true,
      });
      return true;
    } catch (error) {
      updateState({ error: error.message });
      throw error;
    }
  };

  /**
   * Inicia sesión con Google
   * @returns {Promise<object>} Resultado de la autenticación
   */
  const loginWithGoogle = async () => {
    updateState({ error: null });
    try {
      const result = await AuthService.loginWithGoogle();
      updateAuthState(result);
      return result;
    } catch (error) {
      updateState({ error: error.message });
      throw error;
    }
  };

  /**
   * Cierra sesión del usuario
   * @returns {Promise<void>}
   */
  const logOut = async () => {
    updateState({ error: null });
    try {
      await AuthService.logout();
      updateState({
        user: null,
        permisos: [],
        permisosLoading: false,
      });
      clearTotpState();
      await setupAxiosHeaders(null);
      navigate('/');
    } catch (error) {
      updateState({ error: error.message });
      throw error;
    }
  };

  const registerRecaptcha = useCallback((element) => {
    if (element && !recaptchaReference.current) {
      recaptchaReference.current = new RecaptchaVerifier(auth, element.id, {
        size: AUTH_CONFIG.RECAPTCHA_SIZE,
      });
      recaptchaReference.current.render();
    }
  }, []);

  // ============= Effects =============

  // Carga estado inicial
  useEffect(() => {
    loadTotpState();
  }, [loadTotpState]);

  // Verificación periódica de sesión
  useEffect(() => {
    const currentPath = location.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    // Solo hacer verificación periódica si no estamos en una ruta pública
    if (!isPublicRoute) {
      const interval = setInterval(() => {
        if (state.user && !TotpStorageManager.isSessionValid()) {
          logOut();
        }
      }, AUTH_CONFIG.SESSION_CHECK_INTERVAL);

      return () => clearInterval(interval);
    }

    // Retornar función de limpieza vacía para rutas públicas
    return () => {};
  }, [state.user, location.pathname]);

  // Listener de cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      updateState({ user: currentUser, loading: false });
      await setupAxiosHeaders(currentUser);

      if (!currentUser) {
        clearTotpState();
        updateState({ permisos: [], permisosLoading: false });
      }
    });

    return () => unsubscribe();
  }, [updateState, setupAxiosHeaders, clearTotpState]);

  // Carga de permisos
  useEffect(() => {
    /**
     * Carga los permisos del usuario autenticado
     */
    const loadPermissions = async () => {
      updateState({ permisosLoading: true });
      if (isAuthenticated()) {
        try {
          updateState({ permisosLoading: true });
          const lista = await fetchPermisos(state.user.email);
          updateState({ permisos: lista });
        } catch (error) {
          console.error('Error al cargar permisos:', error);
        } finally {
          updateState({ permisosLoading: false });
        }
      } else {
        updateState({ permisos: [], permisosLoading: false });
      }
    };

    loadPermissions();
  }, [state.user, state.totpRequired, state.isTotpVerified, isAuthenticated]);

  // Valor del contexto
  const contextValue = {
    ...state,
    isAuthenticated,
    isSessionValid: TotpStorageManager.isSessionValid,
    loginWithEmailAndPassword,
    verifyTotpCode,
    loginWithGoogle,
    logOut,
    registerRecaptcha,
    getSessionInfo: TotpStorageManager.getSessionInfo,
    setError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
