import { useEffect, useState } from 'react';
import {
    fetchRoles,
    fetchRolesFromVideo,
    patchVideo,
} from '../../../infrastructure/api/Ayuda/updateVideosApi';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { usePermisos } from '../../../presentation/hooks/usePermisos';
import { PERM_UPDATE_USER_GUIDE } from '../../util/permissions';

/**
 * Obtiene los roles disponibles y los roles asignados a un video mediante su ID.
 * @param {int} idVideo - ID del video
 *
 * @returns {object} - Objeto con todos los roles y los roles asignados al video
 * - allRoles: Array de todos los roles disponibles
 * - videoRoles: Array de roles asignados al video
 */
export const useLoadRoles = (idVideo) => {
    const { user } = useAuth();
    const { permisos, loading: permisosLoading } = usePermisos();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [allRoles, setAllRoles] = useState([]);
    const [videoRoles, setVideoRoles] = useState([]);

    useEffect(() => {
        if (!user?.email || permisosLoading) {
            return;
        }

        if (!permisos.includes(PERM_UPDATE_USER_GUIDE)) {
            return;
        }

        /**
         * Carga los roles disponibles y los roles asignados al video.
         * @returns {Promise<void>}
         */
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [roles, vRoles] = await Promise.all([
                    fetchRoles(user.email),
                    fetchRolesFromVideo(idVideo, user.email),
                ]);
                const filteredRoles = roles.filter(
                    (role) => role.Nombre !== 'Soft Delete'
                );
                const filteredVideoRoles = vRoles.filter(
                    (role) => role.Nombre !== 'Soft Delete'
                );

                setAllRoles(filteredRoles);
                setVideoRoles(filteredVideoRoles);
            } catch {
                setError('Error al cargar roles. Intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user, permisos, permisosLoading, idVideo]);

    return { loading, error, allRoles, videoRoles };
};

/**
 * Modifica un video existente.
 *
 * @returns {object} - Objeto con la respuesta de éxito o error
 */
export const useModifyVideo = () => {
    const { user } = useAuth();
    const { permisos, loading: permisosLoading } = usePermisos();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    /**
     * Modifica un video existente.
     * @param {*} video - Objeto con los datos del video a modificar
     * @returns {Promise<object>} - Respuesta del backend
     */
    const modify = async (video) => {
        if (!user?.email || permisosLoading) {
            return;
        }

        if (!permisos.includes(PERM_UPDATE_USER_GUIDE)) {
            setError('Sin permiso para modificar manuales.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await patchVideo(video, user.email);
            setResponse(response);
            return response;
        } catch {
            setError('Error al modificar el video. Intente nuevamente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, response, modify };
};
