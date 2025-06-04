// src/presentation/components/Permisos.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente de control de acceso: renderiza `children` si el usuario
 * posee al menos uno de los permisos indicados.
 *
 * @param {object}   props
 * @param {string[]} props.permisos     - Lista de permisos requeridos (OR lógico).
 * @param {ReactNode} props.children    - Elementos a renderizar si está autorizado.
 * @param {ReactNode} [props.fallback]  - Elementos a renderizar mientras se cargan 
 * permisos o en caso de error/autorización denegada.
 */
export default function Permisos({ permisos: requiredPermisos, children, fallback = null }) {
  const { permisos, permisosLoading } = useAuth();

  // Mientras carga permisos, mostramos fallback si existe
  if (permisosLoading) {
    return fallback;
  }

  // Si no tiene ninguno de los permisos requeridos, mostramos fallback
  const tieneAlguno = requiredPermisos.some(p => permisos.includes(p));
  if (!tieneAlguno) {
    return fallback;
  }

  // Usuario autorizado
  return <>{children}</>;
}

Permisos.propTypes = {
  permisos: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};
