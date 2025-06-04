import React, { useState } from 'react';
import { useExpedientes } from '../../presentation/hooks/useExpedientes';

/**
 * Página de contacto con sección de expedientes y escrituras.
 *
 * @function Contacto
 * @returns {JSX.Element} Componente de la página de contacto.
 */
export default function Contacto() {
  const [selectedNumber, setSelectedNumber] = useState(123);
  const { data, loading, error } = useExpedientes(selectedNumber);

  /**
   * Maneja el cambio del número seleccionado para consultar expedientes.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event 
   * - Evento de cambio del input numérico.
   * @returns {void}
   */
  const handleNumberChange = (event) => {
    setSelectedNumber(Number(event.target.value));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Contáctanos</h1>

      <main>
        <h2 className="text-2xl font-semibold mb-4">Expedientes y Escrituras</h2>

        {/* Input para seleccionar el número */}
        <div className="mb-4">
          <label className="mr-2">Selecciona un número:</label>
          <input
            type="number"
            value={selectedNumber}
            onChange={handleNumberChange}
            className="border rounded px-2 py-1"
          />
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : data.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">PK</th>
                  <th className="border p-2">Expediente</th>
                  <th className="border p-2">Asignación</th>
                  <th className="border p-2">Escritura</th>
                  <th className="border p-2">Firma</th>
                  <th className="border p-2">Abogado</th>
                  <th className="border p-2">Notario</th>
                  <th className="border p-2">Notas</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.PK}>
                    <td className="border p-2">{item.PK}</td>
                    <td className="border p-2">{item.EXPEDIENTE}</td>
                    <td className="border p-2">{item.ASIGNACION}</td>
                    <td className="border p-2">{item.ESCRITURA}</td>
                    <td className="border p-2">{item.FIRMA}</td>
                    <td className="border p-2">{item.ABOGADO}</td>
                    <td className="border p-2">{item.NOTARIO}</td>
                    <td className="border p-2">
                      <input
                        value={item.NOTAS || ''}
                        onChange={() => {}}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
