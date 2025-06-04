// src/presentation/components/ToasterWithOffset.jsx
import { Toaster } from 'react-hot-toast';
import { useNavbarHeight } from '../contexts/navbarHeight';

/**
 * Componente funcional que renderiza el sistema de notificaciones `Toaster`
 * de `react-hot-toast`, ajustando su posición vertical en función de la altura
 * dinámica de la barra de navegación (`navbarHeight`) y aplicando estilos
 * personalizados para mejorar la visibilidad y legibilidad de los toasts.
 *
 * @function ToasterWithOffset
 * @returns {JSX.Element} Elemento JSX que representa el componente Toaster.
 */
export default function ToasterWithOffset() {
  const { navbarHeight } = useNavbarHeight();

  return (
    <Toaster
      position='top-right'
      toastOptions={{
        style: {
          marginTop: `${navbarHeight + 16}px`,
          fontSize: '16px',
          padding: '16px 24px',
          minWidth: '300px',
          borderRadius: '8px',
        },
      }}
    />
  );
}
