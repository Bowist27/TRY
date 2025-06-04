import Title from './Title';
import CustomButton from './CustomButton';

/**
 * Muestra los detalles de un trámite seleccionado.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.tramite - El trámite seleccionado.
 * @param {object} props.detalle - Los detalles del trámite.
 * @param {string|null} props.errorDetalle - Mensaje de error si 
 * la carga de detalles falló.
 * @param {boolean} props.tienePermiso - Indica si el usuario tiene permiso 
 * para iniciar el trámite.
 * @param {Function} props.onIniciarExpediente - Función a llamar para iniciar 
 * el expediente.
 * @param {string} props.userEmail - Email del usuario actual.
 * @returns {JSX.Element|null} - Componente con detalles del trámite o error.
 */
export default function TramiteDetail({
  tramite,
  detalle,
  errorDetalle,
  tienePermiso,
  onIniciarExpediente,
  userEmail,
}) {
  if (!tramite) {
    return (
      <p className='text-gray-400'>
        No se ha seleccionado ningún trámite.
      </p>
    );
  }

  /**
   * Renderiza un documento requerido como elemento de lista.
   * 
   * @param {object} documento - Documento requerido a renderizar.
   * @returns {JSX.Element} - Elemento de lista con el nombre del documento.
   */
  const renderDocumento = (documento) => (
    <li key={documento.idDocumentoRequerido || documento.ID_DocumentoRequerido} >
      {documento.tipoReq || documento.Tipo_req}
    </li>
  );

  return (
    <>
      <div className='w-fit'>
        <Title>{tramite.Titulo}</Title>
      </div>
      <section
        className='
          flex flex-col
          bg-[#fafafa]
          shadow-md
          rounded-lg
          p-6
          border border-[#E5E4E2]
          gap-6
          overflow-y-auto h-full
        '
      >
        {errorDetalle && <p className='text-red-500'>
            Error al cargar detalles: {errorDetalle}</p>}

        {!errorDetalle && detalle && (
          <>
            <p className='text-gray-600 whitespace-pre-line'>
              {detalle.Descripcion}
            </p>

            {detalle.DocumentosRequeridos?.length > 0 && (
              <div>
                <h3 className='text-2xl font-semibold text-[#D07024] mb-2'>
                  Documentos requeridos:
                </h3>
                <ul className='list-disc list-inside text-gray-600 mb-4'>
                  {detalle.DocumentosRequeridos.map(renderDocumento)}
                </ul>

                {tienePermiso && (
                  <CustomButton
                    isPrimary
                    onClick={() =>
                      onIniciarExpediente(tramite.Titulo, userEmail)
                    }
                  >
                    Iniciar trámite
                  </CustomButton>
                )}

                {!tienePermiso && !userEmail &&(
                  <CustomButton
                    isPrimary
                    disabled
                    className='opacity-60 cursor-not-allowed'
                  >
                    Inicia sesión para iniciar trámite
                  </CustomButton>
                )}
              </div>
            )}
          </>
        )}

        {!detalle && !errorDetalle && (
          <p className='text-gray-400'>
            Selecciona un trámite para ver el detalle.
          </p>
        )}
      </section>
    </>
  );
}