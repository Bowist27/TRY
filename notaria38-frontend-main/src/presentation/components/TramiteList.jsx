import TramiteCard from './TramiteCard';

/**
 * Lista de trámites con selección.
 * 
 * @param {object} props - Propiedades del componente
 * @param {Array} props.tramites - Lista de trámites
 * @param {number} props.selectedId - ID del trámite seleccionado
 * @param {Function} props.onSelect - Función para seleccionar trámite
 * @returns {JSX.Element} - Componente de lista de trámites
 */
export default function TramiteList({
  tramites,
  selectedId,
  onSelect,
}) {
  if (!tramites || tramites.length === 0) {
    return (
      <p className='ml-6'>
        No hay trámites disponibles.
      </p>
    );
  }

  return (
    <ul className='mt-3 mb-3 flex flex-col gap-3'>
      {tramites.map((tramite) => (
        <TramiteCard
          key={tramite.ID_Tramite}
          tramite={tramite}
          isSelected={tramite.ID_Tramite === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
