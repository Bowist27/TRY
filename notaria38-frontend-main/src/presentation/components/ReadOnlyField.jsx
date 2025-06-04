/**
 * Componente que muestra un campo de solo lectura con estilo de formulario
 * @param {object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.value - Valor del campo
 * @returns {JSX.Element} - Componente de campo de solo lectura
 */
const ReadOnlyField = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p 
      className="border-b border-gray-400 pb-1 text-gray-800 cursor-not-allowed"
      title="Este campo no es editable"
    >
      {value || '—'}
    </p>
  </div>
);

export default ReadOnlyField;