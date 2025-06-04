import { useMemo } from 'react';

/**
 * Hook personalizado para manejar la lógica de datos de expedientes:
 * - Filtrado por término de búsqueda
 * - Ordenamiento por fecha
 * - Paginación
 *
 * @param {Array} expedientes - Lista completa de expedientes
 * @param {string} query - Término de búsqueda
 * @param {string} sortOrder - Orden ('ascending' o 'descending')
 * @param {number} currentPage - Página actual
 * @param {number} pageSize - Tamaño de página (default: 10)
 * @returns {object} Datos procesados y metadata
 */
export default function useExpedientesData(
    expedientes,
    query,
    sortOrder,
    currentPage,
    pageSize = 10
) {
    /**
     * Función auxiliar para obtener fecha comparable
     *
     * @param {object} exp - Expediente con fechas
     * @returns {Date|null} Fecha formateada o null si no hay fecha
     */
    const getDate = (exp) => {
        const dateString = exp.updateDate || exp.endDate || exp.startDate;
        if (!dateString) {
            return null;
        }
        const [day, month, year, hour, min] = dateString.split(/[- :]/);
        return new Date(`${year}-${month}-${day}T${hour}:${min}`);
    };

    // Filtrar y ordenar expedientes
    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();

        // Filtrar por término de búsqueda
        let results = expedientes;
        if (term) {
            results = results.filter((exp) =>
                [exp.status, exp.titleTramite, exp.nombreAsignado, exp.nombreCliente]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(term)
            );
        }

        // Ordenar por fecha
        return [...results].sort((expA, expB) => {
            const dateA = getDate(expA);
            const dateB = getDate(expB);

            if (!dateA && !dateB) {
                return 0;
            }
            if (!dateA) {
                return 1;
            }
            if (!dateB) {
                return -1;
            }

            return sortOrder === 'descending' ? dateB - dateA : dateA - dateB;
        });
    }, [expedientes, query, sortOrder]);

    // Calcular paginación
    const totalPages = Math.ceil(filtered.length / pageSize);

    // Obtener elementos de la página actual
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, currentPage, pageSize]);

    return {
        filtered,
        paginated,
        totalPages,
        pageSize,
        isEmpty: filtered.length === 0,
    };
}
