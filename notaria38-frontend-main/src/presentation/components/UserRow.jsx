// src/presentation/components/UserRow.jsx
import React from 'react';
import { User, MoreVertical, Trash2 } from 'lucide-react';
import SelectField from './SelectField';
import CardRow from './CardRow';
import Permiso from './Permiso';
import {
  PERM_UPDATE_ROLE_PERMISSIONS,
  PERM_REMOVE_ACCOUNT_ADMIN,
} from '../../application/util/permissions';

/**
 * Componente que renderiza una fila de usuario con información básica,
 * control de roles mediante un select y menú contextual para acciones adicionales.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.user - Objeto con los datos del usuario.
 * @param {Array} props.roles - Lista de roles disponibles para selección.
 * @param {boolean} props.canUpdate - Indica si el usuario actual puede actualizar roles.
 * @param {boolean} props.canDelete - Indica si el usuario actual puede eliminar usuarios.
 * @param {boolean} props.isSelf - Indica si el usuario renderizado es el usuario actual.
 * @param {boolean} props.isMenuOpen - Estado para controlar
 * si el menú contextual está abierto.
 * @param {Function} props.toggleMenu - Función para
 * alternar la apertura del menú.
 * @param {Function} props.handleRoleSelect - Callback para manejar cambio de rol.
 * @param {Function} props.handleDeleteClick - Callback para
 * manejar la eliminación del usuario.
 * @param {React.MutableRefObject} props.menuReferences - Ref
 * para manejar referencias a los menús contextuales.
 *
 * @returns {JSX.Element} Fila de usuario con controles y menú contextual.
 */
export default function UserRow({
  user,
  roles,
  canUpdate,
  canDelete,
  isSelf,
  isMenuOpen,
  toggleMenu,
  handleRoleSelect,
  handleDeleteClick,
  menuReferences,
}) {

  const isFixedRole = ['Cliente'].includes(user.Rol);

  return (
    <CardRow key={user.id} className='relative'>
      <div className='flex items-center space-x-3 flex-1 min-w-0'>
        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-blue-600'>
          <User size={20} />
        </div>
        <div className='text-sm 2-3/5 flex-1 min-w-0'>
          <div className='font-medium text-ellipsis md:text-clip overflow-hidden mr-2'>
            {user.Nombre} {user.Apellido_paterno} {user.Apellido_materno}
          </div>
          <div className='text-gray-500 text-ellipsis md:text-clip overflow-hidden mr-4'>{user.Correo}</div>
        </div>
      </div>

      {/* Menu roles */}
        <div className='flex items-center space-x-2 ml-4 sm:ml-0 sm:order-last'>
          <div className='mt-2 sm:mt-0 sm:order-none'>
            <Permiso permiso={PERM_UPDATE_ROLE_PERMISSIONS}>
              {canUpdate && !isSelf ? (
                isFixedRole ? (
                <span className='px-2 py-1 text-sm border border-gray-300 border rounded'>
                  {user.Rol}
                </span>
              ) : (
                roles.some((rol) => rol.ID_Rol === user.ID_Rol) ? (
                  <SelectField
                    className='w-40'
                    value={user.ID_Rol}
                    onChange={(event) => {
                    // calcular nombre completo o usar correo si está vacío
                    const fullName = [user.Nombre, user.Apellido_paterno, user.Apellido_materno]
                      .filter((n) => n && n.trim() !== '')
                      .join(' ');
                    const displayName = fullName || user.Correo;
                    handleRoleSelect(
                      user.id,
                      displayName,
                      Number(event.target.value)
                    );
                  }}
                    options={roles
                      .filter((rol) => rol.Nombre !== 'Soft Delete' && rol.Nombre !== 'Cliente')
                      .map((rol) => ({
                        value: rol.ID_Rol,
                        label: rol.Nombre,
                      }))}
                  />
                ) : (
                  <span className='px-2 py-1 text-sm border border-gray-300 border rounded'>
                    {user.Rol}
                  </span>
                )
              )
              ) : (
                <span className='px-2 py-1 text-sm border border-gray-300 border rounded'>{user.Rol}</span>
              )}
            </Permiso>
          </div>

          <div className='relative flex-shrink-0 ml-2'>
            <button
              onClick={() => toggleMenu(isMenuOpen ? null : user.id)}
              className='p-2 hover:bg-gray-100 rounded text-gray-600'
              aria-haspopup='true'
              aria-expanded={isMenuOpen}
              title='Más opciones'
            >
              <MoreVertical size={16} />
            </button>

            {isMenuOpen && (
              <div
                ref={(element) => (menuReferences.current[user.id] = element)}
                className='absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-10'
                role='menu'
              >
                <ul>
                  <Permiso permiso={PERM_REMOVE_ACCOUNT_ADMIN}>
                    {canDelete && !isSelf && (
                      <li>
                        <button
                          onClick={() => handleDeleteClick(user.Correo)}
                          className='flex items-center px-4 py-2 text-sm w-full hover:bg-gray-100'
                          role='menuitem'
                        >
                          <Trash2 className='mr-2 text-red-600' size={16} />
                          Eliminar
                        </button>
                      </li>
                    )}
                  </Permiso>
                </ul>
              </div>
            )}
          </div>
        </div>
    </CardRow>
  );
}