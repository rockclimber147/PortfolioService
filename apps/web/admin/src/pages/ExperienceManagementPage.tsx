// apps/web/admin/pages/ExperienceManagementPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ExperienceRead } from '@portfolio/shared';
import { ExperienceTable } from '../components/ExperienceTable';

export const ExperienceManagementPage = () => {
  const { apiKey } = useAuth();
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState<ExperienceRead[]>([]);
  const [loading, setLoading] = useState(true);

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    adminApi.listExperiences()
      .then(setExperiences)
      .catch(err => console.error("Error loading experience list", err))
      .finally(() => setLoading(false));
  }, [adminApi]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this work experience? This action cannot be undone.")) return;
    try {
      await adminApi.deleteExperience(id);
      setExperiences(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert("Delete failed: " + err);
    }
  };

  if (loading) return <div className="p-8 italic text-gray-500">Loading work history...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Experience</h1>
          <p className="text-sm text-gray-500">Document your professional journey and key achievements.</p>
        </div>
        <button 
          onClick={() => navigate('new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all"
        >
          + Add Experience
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {experiences.length > 0 ? (
          <ExperienceTable experiences={experiences} onDelete={handleDelete} />
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-2 font-medium">No experience recorded yet.</div>
            <button 
              onClick={() => navigate('new')}
              className="text-blue-600 text-sm font-bold hover:underline"
            >
              Add your first job entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};