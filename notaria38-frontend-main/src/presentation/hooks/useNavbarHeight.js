import { useContext } from 'react';
import { NavbarHeightContext } from '../contexts/navbarHeight';

/**
 * Hook personalizado que proporciona el contexto de altura de la barra de navegación.
 *
 * @function useNavbarHeight
 * @returns {{ navbarReference: React.RefObject, navbarHeight: number }}
 * Objeto que contiene
 * la referencia a la navbar (`navbarReference`) y su altura en píxeles (`navbarHeight`).
 *
 * @example
 * const { navbarReference, navbarHeight } = useNavbarHeight();
 *
 * @description
 * Este hook debe utilizarse dentro de un árbol de componentes envuelto por
 * `NavbarHeightProvider`. Permite acceder a la altura de la navbar para ajustar
 * dinámicamente otros componentes (por ejemplo, evitar que un Toaster se superponga).
 */
export function useNavbarHeight() {
    return useContext(NavbarHeightContext);
}
