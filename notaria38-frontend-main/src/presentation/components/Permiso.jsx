// src/presentation/components/Permiso.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
export default function Permiso({ permiso, children, fallback = null }) {
  const { permisos, permisosLoading } = useAuth();

  if (permisosLoading) return fallback;
  if (!permisos.includes(permiso)) return fallback;
  return <>{children}</>;
}

Permiso.propTypes = {
  permiso: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};
