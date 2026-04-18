import { useAuth } from './context/AdminAuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const { apiKey } = useAuth();

  // If we don't have a key, show login. 
  // If we do, show the app.
  return apiKey ? <Dashboard /> : <Login />;
}