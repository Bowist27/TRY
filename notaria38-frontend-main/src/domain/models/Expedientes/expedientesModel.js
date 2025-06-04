/**
 * Formatea una fecha en formato dd-mm-yyyy hh:mm
 *
 * @param {string} fechaString - Fecha en formato ISO 8601.
 * @returns {string|null} - Fecha formateada o null si la fecha es inválida.
 * @example formatFecha('2023-10-01T12:00:00Z') // '01-10-2023 12:00'
 */
export function formatFecha(fechaString) {
    if (!fechaString) {
        return null;
    }
    const date = new Date(fechaString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hour}:${min}`;
}

/**
 * Modelo que adapta la lista de expedientes de la API
 * a un formato adaptado al dominio.
 *
 * @param {Array} apiList - Lista de expedientes de la API.
 * @returns {Array} - Lista de expedientes adaptada al dominio.
 */
export function toExpedienteListModel(apiList) {
    return apiList.map((item) => ({
        idExpediente: item.ID_Expediente,
        startDate: formatFecha(item.Fecha_inicio),
        endDate: formatFecha(item.Fecha_fin),
        updateDate: formatFecha(item.Fecha_actualizacion),
        integranotLoad: item.PK_Integranot,
        status: item.Estado,
        idTramite: item.ID_Tramite,
        titleTramite: item.Titulo_tramite,
        idCliente: item.ID_Cliente ?? null,
        nombreCliente: item.Nombre_cliente ?? null,
        idAsignado: item?.ID_Asignado ?? null,
        nombreAsignado: item?.Nombre_asignado ?? 'Por asignar',
    }));
}
