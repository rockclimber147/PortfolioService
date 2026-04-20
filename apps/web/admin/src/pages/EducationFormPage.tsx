import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type EducationCreate, type EducationUpdate } from '@portfolio/shared';

export const EducationFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { apiKey } = useAuth();
  
  const [formData, setFormData] = useState<Partial<EducationCreate>>({
    institution: '',
    certificate: '',
    major: '',
    start_date: '',
    end_date: '',
    location: 'Vancouver, BC',
    description: '',
    is_draft: true // Default to true for new records
  });

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    if (id) {
      adminApi.listEducation().then(list => {
        const existing = list.find(e => e.id === id);
        if (existing) setFormData(existing);
      });
    }
  }, [id, adminApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await adminApi.updateEducation(id, formData as EducationUpdate);
      } else {
        await adminApi.createEducation(formData as EducationCreate);
      }
      navigate('/dashboard/education');
    } catch (err) {
      alert("Save failed. Please check the format of your inputs.");
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard/education')} className="text-gray-400 hover:text-gray-600">← Back</button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">{id ? 'Edit Education' : 'Add Education'}</h1>
              {formData.is_draft && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded border border-amber-100">
                  Draft
                </span>
              )}
            </div>
          </div>
          <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all active:scale-95">
            Save Record
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Institution</label>
              <input 
                className={inputClass} 
                placeholder="e.g. British Columbia Institute of Technology"
                value={formData.institution} 
                onChange={e => setFormData({...formData, institution: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className={labelClass}>Certificate / Degree</label>
              <input 
                className={inputClass} 
                placeholder="e.g. Bachelor of Science"
                value={formData.certificate} 
                onChange={e => setFormData({...formData, certificate: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className={labelClass}>Major / Field of Study</label>
              <input 
                className={inputClass} 
                placeholder="e.g. Computer Systems Technology"
                value={formData.major} 
                onChange={e => setFormData({...formData, major: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className={labelClass}>Start Date (MM/YY)</label>
              <input 
                className={inputClass} 
                placeholder="09/23"
                value={formData.start_date} 
                onChange={e => setFormData({...formData, start_date: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className={labelClass}>End Date (MM/YY or Present)</label>
              <input 
                className={inputClass} 
                placeholder="12/25"
                value={formData.end_date || ''} 
                onChange={e => setFormData({...formData, end_date: e.target.value})} 
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Location</label>
              <input 
                className={inputClass} 
                value={formData.location || ''} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Additional Details (Optional)</label>
              <textarea 
                rows={4} 
                className={inputClass} 
                placeholder="GPA, Awards, or notable coursework..."
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            {/* Draft Toggle Section */}
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                  checked={formData.is_draft} 
                  onChange={e => setFormData({...formData, is_draft: e.target.checked})} 
                />
                <div>
                  <span className="block text-sm font-semibold text-gray-700">Save as Draft</span>
                  <span className="block text-xs text-gray-500">Drafts are hidden from the public portfolio site.</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};