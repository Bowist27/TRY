import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { NavbarHeightProvider } from '../src/presentation//contexts/navbarHeight.jsx';
import ToasterWithOffset from './presentation/components/ToasterWithOffset';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavbarHeightProvider>
      <App />
      <ToasterWithOffset />
    </NavbarHeightProvider>
  </StrictMode>
);
