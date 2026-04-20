// apps/web/admin/pages/ProjectManagementPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProjectAdminRead } from '@portfolio/shared';
import { GenericTable, type Column } from '../components/shared/GenericTable';

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent row click navigation
    if (!confirm("Delete project?")) return;
    try {
      await adminApi.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err);
    }
  };

  const columns: Column<ProjectAdminRead>[] = [
    {
      header: 'Project',
      render: (p) => (
        <div className="flex items-center gap-3">
          {p.is_featured && (
            <span title="Featured Project" className="text-amber-400 text-lg">★</span>
          )}
          <div>
            <div className="font-bold text-gray-900">{p.title}</div>
            <div className="text-xs text-gray-500 font-mono">/{p.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (p) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
          p.is_draft 
            ? 'bg-amber-50 text-amber-700 border-amber-100' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
        }`}>
          {p.is_draft ? 'Draft' : 'Published'}
        </span>
      ),
    },
    {
      header: 'Tags',
      render: (p) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {p.tags.map(t => (
            <span key={t.id} className="text-gray-400 text-[10px] italic">
              #{t.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Created',
      render: (p) => (
        <span className="text-gray-600 text-xs">
          {new Date(p.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (p) => (
        <div className="space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`edit/${p.id}`);
            }}
            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={(e) => handleDelete(e, p.id)}
            className="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-8 italic text-gray-500">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">Manage your portfolio work and case studies.</p>
        </div>
        <button 
          onClick={() => navigate('new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all"
        >
          + New Project
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {projects.length > 0 ? (
          <GenericTable 
            items={projects} 
            columns={columns} 
            onRowClick={(p) => navigate(`edit/${p.id}`)}
          />
        ) : (
          <div className="p-12 text-center text-gray-400 italic">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};