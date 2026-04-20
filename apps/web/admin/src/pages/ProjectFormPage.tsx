// apps/web/admin/pages/ProjectFormPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProjectCreate, type ProjectUpdate } from '@portfolio/shared';
import { TagSelector } from '../components/TagSelector';
import { ImageUpload } from '../components/ImageUpload';

export const ProjectFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiKey } = useAuth();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<ProjectCreate>>({
    title: '', 
    slug: '', 
    short_description: '', 
    challenge: '', 
    solution: '', 
    impact: '', 
    is_draft: true, 
    is_featured: false, 
    tag_ids: [], 
    thumbnail_url: ''
  });

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    if (id) {
      adminApi.listProjects().then(list => {
        const existing = list.find(p => p.id === id);
        if (existing) {
          setFormData({ ...existing, tag_ids: existing.tags.map(t => t.id) });
        }
      });
    }
  }, [id, adminApi]);

  // Helper to sync slug with title automatically
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === prev.title?.toLowerCase().replace(/\s+/g, '-') ? slug : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalFormData = { ...formData };

      if (pendingFile) {
        const uploadedUrl = await adminApi.uploadImage(pendingFile);
        finalFormData.thumbnail_url = uploadedUrl;
      }

      if (id) {
        await adminApi.updateProject(id, finalFormData as ProjectUpdate);
      } else {
        await adminApi.createProject(finalFormData as ProjectCreate);
      }

      navigate('/dashboard/projects');
    } catch (err) {
      console.error(err);
      alert("Save failed. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard/projects')} className="text-gray-400 hover:text-gray-600 transition-colors">← Back</button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{id ? 'Edit Project' : 'New Project'}</h1>
              {formData.is_draft && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded border border-amber-100">
                  Draft
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard/projects')}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold rounded-lg shadow-sm transition-all active:scale-95"
            >
              {isSaving ? 'Saving...' : id ? 'Save Changes' : 'Publish Project'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <label className={labelClass}>Project Title</label>
                <input 
                  className={`${inputClass} text-lg font-medium`}
                  placeholder="e.g. 3D Particle Life Engine"
                  value={formData.title} 
                  onChange={e => handleTitleChange(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Short Description</label>
                <textarea 
                  rows={2}
                  className={inputClass}
                  placeholder="One sentence pitch..."
                  value={formData.short_description} 
                  onChange={e => setFormData({...formData, short_description: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <label className={labelClass}>The Challenge</label>
                  <textarea 
                    rows={4}
                    className={`${inputClass} font-mono text-xs`}
                    value={formData.challenge} 
                    onChange={e => setFormData({...formData, challenge: e.target.value})} 
                  />
                </div>
                <div>
                  <label className={labelClass}>The Solution</label>
                  <textarea 
                    rows={4}
                    className={`${inputClass} font-mono text-xs`}
                    value={formData.solution} 
                    onChange={e => setFormData({...formData, solution: e.target.value})} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Impact / Outcome</label>
                  <textarea 
                    rows={4}
                    className={`${inputClass} font-mono text-xs`}
                    value={formData.impact} 
                    onChange={e => setFormData({...formData, impact: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ImageUpload 
              label="Project Thumbnail"
              value={formData.thumbnail_url ?? undefined}
              labelClass={labelClass}
              onFileSelect={(file) => setPendingFile(file)}
              onClearExisting={() => setFormData({ ...formData, thumbnail_url: '' })}
            />

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <label className={labelClass}>URL Slug</label>
                <input 
                  className={`${inputClass} font-mono text-xs`}
                  placeholder="particle-life-3d"
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})} 
                  required 
                />
              </div>

              <div className="space-y-3">
                <label className={labelClass}>Visibility & Status</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    checked={formData.is_draft} 
                    onChange={e => setFormData({...formData, is_draft: e.target.checked})} 
                  />
                  <div>
                    <span className="block text-sm font-semibold text-gray-700">Draft Mode</span>
                    <span className="block text-[10px] text-gray-500">Hidden from public view</span>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    checked={formData.is_featured} 
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})} 
                  />
                  <div>
                    <span className="block text-sm font-semibold text-gray-700">Featured</span>
                    <span className="block text-[10px] text-gray-500">Highlight on homepage</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className={labelClass}>Tags</label>
                <TagSelector 
                  adminApi={adminApi}
                  selectedTagIds={formData.tag_ids || []}
                  onChange={(newIds) => setFormData({ ...formData, tag_ids: newIds })}
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};