import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProjectAdminRead } from '@portfolio/shared';
import { ProjectTable } from '../components/ProjectTable';

export const ProjectManagementPage = () => {
  const { apiKey } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectAdminRead[]>([]);
  const [loading, setLoading] = useState(true);

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    adminApi.listProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [adminApi]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete project?")) return;
    try {
      await adminApi.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err);
    }
  };

  if (loading) return <div className="italic text-gray-500">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Manage your portfolio work and case studies.</p>
        </div>
        <button 
          onClick={() => navigate('new')} // Relative to /dashboard/projects
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm"
        >
          + New Project
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <ProjectTable projects={projects} onDelete={handleDelete} />
      </div>
    </div>
  );
};