// application/useCases/enviarArchivoApi38.js

/**
 * Envía un archivo a la API.
 * @param {Object} param0 - Parámetros para enviar el archivo (clave y archivo).
 * @param {string} param0.clave - Clave de autorización.
 * @param {File} param0.archivo - Archivo a enviar.
 * @returns {Promise<object>} - Respuesta de la API.
 */
export async function enviarArchivoApi38({ clave, archivo }) {
    const url = 'http://201.116.229.70/api/index.php';
  
    const formData = new FormData();
    formData.append('clave', clave);
    formData.append('archivo', archivo);
  
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer N-38-QRO-QRO-7b9e3f1c5a8d2e4b6f0c9d3e2a7b5f1c4e8d',
                // No pongas Content-Type, fetch lo maneja si es FormData.
            },
            body: formData,
        });
  
        const data = await response.json();
  
        if (!response.ok) {
            throw new Error(data.mensaje || 'Error al enviar el archivo');
        }
  
        return data;
    } catch (error) {
        console.error('Error en enviarArchivoApi38:', error);
        throw error;
    }
}
  