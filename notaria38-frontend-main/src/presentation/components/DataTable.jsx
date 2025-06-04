/**
 * Componente de tabla de datos.
 *
 * @param {object} props - Props del componente.
 * @param {Array} props.columns - Columnas de la tabla.
 * @param {Array} props.data - Datos a mostrar en la tabla.
 * @param {Function} props.renderRow - Función para renderizar cada fila.
 * @param {string} [props.emptyMessage] - Mensaje a mostrar si no hay datos.
 * @param {string} [props.rowClassName] - Clase CSS para las filas de la tabla.
 * @returns {JSX.Element} - Componente de tabla de datos.
 */
export default function DataTable({
  columns,
  data,
  renderRow,
  emptyMessage = 'No hay datos.',
  rowClassName = '',
}) {
  return (
    <div 
      className='bg-white rounded-lg shadow overflow-x-auto h-auto lg:h-[70vh]'
    >
      <table 
        className='min-w-full divide-y divide-gray-200 bg-transparent'
      >
        <thead>
          <tr className='bg-gray-100'>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                className='px-6 py-4 text-left text-lg font-extrabold 
                    text-gray-800 sticky top-0 z-10 bg-gray-100'
                style={{ borderBottom: '2px solid #e5e7eb' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className='text-center py-8 text-gray-500'
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) =>
              renderRow(row, index, `${rowClassName} mb-3`)
            )
          )}
        </tbody>
      </table>
    </div>
  );
}