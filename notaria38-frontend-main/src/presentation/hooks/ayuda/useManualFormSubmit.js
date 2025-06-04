import { isValidVideoURL, transformYouTubeURL } from './useValidUrl';
import { toManualFormModel } from '../../../domain/models/ayuda/postVideosModel';
import { useModifyVideo } from '../../../application/useCases/ayuda/modifyVideo';
import { useCrearManual } from './useCrearManual'; 

/**
 * Hook para manejar el envío manual del formulario de creación/edición de videos.
 * @param {*} param0 - Parámetros del hook
 * @returns {Function} handleSubmit
 */
export function useManualFormSubmit({
    videoToEdit,
    setErrorMessage,
    setSuccessMessage,
    refetchVideos,
    onSave,
    onClose,
    setTitulo,
    setVideoURL,
    setSelectedRoles,
    selectedRoles,
    title,
    videoURL,
    mode,
    allRoles
}) {
    const { modify } = useModifyVideo();
    const { crearManual } = useCrearManual(refetchVideos);

    /**
     * Función para manejar el envío del formulario.
     * @param {*} event - Evento del formulario
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title?.trim()) {
            setErrorMessage('El manual debe tener un título');
            return;
        }

        if (!videoURL?.trim()) {
            setErrorMessage('El manual debe tener un enlace');
            return;
        }


        if (!isValidVideoURL(videoURL)) {
            setErrorMessage('El enlace debe ser de YouTube o Google Drive.');
            return;
        }

        const urlToSave = transformYouTubeURL(videoURL);

        if (mode === 'edit') {
            try {
                setErrorMessage(null);

                const dataToSend = toManualFormModel({
                    videoId: videoToEdit?.videoId,
                    title,
                    url: urlToSave,
                    roles: selectedRoles,
                });

                const response = await modify(dataToSend);

                if (response?.message) {
                    setSuccessMessage(response.message);
                    await refetchVideos();
                    if (onSave) {
                        onSave(dataToSend);
                    }
                } else {
                    setErrorMessage('Error al modificar el video. Intente más tarde.');
                }

                setTitulo('');
                setVideoURL('');
                setSelectedRoles([]);
                onClose();
            } catch {
                setErrorMessage('Error al modificar manual. Intente más tarde.');
                onClose();
            }
        } else {
            try {
                setErrorMessage(null);
                const rolesIds = selectedRoles
                    .map(nombre => {
                        const found = allRoles.find(
                            role => role.Nombre === nombre
                        );
                        return found?.roleId;
                    })
                    .filter(Boolean); 

                const rolesToSubmit = Array.from(new Set([...rolesIds, 5]));

                const dataToSend = toManualFormModel({
                    videoId: null,
                    title,
                    url: urlToSave,
                    roles: rolesToSubmit,
                });

                await crearManual(dataToSend);

                if (onSave) {
                    onSave(dataToSend);
                }

                setSuccessMessage && setSuccessMessage('El manual se ha creado correctamente.');
                setTitulo('');
                setVideoURL('');
                setSelectedRoles([]);
                onClose();
            } catch {
                setErrorMessage('Error al crear el manual. Intente más tarde.');
                onClose();
            }
        }
    };

    return handleSubmit;
}