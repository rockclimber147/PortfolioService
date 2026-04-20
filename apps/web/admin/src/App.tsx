import './App.css';
import type { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AdminAuthContext';
import { Login } from './pages/Login';
import { ProjectFormPage } from './pages/ProjectFormPage';
import { TagFormPage } from './pages/TagFormPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminLayout } from './components/AdminLayout';
import { ProjectManagementPage } from './pages/ProjectManagementPage';
import { TagManagementPage } from './pages/TagManagementPage';
import { ExperienceManagementPage } from './pages/ExperienceManagementPage';
import { ExperienceFormPage } from './pages/ExperienceFormPage';

export default function App() {
  const { apiKey } = useAuth();

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return apiKey ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/" 
          element={apiKey ? <Navigate to="/dashboard" /> : <Login />} 
        />

        {/* Protected Admin Shell */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* CORRECTED: The index attribute on a Route component */}
          <Route index element={<Navigate to="projects" replace />} />
          
          <Route path="experience" element={<ExperienceManagementPage />} />
          <Route path="experience/new" element={<ExperienceFormPage />} />
          <Route path="experience/edit/:id" element={<ExperienceFormPage />} />
          
          <Route path="projects" element={<ProjectManagementPage />} />
          <Route path="projects/new" element={<ProjectFormPage />} />
          <Route path="projects/edit/:id" element={<ProjectFormPage />} />
          
          <Route path="tags" element={<TagManagementPage />} /> 
          <Route path="tags/new" element={<TagFormPage />} />
          <Route path="tags/edit/:id" element={<TagFormPage />} />
          
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}