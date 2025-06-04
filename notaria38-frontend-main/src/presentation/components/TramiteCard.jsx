/**
 * Componente para representar visualmente un trámite.
 * @param {object} props - Propiedades del componente
 * @param {object} props.tramite - Datos del trámite
 * @param {Function} props.onSelect - Función al hacer clic
 * @param {boolean} [props.isSelected] - Si el trámite está seleccionado
 * 
 * @returns {JSX.Element} Componente de tarjeta de trámite
 */
export default function TramiteCard({
  tramite,
  onSelect,
  isSelected = false,
}) {
  return (
    <div
      className={`p-4 rounded-lg shadow cursor-pointer transition 
        ${isSelected ? 'bg-orange-50' : 'bg-white'}
        hover:bg-orange-50`}
      onClick={() => onSelect(tramite.ID_Tramite)}
    >
      <h3 className='text-lg font-semibold text-gray-800'>
        {tramite.Titulo}
      </h3>
      <p className='text-sm text-gray-600'>
        {tramite.Descripcion}
      </p>
    </div>
  );
}
