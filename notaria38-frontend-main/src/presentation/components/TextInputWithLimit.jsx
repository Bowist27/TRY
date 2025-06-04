import { useRef } from 'react';

/**
 * Componente de input de texto con límite de caracteres.
 * @param {object} props - Props del componente
 * @param {string} props.inputId - ID del input
 * @param {string} props.label - Etiqueta del input
 * @param {string} props.value - Valor del input
 * @param {Function} props.onChange - Función para manejar el cambio de valor
 * @param {Function} props.onBlur - Función para manejar el evento onBlur
 * @param {number} props.maxLength - Longitud máxima del input
 * @param {string} [props.placeholder] - Placeholder del input
 * @param {boolean} [props.touched] - Indica si el input ha sido tocado
 * @param {boolean} [props.required] - Indica si el input es obligatorio
 * @param {boolean} [props.submitted] - Indica si el formulario ha sido enviado
 * @param {string} [props.as] - Tipo de input (input o textarea)
 * @returns {JSX.Element} - Componente de input de texto con límite de caracteres
 */
const TextInputWithLimit = ({
  inputId,
  label,
  value,
  onChange,
  onBlur,
  maxLength,
  placeholder = '',
  touched = false,
  required = false,
  submitted = false,
  as = 'input', // Para usar text area si es necesario
}) => {
  const hasError =
    value.length >= maxLength || (required && !value && (touched || submitted));

  const textAreaReference = useRef(null);

  /**
   * Maneja el cambio de tamaño del textarea.
   * @param {*} event - Evento de cambio del textarea
   */
  const handleTextareaChange = (event) => {
    if (textAreaReference.current) {
      textAreaReference.current.style.height = 'auto';
      textAreaReference.current.style.height = textAreaReference.current.scrollHeight + 'px';
    }
    onChange(event);
  };

  return (
    <div>
      <label htmlFor={inputId} className='block text-gray-800 font-medium mb-1'>
        {label} {required && <span className='text-red-600'>*</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          ref={textAreaReference}
          id={inputId}
          maxLength={maxLength}
          value={value}
          onChange={handleTextareaChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full bg-transparent border-b-2 py-2 placeholder-gray-400 
            focus:outline-none resize-none ${
              hasError ? 'border-red-600' : 'border-gray-800'
            } max-h-40 overflow-y-auto`}
          rows={1}
          style={{ minHeight: '2.5rem' }}
        />
      ) : (
        <input
          id={inputId}
          type='text'
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full bg-transparent border-b-2 py-2 placeholder-gray-400 
            focus:outline-none ${
        hasError ? 'border-red-600' : 'border-gray-800'
        }`}
        />
      )}

      <div className='flex justify-between text-xs mt-1'>
        <span className='text-gray-500'>
          {value.length} / {maxLength} caracteres
        </span>

        {value.length >= maxLength && (
          <span className='text-red-600'>Se alcanzó el límite</span>
        )}
        {required && !value && (touched || submitted) && (
          <p className='text-red-600'>Este campo es obligatorio</p>
        )}
      </div>
    </div>
  );
};

export default TextInputWithLimit;
