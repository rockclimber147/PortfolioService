import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProfileUpdate } from '@portfolio/shared';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { apiKey } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileUpdate>>({});

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    adminApi.getProfile()
      .then(data => setFormData(data))
      .catch(err => console.error("Failed to load profile", err))
      .finally(() => setLoading(false));
  }, [adminApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.updateProfile(formData as ProfileUpdate);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed: " + err);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1";

  if (loading) return <div className="p-10 text-center italic">Loading profile data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600">← Back</button>
            <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          
          <div className="md:col-span-2">
            <label className={labelClass}>Full Name</label>
            <input 
              className={inputClass} 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Short Summary</label>
            <input 
              className={inputClass} 
              value={formData.summary || ''} 
              onChange={e => setFormData({...formData, summary: e.target.value})} 
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Long Summary (Markdown/About Me)</label>
            <textarea 
              rows={6}
              className={inputClass} 
              value={formData.long_summary || ''} 
              onChange={e => setFormData({...formData, long_summary: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input 
              type="email"
              className={inputClass} 
              value={formData.email || ''} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input 
              className={inputClass} 
              value={formData.location || ''} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>GitHub URL</label>
            <input 
              className={`${inputClass} font-mono text-xs`}
              value={formData.github_url || ''} 
              onChange={e => setFormData({...formData, github_url: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input 
              className={`${inputClass} font-mono text-xs`}
              value={formData.linkedin_url || ''} 
              onChange={e => setFormData({...formData, linkedin_url: e.target.value})} 
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Profile Photo URL</label>
            <input 
              className={`${inputClass} font-mono text-xs`}
              placeholder="https://supabase-url.com/bucket/me.jpg"
              value={formData.profile_photo_url || ''} 
              onChange={e => setFormData({...formData, profile_photo_url: e.target.value})} 
            />
          </div>
        </form>
      </main>
    </div>
  );
};