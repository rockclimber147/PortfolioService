// apps/web/admin/pages/ExperienceFormPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ExperienceCreate, type ExperienceUpdate } from '@portfolio/shared';
import { TagSelector } from '../components/TagSelector';

export const ExperienceFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiKey } = useAuth();
  
  const [formData, setFormData] = useState<Partial<ExperienceCreate>>({
    company: '', role: '', location: 'Vancouver, BC',
    start_date: '', end_date: '', is_current: false,
    description: '', long_description: '', company_url: '', tag_ids: []
  });

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    if (id) {
      adminApi.listExperiences().then(list => {
        const existing = list.find(e => e.id === id);
        if (existing) {
          setFormData({
            ...existing,
            // Format dates for HTML input (YYYY-MM-DD)
            start_date: existing.start_date.split('T')[0],
            end_date: existing.end_date ? existing.end_date.split('T')[0] : '',
            tag_ids: existing.tags.map(t => t.id)
          } as any);
        }
      });
    }
  }, [id, adminApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up end_date if currently employed
    const submissionData = {
      ...formData,
      end_date: formData.is_current ? null : formData.end_date
    };

    try {
      if (id) {
        await adminApi.updateExperience(id, submissionData as ExperienceUpdate);
      } else {
        await adminApi.createExperience(submissionData as ExperienceCreate);
      }
      navigate('/dashboard/experience');
    } catch (err) {
      alert("Save failed. Check console for details.");
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard/experience')} className="text-gray-400 hover:text-gray-600">← Back</button>
            <h1 className="text-xl font-bold text-gray-900">{id ? 'Edit Experience' : 'New Experience'}</h1>
          </div>
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm">
            {id ? 'Save Changes' : 'Add Experience'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company</label>
                  <input className={inputClass} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input className={inputClass} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className={labelClass}>Brief Summary</label>
                <textarea rows={2} className={inputClass} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>

              <div>
                <label className={labelClass}>Key Achievements (Markdown)</label>
                <textarea rows={8} className={inputClass} value={formData.long_description} onChange={e => setFormData({...formData, long_description: e.target.value})} required />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600" 
                    checked={formData.is_current} 
                    onChange={e => setFormData({...formData, is_current: e.target.checked})} 
                  />
                  <span className="text-sm font-medium text-gray-700">Currently Work Here</span>
                </label>

                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" className={inputClass} value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
                </div>

                {!formData.is_current && (
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input type="date" className={inputClass} value={formData.end_date ?? undefined} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Company Website</label>
                <input className={inputClass} placeholder="https://..." value={formData.company_url ?? undefined} onChange={e => setFormData({...formData, company_url: e.target.value})} />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className={labelClass}>Tech Stack</label>
                <TagSelector 
                  adminApi={adminApi} 
                  selectedTagIds={formData.tag_ids || []} 
                  onChange={ids => setFormData({...formData, tag_ids: ids})} 
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};