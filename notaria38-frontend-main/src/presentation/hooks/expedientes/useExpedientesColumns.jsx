import { useMemo } from 'react';
import SortArrow from '../../../presentation/components/SortArrow';
import {
  PERM_VIEW_PROCESS,
  PERM_VIEW_ACTIVE_APPLICATIONS,
  PERM_VIEW_ASSIGNED_APPLICATIONS,
  PERM_VIEW_GROUP_APPLICATIONS,
} from '../../../application/util/permissions';

/**
 * Hook para manejar la lógica de las columnas de la tabla de expedientes,
 * de acuerdo a los permisos del usuario.
 *
 * @param {string[]} permisos - Lista de permisos del usuario.
 * @param {string} sortOrder - Orden de clasificación actual ('ascending' o 'descending').
 * @param {Function} setSortOrder - Función para actualizar el orden de clasificación.
 * @returns {Array} - Array de objetos que representan las columnas de la tabla.
 */
export default function useExpedientesColumns(permisos, sortOrder, setSortOrder) {
  return useMemo(() => {
    const baseColumns = [
      { key: 'status', label: 'Estado' },
      { key: 'titleTramite', label: 'Nombre del trámite' },
    ];

    if (
      permisos.includes(PERM_VIEW_PROCESS) ||
      permisos.includes(PERM_VIEW_GROUP_APPLICATIONS)
    ) {
      baseColumns.push(
        { key: 'cliente', label: 'Cliente' },
        { key: 'encargado', label: 'Encargado', canAssign: true }
      );
    } else if (permisos.includes(PERM_VIEW_ACTIVE_APPLICATIONS)) {
      baseColumns.push({ key: 'encargado', label: 'Encargado', canAssign: false });
    } else if (permisos.includes(PERM_VIEW_ASSIGNED_APPLICATIONS)) {
      baseColumns.push({ key: 'cliente', label: 'Cliente' });
    }

    baseColumns.push({
      key: 'updateDate',
      label: (
        <button
          type='button'
          className='flex items-center gap-1'
          onClick={() =>
            setSortOrder(sortOrder === 'descending' ? 'ascending' : 'descending')
          }
          title={
            sortOrder === 'descending' ? 'Ordenar más antiguo' : 'Ordenar más reciente'
          }
        >
          Modificado
          <SortArrow direction={sortOrder} className='ml-1' />
        </button>
      ),
    });

    return baseColumns;
  }, [permisos, sortOrder, setSortOrder]);
}
