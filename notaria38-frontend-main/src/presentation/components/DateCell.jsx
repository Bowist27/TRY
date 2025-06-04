/**
 * Componente para mostrar la fecha de modificación de un expediente.
 * 
 * @param {Object} props - Props del componente.
 * @param {string} props.updateDate - Fecha de la última actualización.
 * @param {string} props.endDate - Fecha de finalización.
 * @param {string} props.startDate - Fecha de inicio.
 * @returns {JSX.Element} - Componente que muestra la fecha de modificación o un mensaje.
 */
export default function DateCell({ updateDate, endDate, startDate }) {
  if (updateDate) {return <span>{updateDate}</span>;}
  if (endDate) {return <span>{endDate}</span>;}
  if (startDate) {return <span>{startDate}</span>;}
  return <span>No se ha modificado</span>;
}