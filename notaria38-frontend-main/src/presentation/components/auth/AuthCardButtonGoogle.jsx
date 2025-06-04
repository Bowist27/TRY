/**
 * Componente de botón para autenticación con Google
 * 
 * @component
 * @param {function} handleGoogleLogin: Función que maneja la autenticación con Google
 * @param {string} type: Tipo de acción ("login" o "register") para mostrar el texto 
 * adecuado
 * @returns {React.ReactNode}
 */
export default function AuthCardButtonGoogle({
  handleGoogleLogin,
  type = 'login',
}) {
  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className={`w-full bg-white py-2 rounded-md border border-gray-200 
        hover:bg-gray-100 transition duration-200 text-black 
        flex items-center justify-center cursor-pointer`}
    >
      <img
        // eslint-disable-next-line max-len
        src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png"
        alt="Google Logo"
        className="inline-block mr-4"
        width={22}
        height={22}
      />
      {type === 'login'
        ? 'Iniciar sesión con Google'
        : 'Registrar con Google'}
    </button>
  );
}
