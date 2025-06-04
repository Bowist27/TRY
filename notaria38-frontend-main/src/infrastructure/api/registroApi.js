// URL base de la API
const url = import.meta.env.VITE_API_URL;

/*
  Valida las credenciales del usuario.

  Parámetros:
  - string email
  - string password

  Retorna:
  - object data
*/
export const validateUser = async (email, password) => {
    try {
        const response = await fetch(`${url}/api/verificar-usuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al validar el usuario:', error);
        throw error;
    }
};

/*
  Valida el token TOTP del usuario.

  Parámetros:
  - string email
  - string token

  Retorna:
  - object data
*/
export const validateToken = async (email, token) => {
    try {
        const response = await fetch(`${url}/api/verificar-token-totp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                token,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al validar el token:', error);
        throw error;
    }
};

/*
  Registra un nuevo usuario con correo y contraseña.

  Parámetros:
  - string email
  - string password

  Retorna:
  - object data
*/
export const registerUser = async (email, password) => {
    try {
        const response = await fetch(`${url}/api/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (response.status === 409) {
            // Lanzamos un error personalizado que sí se puede capturar
            const error = new Error(
                'Este correo ya fue registrado. Por favor, intenta iniciar sesión.',
            );
            error.status = 409;
            throw error;
        }

        if (!response.ok) {
            throw new Error('No se pudo registrar el usuario');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        throw error;
    }
};

/*
  Registra un nuevo usuario con autenticación de Google.

  Parámetros:
  - string idToken

  Retorna:
  - object data
*/
export const registerUserWithGoogle = async (idToken) => {
    try {
        const response = await fetch(`${url}/api/registrar/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken,
            }),
        });

        if (response.status === 409) {
            const error = new Error(
                'Ya tienes una cuenta registrada con este correo. ' +
                'Por favor, inicia sesión.',
            );
            error.status = 409;
            throw error;
        }

        if (!response.ok) {
            throw new Error('No se pudo registrar el usuario con Google');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al registrar usuario con Google:', error);
        throw error;
    }
};
