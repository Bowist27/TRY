/**
 * Componente de estilo de tarjeta para filas.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Contenido de la tarjeta.
 * @returns {JSX.Element} - Componente de tarjeta.
 */
export default function CardRow({ children, className = '' }) {
  return (
    <div
      className={
        'relative bg-white p-4 rounded-lg shadow flex flex-col ' +
                'sm:flex-row items-start sm:items-center ' +
                className
      }
    >
      {children}
    </div>
  );
}