/**
 * Valida la fortaleza de una contraseña según requisitos de seguridad.
 *
 * Reglas:
 * - Al menos 8 caracteres.
 * - Al menos una letra mayúscula.
 * - Al menos una letra minúscula.
 * - Al menos un número.
 * - Al menos un carácter especial (@$!%*?&#+-_)
 *
 * @function validatePassword
 * @param {string} password - La contraseña a validar.
 * @returns {string} Mensaje de error si la contraseña no cumple los requisitos,
 *                   o cadena vacía si es válida.
 */
export const validatePassword = (password) => {
    const sanitized = password.replace(/\s+/g, ''); // quita TODOS los espacios

    const pattern = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)' +
            '(?=.*[@$!%*?&#+\\-_.])[A-Za-z\\d@$!%*?&#+\\-_.]{8,}$'
    );

    if (!sanitized) {
        return 'Campo requerido';
    }

    if (!password) {
        return 'Campo requerido';
    }

    if (!pattern.test(password)) {
        return (
            'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, ' +
            'un número y un símbolo'
        );
    }

    return '';
};
