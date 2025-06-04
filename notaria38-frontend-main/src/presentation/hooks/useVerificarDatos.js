import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import {
    actualizarRolUsuario,
    obtenerDatosFiscales,
} from '../../infrastructure/api/Archivos/constanciaApi';

/**
 * Hook personalizado para manejar la lógica de verificación de datos fiscales
 * @returns {object} - Estados y funciones para manejar la verificación de datos
 */
export const useVerificarDatos = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [verificando, setVerificando] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [datosUsuario, setDatosUsuario] = useState({
        // Estructura inicial sin cambios
        apellidoPaterno: '',
        apellidoMaterno: '',
        nombre: '',
        curp: '',
        rfc: '',
        nombreComercial: '',
    
        // Domicilio fiscal
        codigoPostal: '',
        tipoVialidad: '',
        nombreVialidad: '',
        numeroExterior: '',
        numeroInterior: '',
        colonia: '',
        localidad: '',
        municipio: '',
        entidadFederativa: '',
        entreCalle: ''
    });

    /**
     * Efecto para cargar los datos fiscales del usuario
     * cuando el componente se monta
     * @returns {void}
     */
    useEffect(() => {
        /**
         * Función asíncrona para obtener los datos fiscales
         * del usuario desde la API
         * @returns {void}
         */
        const fetchData = async () => {
            if (user?.email) {
                try {
                    setLoading(true);
                    setErrorMessage('');
                    
                    // Usar la función de la API en lugar del fetch directo
                    const result = await obtenerDatosFiscales(user.email);
                    
                    if (result.success && result.data) {
                        // Mapear los datos del backend a la estructura 
                        // que espera el frontend
                        setDatosUsuario({
                            apellidoPaterno: result.data.apellidoPaterno || '',
                            apellidoMaterno: result.data.apellidoMaterno || '',
                            nombre: result.data.nombre || '',
                            curp: result.data.curp || '',
                            rfc: result.data.rfc || '',
                            nombreComercial: '', // No viene del backend, puedes agregar si lo necesitas
                            
                            // Domicilio fiscal
                            codigoPostal: result.data.codigoPostal?.toString() || '',
                            tipoVialidad: '', // No viene del backend directamente
                            nombreVialidad: result.data.nombreVialidad || '',
                            numeroExterior: result.data.numeroExterior?.toString() || '',
                            numeroInterior: result.data.numeroInterior?.toString() || '',
                            colonia: result.data.colonia || '',
                            localidad: '', // No viene del backend directamente
                            municipio: result.data.municipio || '',
                            entidadFederativa: result.data.entidadFederativa || '',
                            entreCalle: '' // No viene del backend directamente
                        });
                    } else {
                        setErrorMessage(result.message || 'No se pudieron obtener los datos fiscales');
                    }
                } catch (error) {
                    console.error('Error al obtener datos fiscales:', error);
                    setErrorMessage('No se pudieron cargar los datos. Intenta nuevamente.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [user]);

    /**
     * Maneja la verificación de datos del usuario
     * @returns {void}
     */
    const handleVerificar = async () => {
        setVerificando(true);
        setErrorMessage('');
        setSuccessMessage('');
      
        try {
            await actualizarRolUsuario(user.email);
            setSuccessMessage('Verificación exitosa. Su cuenta está actualizada y lista para iniciar un trámite.');
        } catch (error) {
            console.error('Error al verificar datos:', error);
            setErrorMessage('Ocurrió un error al verificar los datos. Intenta nuevamente.');
        } finally {
            setVerificando(false);
        }
    };

    /**
     * Maneja el cierre del mensaje de éxito
     * y redirige al usuario a la página de trámites
     * @returns {void}
     */
    const handleSuccessClose = () => {
        setSuccessMessage('');
        navigate('/tramites');
    };

    return {
        loading,
        verificando,
        successMessage,
        errorMessage,
        datosUsuario,
        handleVerificar,
        setSuccessMessage,
        setErrorMessage,
        handleSuccessClose
    };
};