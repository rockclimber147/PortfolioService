import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AdminAuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import './App.css';

export default function App() {
  const { apiKey } = useAuth();

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* If no key, always show Login. If key exists, go to Dashboard */}
        <Route 
          path="/" 
          element={apiKey ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={apiKey ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}