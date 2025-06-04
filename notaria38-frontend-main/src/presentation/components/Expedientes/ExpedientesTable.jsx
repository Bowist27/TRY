import { useNavigate } from 'react-router-dom';
import DataTable from '../DataTable';
import StatusBadge from '../StatusBadge';
import EncargadoCell from '../EncargadoCell';
import DateCell from '../DateCell';

/**
 * Tabla de expedientes con lógica de renderizado condicional según permisos
 *
 * @param {object} props - Propiedades del componente
 * @param {Array} props.columns - Configuración de columnas
 * @param {Array} props.data - Datos a mostrar
 * @param {string} props.error - Mensaje de error si existe
 * @param {string} props.query - Término de búsqueda actual
 * @returns {JSX.Element} Tabla de expedientes
 */
export default function ExpedientesTable({ columns, data, error, query }) {
  const navigate = useNavigate();

  /**
   * Renderiza el contenido de cada celda según la columna
   *
   * @param {object} exp - Expediente actual
   * @param {object} column - Columna actual
   * @returns {JSX.Element|null} Contenido de la celda o null si no aplica
   */
  const renderCell = (exp, column) => {
    switch (column.key) {
      case 'status':
        return <StatusBadge status={exp.status} />;
      case 'titleTramite':
        return exp.titleTramite;
      case 'cliente':
        return <span>{exp.nombreCliente}</span>;
      case 'encargado':
        if (column.canAssign) {
          return (
            <EncargadoCell
              encargado={exp.idAsignado}
              nombreAsignado={exp.nombreAsignado}
              expedienteId={exp.idExpediente}
            />
          );
        }
        return <span>{exp.nombreAsignado}</span>;
      case 'updateDate':
        return (
          <DateCell
            updateDate={exp.updateDate}
            endDate={exp.endDate}
            startDate={exp.startDate}
          />
        );
      default:
        return null;
    }
  };

  /**
   * Renderiza el contenido de un elemento de fila
   *
   * @param {object} exp - Expediente actual
   * @param {number} index - Índice de la fila
   * @param {string} rowClass - Clase CSS para la fila
   * @returns {JSX.Element} Elemento de fila renderizado
   */
  const renderRow = (exp, index, rowClass) => (
    <tr
      key={`${exp.idExpediente}-${index}`}
      className={rowClass}
      onClick={() => navigate(`/expedientes/${exp.idExpediente}`)}
    >
      {columns.map((column, colIndex) => (
        <td
          key={`${column.key}-${colIndex}`}
          className={`px-6 py-4 ${
            colIndex === 0
              ? 'rounded-l-lg'
              : colIndex === columns.length - 1
                ? 'rounded-r-lg'
                : ''
          } ${column.key === 'titleTramite' ? 'font-medium' : ''}`}
          onClick={
            column.key === 'encargado'
              ? (encargado) => encargado.stopPropagation()
              : undefined
          }
        >
          {renderCell(exp, column)}
        </td>
      ))}
    </tr>
  );

  return (
    <div className='overflow-x-auto'>
      <DataTable
        columns={columns}
        data={data}
        rowClassName='bg-white rounded-lg shadow border border-[#E5E4E2] hover:bg-orange-50 cursor-pointer'
        emptyMessage={
          error
            ? error
            : query
              ? 'No se encontraron trámites para tu búsqueda.'
              : 'No hay trámites disponibles.'
        }
        renderRow={renderRow}
      />
    </div>
  );
}
