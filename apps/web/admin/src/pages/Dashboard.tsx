// apps/web/admin/pages/Dashboard.tsx
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProjectAdminRead } from '@portfolio/shared';
import { useNavigate } from 'react-router-dom';
import { ProjectTable } from '../components/ProjectTable';

export const Dashboard = () => {
  const { apiKey, logout } = useAuth();
  const [projects, setProjects] = useState<ProjectAdminRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), 
    [apiKey]
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await adminApi.listProjects(); 
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [adminApi]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will permanently remove the project from Supabase.")) return;
    try {
      await adminApi.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert("Delete failed: " + err);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 italic">
      Syncing with AWS/Supabase...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Portfolio Admin</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/projects/new')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all text-sm"
            >
              + New Project
            </button>
            <button 
              onClick={logout} 
              className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
              <p className="text-gray-500 text-sm">Full CRUD control over your portfolio items.</p>
            </div>
          </div>
          
          <ProjectTable projects={projects} onDelete={handleDelete} />
        </section>
      </main>
    </div>
  );
};