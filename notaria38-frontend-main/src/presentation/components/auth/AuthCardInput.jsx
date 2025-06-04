export default function AuthCardInput ({
  name,
  id,
  type = 'text',
  placeholder = '',
  maxLength = 100,
  onChange,
  required = false,
  inputMode,
  pattern,
  value,
  children,
}) {
  return (
    <div className="my-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {children}
      </label>
      <input
        name={name}
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        onChange={onChange}
        value={value}
        inputMode={inputMode}
        pattern={pattern}
        className={`mt-1 block w-full border-gray-300 p-2 border-b-1 
          focus:border-[#D07024] focus:ring-[#D07024]`}
      />
    </div>
  );
};
