import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AdminAuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectFormPage } from './pages/ProjectFormPage'; // Import the new component
import './App.css';
import type { JSX } from 'react';

export default function App() {
  const { apiKey } = useAuth();

  // Helper to keep the JSX clean
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return apiKey ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public/Auth Route */}
        <Route 
          path="/" 
          element={apiKey ? <Navigate to="/dashboard" /> : <Login />} 
        />

        {/* Protected Dashboard */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />

        {/* Create Project Route */}
        <Route 
          path="/projects/new" 
          element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} 
        />

        {/* Edit Project Route (using the :id parameter) */}
        <Route 
          path="/projects/edit/:id" 
          element={<ProtectedRoute><ProjectFormPage /></ProtectedRoute>} 
        />

        {/* Optional: Catch-all redirect to / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}