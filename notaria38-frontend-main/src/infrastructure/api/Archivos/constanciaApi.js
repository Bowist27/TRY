// URL base de la API
const url = import.meta.env.VITE_API_URL;

/**
 * Envía la constancia de situación fiscal a la API.
 * @param {*} email - Email del usuario
 * @param {*} pdfFile - Archivo PDF de la constancia
 * @returns {Promise<object>} - Respuesta del servidor
 */
export const enviarConstancia = async (email, pdfFile) => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('archivo', pdfFile);

        const response = await fetch(`${url}/api/constancia`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        // Si la respuesta no es exitosa, mostrar el mensaje de error del backend
        if (!response.ok) {
            throw new Error(data.mensaje || 'Error al procesar la constancia');
        }
        
        // Comprobar que se hayan extraído los datos fiscales necesarios
        // Nota: Adaptado a la estructura real que devuelve tu backend
        if (!data.datosOriginalesApiRecibidos || 
            !data.datosOriginalesApiRecibidos.datos || 
            !data.datosOriginalesApiRecibidos.datos.id_cif) {
            throw new Error('El documento no parece ser una Constancia de Situación Fiscal válida');
        }
        
        return data;
    } catch (error) {
        console.error('Error al enviar la constancia:', error);
        throw error;
    }
};

/**
 * Actualiza el rol del usuario en la base de datos (rol gestionado por el backend)
 * @param {string} email - Email del usuario
 * @returns {Promise<object>} - Respuesta del servidor
 */
export const actualizarRolUsuario = async (email) => {
    try {
        const response = await fetch(`${url}/api/usuarios/actualizar-rol`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
                // No enviamos el rol, el backend lo determinará
            }),
        });

        const data = await response.json();
      
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar el rol del usuario');
        }
      
        return data;
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        throw error;
    }
};

/**
 * Verifica si el usuario tiene el rol de nivel 2 (constancia verificada)
 * @param {string} email - Email del usuario
 * @returns {Promise<object>} - Respuesta con información del rol
 */
export const verificarRolUsuario = async (email) => {
    try {
        const response = await fetch(`${url}/api/usuarios/verificar-rol/${email}`);
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al verificar el rol del usuario');
        }
        
        return data;
    } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
        throw error;
    }
};

/**
 * Obtiene los datos fiscales del usuario
 * @param {string} email - Email del usuario
 * @returns {Promise<object>} - Datos fiscales y de domicilio del usuario
 */
export const obtenerDatosFiscales = async (email) => {
    try {
        const response = await fetch(`${url}/api/usuarios/fiscal-data/${email}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener datos fiscales:', error);
        throw error;
    }
};