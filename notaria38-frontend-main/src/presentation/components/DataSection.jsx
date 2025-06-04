import React from 'react';
import ReadOnlyField from './ReadOnlyField';

/**
 * Componente que muestra una sección de datos con título y campos
 * @param {string} title - Título de la sección
 * @param {Array} fields - Array de objetos {label, value} para mostrar
 * @returns {JSX.Element}
 */
const DataSection = ({ title, fields }) => (
  <section className="mb-8">
    <h2 className="text-xl font-medium text-gray-800 mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field, index) => (
        <ReadOnlyField 
          key={index} 
          label={field.label} 
          value={field.value} 
        />
      ))}
    </div>
  </section>
);

export default DataSection;