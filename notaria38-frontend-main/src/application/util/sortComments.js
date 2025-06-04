/**
 * Ordena un array de comentarios por fecha, del más reciente al más antiguo.
 * @param {*} comentarios - Array de comentarios a ordenar.
 * @returns {Array} - Array de comentarios ordenados por fecha,
 * del más reciente al más antiguo.
 */
export function sortComments(comentarios) {
    if (!comentarios || !comentarios.length) {
        return [];
    }

    /**
     * Parsea una fecha en formato 'DD-MM-YYYY HH:mm' a un objeto Date.
     * @param {*} string - Fecha en formato 'DD-MM-YYYY HH:mm'
     * @returns {Date} - Objeto Date correspondiente a la fecha proporcionada.
     */
    const parseDate = (string) => {
        const [day, month, yearAndTime] = string.split('-');
        const [year, time] = yearAndTime.split(' ');
        return new Date(`${year}-${month}-${day}T${time || '00:00'}`);
    };
    return [...comentarios].sort(
        (commentA, commentB) =>
            parseDate(commentB.date) - parseDate(commentA.date)
    );
}