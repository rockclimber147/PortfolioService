// apps/web/admin/pages/ExperienceManagementPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ExperienceRead } from '@portfolio/shared';
import { GenericTable, type Column } from '../components/shared/GenericTable';

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this work experience? This action cannot be undone.")) return;
    try {
      await adminApi.deleteExperience(id);
      setExperiences(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert("Delete failed: " + err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const columns: Column<ExperienceRead>[] = [
    {
      header: 'Company & Role',
      render: (exp) => (
        <>
          <div className="font-bold text-gray-900">{exp.company}</div>
          <div className="text-xs text-gray-500 font-medium">{exp.role}</div>
        </>
      ),
    },
    {
      header: 'Duration',
      render: (exp) => (
        <>
          <div className="text-gray-700 font-medium">
            {exp.is_current ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Present
              </span>
            ) : (
              <span>{exp.end_date ? formatDate(exp.end_date) : ''}</span>
            )}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-tight">
            Started {formatDate(exp.start_date)}
          </div>
        </>
      ),
    },
    {
      header: 'Status',
      render: (exp) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
          exp.is_draft 
            ? 'bg-amber-50 text-amber-700 border-amber-100' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
        }`}>
          {exp.is_draft ? 'Draft' : 'Live'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (exp) => (
        <div className="space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`edit/${exp.id}`);
            }}
            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={(e) => handleDelete(e, exp.id)}
            className="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
          <GenericTable 
            items={experiences} 
            columns={columns} 
            onRowClick={(exp) => navigate(`edit/${exp.id}`)}
          />
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