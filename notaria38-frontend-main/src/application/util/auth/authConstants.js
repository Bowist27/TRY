/**
 * Constantes relacionadas con la autenticación y la gestión de sesiones.
 */
const AUTH_CONFIG = {
    SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 horas
    SESSION_CHECK_INTERVAL: 60 * 1000, // 1 minuto
    RECAPTCHA_SIZE: 'invisible', // Tamaño del reCAPTCHA
};

/**
 * Constantes para el almacenamiento local relacionadas con la autenticación.
 */
const STORAGE_KEYS = {
    TOTP_VERIFIED: 'isTotpVerified',
    TOTP_REQUIRED: 'isTotpRequired',
    USER_EMAIL: 'userEmail',
    SESSION_TIMESTAMP: 'sessionTimestamp',
};

/**
 * Rutas públicas que no requieren autenticación.
 * Estas rutas son accesibles sin necesidad de iniciar sesión.
 */
const PUBLIC_ROUTES = [
    '/restablecer-contrasena',
    '/recuperar-contrasena',
    '/registro',
    '/iniciar-sesion',
    '/aviso-privacidad',
    '/',
    '/tramites',
    '/contacto',
    '/ayuda',
];

/**
 * Mensajes de error comunes relacionados con la autenticación.
 */
const ERROR_MESSAGES = {
    'auth/invalid-credential': 'El correo electrónico o la contraseña son incorrectos',
    'auth/multi-factor-auth-required': 'Se requiere verificación de dos factores',
    'auth/invalid-verification-code': 'El código de verificación es incorrecto',
    'auth/invalid-verification-id': 'El ID de verificación es inválido',
    'auth/email-not-verified': 'El email no está verificado',
    'auth/too-many-requests': 'Demasiadas solicitudes. Intente más tarde.',
    INVALID_CREDENTIALS: 'El correo electrónico o la contraseña son incorrectos',
    TOTP_INVALID: 'Código TOTP incorrecto',
    LOGIN_GENERIC: 'Ocurrió un error al iniciar sesión.',
    GOOGLE_LOGIN_ERROR: 'Error al iniciar sesión con Google',
    LOGOUT_ERROR: 'Error al cerrar sesión',
    TOTP_VERIFICATION_ERROR: 'Error al verificar el código TOTP',
    GOOGLE_MESSAGE: 'Este correo está asociado con Google. Inicia sesión con Google.',
};

export { AUTH_CONFIG, STORAGE_KEYS, PUBLIC_ROUTES, ERROR_MESSAGES };
