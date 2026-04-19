// apps/web/admin/pages/Dashboard.tsx
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProjectAdminRead, type TagRead } from '@portfolio/shared';
import { useNavigate } from 'react-router-dom';
import { ProjectTable } from '../components/ProjectTable';
import { TagTable } from '../components/TagTable';

export const Dashboard = () => {
  const { apiKey, logout } = useAuth();
  const [projects, setProjects] = useState<ProjectAdminRead[]>([]);
  const [tags, setTags] = useState<TagRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectData, tagData] = await Promise.all([
          adminApi.listProjects(),
          adminApi.listTags()
        ]);
        setProjects(projectData);
        setTags(tagData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [adminApi]);

  const handleProjectDelete = async (id: string) => {
    if (!confirm("Delete project?")) return;
    try {
      await adminApi.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert(err); }
  };

  const handleTagDelete = async (id: string) => {
    if (!confirm("Delete tag? This might affect projects using it.")) return;
    try {
      await adminApi.deleteTag(id);
      setTags(prev => prev.filter(t => t.id !== id));
    } catch (err) { alert(err); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 italic">Syncing...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Portfolio Admin</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/projects/new')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Project</button>
            <button onClick={() => navigate('/tags/new')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">+ Tag</button>
            <button onClick={() => navigate('/profile')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Edit Profile</button>
            <button onClick={logout} className="ml-4 text-gray-400 hover:text-red-600 text-sm">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-16">
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">⚠️ {error}</div>}

        {/* Projects Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <ProjectTable projects={projects} onDelete={handleProjectDelete} />
        </section>

        {/* Tags Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Tags</h2>
          <TagTable tags={tags} onDelete={handleTagDelete} />
        </section>
      </main>
    </div>
  );
};