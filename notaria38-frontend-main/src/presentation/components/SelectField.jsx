/**
 * Componente para visualizar y seleccionar opciones.
 * 
 * @param {string|number} value - Valor seleccionado.
 * @param {Function} onChange - Función a llamar al cambiar.
 * @param {Array} options - Opciones [{ value, label }].
 * @param {string} className - Clases CSS extra.
 * @param {boolean} disabled - Si está deshabilitado.
 * @returns {JSX.Element} Componente para seleccionar opciones.
 */
export default function SelectField({
  value,
  onChange,
  options,
  className = '',
  disabled = false,
  ...properties
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded px-2 py-1 text-sm
        focus:outline-none ${className}`}
      disabled={disabled}
      {...properties}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}