// apps/web/admin/pages/EducationManagementPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type EducationRead } from '@portfolio/shared';
import { GenericTable, type Column } from '../components/shared/GenericTable';

export const EducationManagementPage = () => {
  const { apiKey } = useAuth();
  const navigate = useNavigate();
  const [education, setEducation] = useState<EducationRead[]>([]);
  const [loading, setLoading] = useState(true);

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), [apiKey]
  );

  useEffect(() => {
    adminApi.listEducation()
      .then(setEducation)
      .finally(() => setLoading(false));
  }, [adminApi]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stop GenericTable's onRowClick
    if (!confirm("Delete education record?")) return;
    try {
      await adminApi.deleteEducation(id);
      setEducation(prev => prev.filter(edu => edu.id !== id));
    } catch (err) {
      alert(err);
    }
  };

  const columns: Column<EducationRead>[] = [
    {
      header: 'Institution',
      render: (edu) => (
        <>
          <div className="font-bold text-gray-900">{edu.institution}</div>
          <div className="text-xs text-gray-500">{edu.location}</div>
        </>
      ),
    },
    {
      header: 'Degree / Major',
      render: (edu) => (
        <>
          <div className="text-gray-700 font-medium">{edu.certificate}</div>
          <div className="text-xs text-gray-500 italic">{edu.major}</div>
        </>
      ),
    },
    {
      header: 'Dates',
      render: (edu) => (
        <div className="text-gray-600 font-mono text-xs">
          {edu.start_date} — {edu.end_date || 'Present'}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (edu) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
          edu.is_draft 
            ? 'bg-amber-50 text-amber-700 border-amber-100' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
        }`}>
          {edu.is_draft ? 'Draft' : 'Live'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (edu) => (
        <div className="space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`edit/${edu.id}`);
            }}
            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={(e) => handleDelete(e, edu.id)}
            className="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-8 italic text-gray-500">Loading education records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Education</h1>
          <p className="text-sm text-gray-500">Manage your academic background and certifications.</p>
        </div>
        <button 
          onClick={() => navigate('new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all"
        >
          + Add Education
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {education.length > 0 ? (
          <GenericTable 
            items={education} 
            columns={columns} 
            onRowClick={(edu) => navigate(`edit/${edu.id}`)}
          />
        ) : (
          <div className="p-12 text-center text-gray-400 italic">
            No education records found.
          </div>
        )}
      </div>
    </div>
  );
};