import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type TagRead } from '@portfolio/shared';
import { TagTable } from '../components/TagTable';

export const TagManagementPage = () => {
  const { apiKey } = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState<TagRead[]>([]);
  const [loading, setLoading] = useState(true);

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    adminApi.listTags()
      .then(setTags)
      .finally(() => setLoading(false));
  }, [adminApi]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete tag? This might affect projects using it.")) return;
    try {
      await adminApi.deleteTag(id);
      setTags(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err);
    }
  };

  if (loading) return <div className="italic text-gray-500">Loading tags...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-500">Categorize your projects by technology and skills.</p>
        </div>
        <button 
          onClick={() => navigate('new')} // Relative to /dashboard/tags
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm"
        >
          + New Tag
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <TagTable tags={tags} onDelete={handleDelete} />
      </div>
    </div>
  );
};