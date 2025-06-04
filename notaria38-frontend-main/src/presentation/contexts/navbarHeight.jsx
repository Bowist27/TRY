import { createContext, useContext, useState, useRef, useEffect } from 'react';

/**
 * Contexto que proporciona la referencia y altura dinámica de la barra de navegación.
 *
 * @constant {React.Context<{navbarReference: React.RefObject, navbarHeight: number}>}
 * @name NavbarHeightContext
 *
 * @description
 * Este contexto se utiliza para compartir
 * la altura de la barra de navegación (`navbarHeight`)
 * y su referencia (`navbarReference`) entre
 * componentes React sin necesidad de prop drilling.
 */
export const NavbarHeightContext = createContext();

/**
 * Proveedor de contexto que calcula y expone la altura de la barra de navegación
 * (`navbarHeight`) y su referencia (`navbarReference`) a través de un contexto React.
 *
 * @function NavbarHeightProvider
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children -
 * Componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element} Componente proveedor del contexto de altura de la navbar.
 *
 * @example
 * <NavbarHeightProvider>
 *   <App />
 * </NavbarHeightProvider>
 *
 * @description
 * Este componente debe envolver tu aplicación o las secciones relevantes para que
 * los componentes descendientes puedan acceder a la altura de la navbar mediante
 * el hook `useNavbarHeight()`. La altura se calcula después del montaje inicial.
 */
export function NavbarHeightProvider({ children }) {
  const navbarReference = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarReference.current) {
      setNavbarHeight(navbarReference.current.offsetHeight);
    }
  }, []);

  return (
    <NavbarHeightContext.Provider value={{ navbarReference, navbarHeight }}>
      {children}
    </NavbarHeightContext.Provider>
  );
}

/**
 * Hook personalizado que proporciona el contexto de altura de la barra de navegación.
 *
 * @function useNavbarHeight
 * @returns {{ navbarReference: React.RefObject, navbarHeight: number }}
 * Objeto que contiene la referencia a la navbar
 * (`navbarReference`) y su altura en píxeles (`navbarHeight`).
 *
 * @example
 * const { navbarReference, navbarHeight } = useNavbarHeight();
 *
 * @description
 * Este hook debe utilizarse dentro de un árbol de componentes envuelto por
 * `NavbarHeightProvider`. Permite acceder a la altura de la navbar para ajustar
 * dinámicamente otros componentes, como por ejemplo evitar que un Toaster se superponga.
 */
export function useNavbarHeight() {
  return useContext(NavbarHeightContext);
}
