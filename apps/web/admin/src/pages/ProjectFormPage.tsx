import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProjectCreate, type ProjectUpdate } from '@portfolio/shared';

export const ProjectFormPage = () => {
  const { id } = useParams<{ id: string }>(); // UUID from URL if editing
  const navigate = useNavigate();
  const { apiKey } = useAuth();
  
  const [formData, setFormData] = useState<Partial<ProjectCreate>>({
    title: '', slug: '', short_description: '', challenge: '', 
    solution: '', impact: '', is_draft: true, is_featured: false, tag_ids: []
  });

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    if (id) {
      adminApi.listProjects().then(list => {
        const existing = list.find(p => p.id === id);
        if (existing) {
          // Map AdminRead fields to Form fields
          setFormData({ ...existing, tag_ids: existing.tags.map(t => t.id) });
        }
      });
    }
  }, [id, adminApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await adminApi.updateProject(id, formData as ProjectUpdate);
      } else {
        await adminApi.createProject(formData as ProjectCreate);
      }
      navigate('/dashboard');
    } catch (err) {
      alert("Save failed. Check console for FastAPI/Pydantic errors.");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{id ? 'Edit Project' : 'New Project'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <input 
          placeholder="Title" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          required 
        />
        <input 
          placeholder="Slug (e.g., my-cool-project)" 
          value={formData.slug} 
          onChange={e => setFormData({...formData, slug: e.target.value})} 
          required 
        />
        <textarea 
          placeholder="Short Description" 
          value={formData.short_description} 
          onChange={e => setFormData({...formData, short_description: e.target.value})} 
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <label>
            <input type="checkbox" checked={formData.is_draft} onChange={e => setFormData({...formData, is_draft: e.target.checked})} />
            Is Draft
          </label>
          <label>
            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
            Featured
          </label>
        </div>

        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
          {id ? 'Update Project' : 'Create Project'}
        </button>
        <button type="button" onClick={() => navigate('/dashboard')}>Cancel</button>
      </form>
    </div>
  );
};