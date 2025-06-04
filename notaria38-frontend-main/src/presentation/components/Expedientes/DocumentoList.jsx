import DocumentoIcon from './DocumentoIcon';
import Status from './Status';
import CommentsPreview from './CommentsPreview';
import DocumentoActions from './DocumentoActions';
import Permiso from '../Permiso';
import { PERM_UPDATE_DOCUMENT_STATUS } from '../../../application/util/permissions';

/**
 * Componente de la página de Trámites.
 *
 * Muestra la lista de trámites disponibles, permite visualizar detalles
 * y, si se tiene permiso, iniciar un expediente.
 *
 * @function DocumentoList
 * @param {object} root0 - Props del componente.
 * @param {object} root0.doc - Documento a mostrar.
 * @param {Array} root0.comentariosDoc - Comentarios del documento.
 * @param {object} root0.acceso - Permisos de acceso.
 * @param {string} root0.rowClassName - Clase CSS para la fila.
 * @param {Function} root0.onDelete - Función para eliminar el documento.
 * @param {Function} root0.onUpload - Función para subir el documento.
 * @param {Function} [root0.onClick] - Función para manejar el click en la fila.
 * @returns {JSX.Element} Elemento JSX de la página de trámites.
 */
export default function DocumentoList({
  doc,
  comentariosDoc,
  acceso,
  rowClassName,
  onDelete,
  onUpload,
  onClick,
}) {
  const isClickable = typeof onClick === 'function';

  return (
    <tr
      key={doc.documentId}
      className={`${rowClassName} ${isClickable ? 'cursor-pointer hover:bg-orange-50' : ''}`}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyPress={
        isClickable
          ? (exa) => {
            if (exa.key === 'Enter') {
              onClick();
            }
          }
          : undefined
      }
    >
      {/* Columna 1: Ícono */}
      <td className='px-6 py-4 rounded-l-lg'>
        <DocumentoIcon url={doc.url} />
      </td>
      {/* Columna 2: Tipo y nombre */}
      <td className='px-6 py-4'>
        <h3 className='font-semibold'>{doc.type}</h3>
        <p className='text-xs text-gray-600'>
          {doc.fileName || 'No se ha subido un archivo'}
        </p>
      </td>
      {/* Columna 3: Estado */}
      <td className='px-6 py-4'>
        <Status status={doc.status} />
      </td>
      {/* Columna 4: Comentarios */}
      <td className='px-6 py-4' onClick={(exa) => exa.stopPropagation()}>
        <CommentsPreview comentarios={comentariosDoc} />
      </td>
      {/* Columna 5: Acciones */}
      <td className='px-6 py-4 rounded-r-lg' onClick={(exa) => exa.stopPropagation()}>
        <Permiso permiso={PERM_UPDATE_DOCUMENT_STATUS}>
          <DocumentoActions
            acceso={acceso}
            documento={doc}
            onDelete={(exa) => {
              exa.stopPropagation();
              onDelete(doc.documentId);
            }}
            onUpload={(exa) => {
              exa.stopPropagation();
              onUpload(doc.documentId);
            }}
            onClick={(exa) => {
              exa.stopPropagation();
              isClickable && onClick();
            }}
          />
        </Permiso>
      </td>
    </tr>
  );
}
