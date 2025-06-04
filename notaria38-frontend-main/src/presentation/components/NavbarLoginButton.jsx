export default function NavbarLoginButton({ handleLogin, loading }) {
  return (
    <button
      onClick={handleLogin}
      className={`border border-white px-5 py-2 rounded-full text-sm font-light 
        hover:bg-white hover:text-orange-600 transition cursor-pointer`}
      disabled={loading}
    >
      {loading ? 'Cargando…' : 'Iniciar sesión'}
    </button>
  );
}
