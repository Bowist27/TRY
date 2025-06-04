import { useEffect, useState } from 'react';
import { iniciarExpedienteUseCase } from '../../application/useCases/initExpediente';
import { useAuth } from './useAuth';
import { usePermisos } from './usePermisos';
import {
    PERM_CREATE_PROCESS,
    PERM_INITIATE_APPLICATION
} from '../../application/util/permissions';

export const useIniciarExpediente = () => {
    const { user } = useAuth();
    const { permisos, loading: permisosLoading } = usePermisos();

    const [showSuccess, setShowSuccess] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [errorExpediente, setErrorExpediente] = useState(null);
    const [showError, setShowError] = useState(false);
    const [tienePermiso, setTienePermiso] = useState(false);

    useEffect(() => {
        if (!user?.email || permisosLoading) { return; }

        const tiene =
            permisos.includes(PERM_INITIATE_APPLICATION) ||
            permisos.includes(PERM_CREATE_PROCESS);

        setTienePermiso(tiene);
    }, [user, permisos, permisosLoading]);

    const iniciarExpediente = async (tituloTramite, emailUsuario) => {
        if (!user?.email || !tienePermiso) {
            return null;
        }

        try {
            const { data, status } = await iniciarExpedienteUseCase(
                tituloTramite,
                emailUsuario
            );

            if (status === 201 || status === 200) {
                const mensaje = status === 201 
                    ? 'Expediente creado con éxito.'
                    : 'El expediente ya existía y se reutilizó.';
                
                setMensajeExito(mensaje);
                setShowSuccess(true);
                setErrorExpediente(null);
                setShowError(false);

                return data?.idExpediente || null;
            }

            return null;
        } catch (err) {
            if (err.status === 409) {
                setErrorExpediente('Excediste el límite de trámites del mismo tipo.');
            } else if (err.status === 400) {
                setErrorExpediente('Faltan datos o la solicitud es inválida.');
            } else if (err.status === 500) {
                setErrorExpediente('Error del servidor. Intenta más tarde.');
            } else {
                setErrorExpediente(err.message || 'Ocurrió un error inesperado.');
            }

            setShowError(true);
            setShowSuccess(false);
            return null;
        }
    };

    const cerrarSuccess = () => {
        setShowSuccess(false);
        setMensajeExito('');
    };

    const cerrarError = () => {
        setShowError(false);
        setErrorExpediente(null);
    };

    return {
        iniciarExpediente,
        showSuccess,
        showError,
        mensajeExito,
        errorExpediente,
        cerrarSuccess,
        cerrarError,
        tienePermiso,
    };
};