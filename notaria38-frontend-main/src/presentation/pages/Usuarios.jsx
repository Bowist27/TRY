// src/presentation/pages/Usuarios.jsx
import { useState, useMemo, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUsuarios } from '../hooks/useUsuarios';
import SearchBar from '../components/SearchBar';
import Title from '../components/Title';
import Pagination from '../components/Pagination';
import ConfirmationModal from '../components/ConfirmationModal';
import SuccessAlert from '../components/SuccessAlert';
import ErrorAlert from '../components/ErrorAlert';
import {
  PERM_VIEW_USERS,
  PERM_UPDATE_ROLE_PERMISSIONS,
  PERM_REMOVE_ACCOUNT_ADMIN,
} from '../../application/util/permissions';
import { useDeleteUser } from '../hooks/usuario/useDeleteUser';
import UserRow from '../components/UserRow';

export default function Usuarios() {
  const { user, permisos, permisosLoading } = useAuth();
  const {
    usuarios,
    roles,
    loading: usuariosLoading,
    updateUserRole,
    reload,
  } = useUsuarios();
  const { deleteUser, loading: deleting } = useDeleteUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDeleteEmail, setUserToDeleteEmail] = useState('');
  const menuReferences = useRef({});

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId &&
        menuReferences.current[openMenuId] &&
        !menuReferences.current[openMenuId].contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const visible = usuarios.filter(u => u.Rol !== 'Soft Delete');
    if (!query) return visible;
    return visible.filter(u =>
      [u.Nombre, u.Apellido_paterno, u.Apellido_materno, u.Correo, u.Rol]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery, usuarios]);

  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredUsers]);

  if (permisosLoading || usuariosLoading) return null;
  if (!user?.email || !permisos.includes(PERM_VIEW_USERS)) {
    return <Navigate to='/' replace />;
  }

  const canUpdate = permisos.includes(PERM_UPDATE_ROLE_PERMISSIONS);
  const canDelete = permisos.includes(PERM_REMOVE_ACCOUNT_ADMIN);

  const handleRoleSelect = (userId, userName, newRoleId) => {
    const sel = roles.find(r => r.ID_Rol === newRoleId);
    setPendingChange({ userId, userName, newRoleId, newRoleName: sel?.Nombre || '' });
    setModalOpen(true);
  };

  const confirmChange = async () => {
    try {
      await updateUserRole(pendingChange.userId, pendingChange.newRoleId);
      setSuccessMessage(`Rol de ${pendingChange.userName} cambiado a "${pendingChange.newRoleName}"`);
      setSearchQuery('');
      setCurrentPage(1);
    } catch {
      setErrorMessage('Error al actualizar el rol');
    } finally {
      setModalOpen(false);
      setPendingChange(null);
    }
  };

  const handleDeleteClick = (email) => {
    setUserToDeleteEmail(email);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteUser(userToDeleteEmail, user.email);
      await reload();
      setSuccessMessage(`Usuario ${userToDeleteEmail} eliminado`);
      setSearchQuery('');
      setCurrentPage(1);
    } catch {
      setErrorMessage('Error al eliminar usuario');
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      {successMessage && <SuccessAlert message={successMessage} onClose={() => setSuccessMessage('')} />}
      {errorMessage && <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />}

      <section className='bg-gray-50 mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full sm:w-3/4 max-w-screen-lg'>
        <Title>Usuarios</Title>
        <div className='mb-4'>
          <SearchBar placeholder='Buscar usuario...' onSearch={q => { setSearchQuery(q); setCurrentPage(1); }} />
        </div>

        {paginatedUsers.length === 0 ? (
          <p className='text-center text-gray-500 py-6'>No se encontraron usuarios.</p>
        ) : (
          <>
            <div className='space-y-4'>
              {paginatedUsers.map(u => (
                <UserRow
                  key={u.id}
                  user={u}
                  roles={roles}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                  isSelf={u.Correo === user.email}
                  isMenuOpen={openMenuId === u.id}
                  toggleMenu={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                  handleRoleSelect={handleRoleSelect}
                  handleDeleteClick={handleDeleteClick}
                  menuReferences={menuReferences}
                />
              ))}
            </div>
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
          </>
        )}
      </section>

      <ConfirmationModal
        isOpen={modalOpen}
        title='Confirmar cambio de rol'
        message={`¿Está seguro de cambiar el rol de ${pendingChange?.userName} a "${pendingChange?.newRoleName}"?`}
        onConfirm={confirmChange}
        onCancel={() => { setModalOpen(false); setPendingChange(null); }}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        title='¿Eliminar usuario?'
        message={`¿Estás seguro de eliminar a ${userToDeleteEmail}?`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowConfirmModal(false)}
        loading={deleting}
      />
    </>
  );
}
