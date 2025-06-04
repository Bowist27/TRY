import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useReadExpedientes } from '../hooks/expedientes/useReadExpedientes';
import { useAuth } from '../hooks/useAuth';
import useExpedientesColumns from '../hooks/expedientes/useExpedientesColumns';
import useExpedientesData from '../hooks/expedientes/useExpedientesData';
import ExpedientesHeader from '../components/Expedientes/ExpedientesHeader';
import ExpedientesTable from '../components/Expedientes/ExpedientesTable';
import Pagination from '../components/Pagination';
import LoadingScreen from '../components/LoadingScreen';
import {
  PERM_VIEW_PROCESS,
  PERM_VIEW_ACTIVE_APPLICATIONS,
  PERM_VIEW_ASSIGNED_APPLICATIONS,
  PERM_VIEW_GROUP_APPLICATIONS,
} from '../../application/util/permissions';

/**
 * Página principal de expedientes que muestra una tabla de trámites
 * con funcionalidades de búsqueda, ordenamiento y paginación.
 *
 * @returns {JSX.Element} Componente de la página de expedientes.
 */
export default function Expedientes() {
  // 1. Estados y hooks
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('descending');
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Datos y autenticación
  const { expedientes, loading: expLoading, error } = useReadExpedientes();
  const { user, permisos, permisosLoading, totpRequired, isTotpVerified } = useAuth();

  // 3. Verificar permisos
  const hasAnyPerm = [
    PERM_VIEW_PROCESS,
    PERM_VIEW_ACTIVE_APPLICATIONS,
    PERM_VIEW_ASSIGNED_APPLICATIONS,
    PERM_VIEW_GROUP_APPLICATIONS,
  ].some((p) => permisos.includes(p));

  // 4. Procesar datos usando hooks personalizados
  const columns = useExpedientesColumns(permisos, sortOrder, setSortOrder);
  const { paginated, totalPages } = useExpedientesData(
    expedientes,
    query,
    sortOrder,
    currentPage
  );

  // 5. Validaciones y loading
  if (permisosLoading || expLoading) {
    return <LoadingScreen />;
  }

  if (!user?.email || (totpRequired && !isTotpVerified) || !hasAnyPerm) {
    return <Navigate to='/404' replace />;
  }

  // 6. Renderizado
  return (
    <section className='bg-gray-50 mx-auto px-4 py-6 w-full md:w-4/5 max-w-screen-xl'>
      <ExpedientesHeader
        onSearch={(term) => {
          setQuery(term);
          setCurrentPage(1);
        }}
        permisos={permisos}
      />

      <ExpedientesTable columns={columns} data={paginated} error={error} query={query} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}
