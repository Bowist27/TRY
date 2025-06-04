import { useState } from 'react';

/**
 * Componente de entrada personalizado.
 *
 * @param {*} param0 - Props del componente.
 * @param {string} param0.name - Nombre del campo.
 * @param {string} param0.id - ID del campo.
 * @param {string} [param0.type='text'] - Tipo de entrada (por defecto 'text').
 * @param {string} [param0.placeholder] - Texto de marcador de posición.
 * @param {number} [param0.maxLength=100] - Longitud máxima del campo (por defecto 100).
 * @param {Function} param0.onChange - Función para manejar cambios en el campo.
 * @param {boolean} [param0.required=false] - Indica si el campo es obligatorio.
 * @param {string} [param0.inputMode] - Modo de entrada para el campo.
 * @param {string} [param0.pattern] - Patrón de validación para el campo.
 * @param {string} [param0.value] - Valor del campo.
 * @param {string} [param0.errorMessage] - Mensaje de error a mostrar si hay un error.
 * @param {React.ReactNode} param0.children - Contenido del label del campo.
 * @returns {JSX.Element} Componente de entrada.
 */
export default function CustomInput({
  name,
  identifier,
  type = 'text',
  placeholder,
  maxLength = 100,
  onChange,
  required = false,
  inputMode,
  pattern,
  value,
  errorMessage,
  children,
}) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='my-4'>
      <label htmlFor={identifier} className='block text-sm font-medium text-gray-700'>
        <div className='flex justify-between items-center w-full'>
          <span>{children}</span>
          {type === 'password' && (
            <button
              type='button'
              onClick={() => setShowConfirmPassword((previous) => !previous)}
              className='text-sm text-[#D07024] hover:underline ml-2'
            >
              {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          )}
        </div>
      </label>
      <input
        name={name}
        id={identifier}
        type={type === 'password' && showConfirmPassword ? 'text' : type}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        onChange={onChange}
        value={value}
        inputMode={inputMode}
        pattern={pattern}
        className={`mt-1 block w-full p-2 border-b-2 ${
          errorMessage ? 'border-red-500' : 'border-gray-300'
        } focus:border-[#D07024] focus:ring-[#D07024] placeholder:text-gray-400 placeholder:text-sm`}
      />
      {errorMessage && <p className='mt-1 text-sm text-red-600'>{errorMessage}</p>}
    </div>
  );
}
