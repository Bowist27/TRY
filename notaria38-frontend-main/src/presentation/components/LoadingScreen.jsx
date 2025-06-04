/**
 * Componente para mostrar mensaje de carga.
 * 
 * @returns {JSX.Element} - Componente de pantalla de carga.
 */
export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f2ea]">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-4 
          border-b-4 mx-auto mb-4"
          style={{ borderTopColor: '#D07024', borderBottomColor: '#D07024' }}
        >
        </div>
        <p className="text-gray-700 font-medium text-lg">Cargando...</p>
      </div>
    </div>
  );
}