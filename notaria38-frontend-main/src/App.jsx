import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './presentation/routes/AppRouter';
import { AuthProvider } from './presentation/contexts/AuthContext';

/**
 * Componente principal de la aplicación.
 * @returns {JSX.Element} El componente App.
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;
