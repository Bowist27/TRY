import { useState, useEffect } from 'react';
import { useLoadRoles } from '../../../application/useCases/ayuda/modifyVideo';

/**
 * Función para manejar el prellenado de datos del video antes de abrir el modal
 * 
 * @param {*} videoToEdit - Video a editar
 * @param {*} mode - Modo de operación ("edit" o "create")
 * 
 * @returns {object} - Objeto con los datos y funciones necesarias para el formulario
 */
export const useManualForm = (videoToEdit, mode) => {
    const [title, setTitulo] = useState(videoToEdit.title || '');
    const [videoURL, setVideoURL] = useState(videoToEdit.url || '');
    const [allRoles, setAllRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [localLoading, setLocalLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [localError, setLocalError] = useState(null);

    // Usa nombres únicos al desestructurar
    const {
        allRoles: fetchedRoles,
        videoRoles,
        loading: loadRolesLoading,
        error: loadRolesError
    } = useLoadRoles(videoToEdit.videoId);

    useEffect(() => {
        if (mode === 'edit') {
            const shouldInit = fetchedRoles.length > 0 || videoRoles.length > 0;
            if (!shouldInit) {return;}
  
            setAllRoles(fetchedRoles);
            setSelectedRoles(videoRoles);
            setLocalLoading(false);
        } else if (mode === 'create') {
            const shouldInit = fetchedRoles.length > 0;
            if (!shouldInit) {return;}
            
            setAllRoles(fetchedRoles);
            setLocalLoading(false);
        }
    }, [videoToEdit.idVideo, mode, fetchedRoles, videoRoles]);


    return {
        title,
        setTitulo,
        videoURL,
        setVideoURL,
        allRoles,
        selectedRoles,
        setSelectedRoles,
        loading: localLoading || loadRolesLoading,
        error: localError || loadRolesError,
    };
};