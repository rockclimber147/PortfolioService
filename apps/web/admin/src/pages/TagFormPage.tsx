// apps/web/admin/pages/TagFormPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type TagCreate, type TagUpdate } from '@portfolio/shared';

// apps/web/admin/pages/TagFormPage.tsx
export const TagFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiKey } = useAuth();
  
  // Update state to hold both name and slug
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const adminApi = useMemo(() => new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]);

  useEffect(() => {
    if (id) {
      adminApi.listTags().then(list => {
        const existing = list.find(t => t.id === id);
        if (existing) {
          setFormData({ name: existing.name, slug: existing.slug || '' });
        }
      });
    }
  }, [id, adminApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await adminApi.updateTag(id, formData);
      } else {
        await adminApi.createTag(formData);
      }
      navigate('/dashboard');
    } catch (err) { alert("Save failed"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm w-full max-w-md">
        <h1 className="text-xl font-bold mb-6">{id ? 'Edit Tag' : 'New Tag'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tag Name</label>
            <input 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. TypeScript"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Slug</label>
            <input 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              placeholder="e.g. typescript"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Save
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};