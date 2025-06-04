/**
 * Convierte un objeto crudo en un modelo de abogado.
 * @param {*} raw - Objeto crudo que contiene los datos del abogado.
 * @returns {object} - Objeto con los datos del abogado.
 */
export function toAbogadoModel(raw) {
    return {
        userId: raw.ID_Usuario,
        name: raw.Nombre,
        firstLastName: raw.Apellido_paterno,
        secondLastName: raw.Apellido_materno,
    };
}

/**
 * Convierte una lista de objetos crudos en un modelo de lista de abogados.
 * @param {*} list - Lista de abogados en formato crudo.
 * @returns {Array<object>} - Lista de abogados en formato de modelo.
 */
export function toAbogadoListModel(list) {
    return Array.isArray(list) ? list.map(toAbogadoModel) : [];
}