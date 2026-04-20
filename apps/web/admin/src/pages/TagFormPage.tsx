// apps/web/admin/pages/TagFormPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService } from '@portfolio/shared';

export const TagFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiKey } = useAuth();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '', 
    is_draft: true 
  });

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    if (id) {
      adminApi.listTags().then(list => {
        const existing = list.find(t => t.id === id);
        if (existing) {
          setFormData({ 
            name: existing.name, 
            slug: existing.slug || '', 
            is_draft: existing.is_draft 
          });
        }
      });
    }
  }, [id, adminApi]);

  // Utility to auto-slugify if the slug field is empty
  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    setFormData(prev => ({ 
      ...prev, 
      name, 
      slug: prev.slug === '' || prev.slug === prev.name.toLowerCase().replace(/\s+/g, '-') ? slug : prev.slug 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await adminApi.updateTag(id, formData);
      } else {
        await adminApi.createTag(formData);
      }
      navigate('/dashboard');
    } catch (err) { 
      alert("Save failed"); 
    }
  };

  const labelClass = "block text-xs font-semibold text-gray-500 uppercase mb-1";
  const inputClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">{id ? 'Edit Tag' : 'New Tag'}</h1>
          {formData.is_draft && (
            <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded border border-amber-100">
              Draft
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Tag Name</label>
            <input 
              className={inputClass}
              placeholder="e.g. TypeScript"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Slug</label>
            <input 
              className={`${inputClass} font-mono text-sm`}
              placeholder="e.g. typescript"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          {/* New Draft Toggle */}
          <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
              checked={formData.is_draft} 
              onChange={e => setFormData({...formData, is_draft: e.target.checked})} 
            />
            <span className="text-sm font-medium text-gray-700">Mark as Draft (Hide from public)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
            >
              {id ? 'Update Tag' : 'Create Tag'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};