// apps/web/admin/pages/TagManagementPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type TagRead } from '@portfolio/shared';
import { GenericTable, type Column } from '../components/shared/GenericTable';

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete tag? This might affect projects using it.")) return;
    try {
      await adminApi.deleteTag(id);
      setTags(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err);
    }
  };

  // Define columns for the GenericTable
  const columns: Column<TagRead>[] = [
    {
      header: 'Tag Details',
      render: (tag) => (
        <>
          <div className="font-bold text-gray-900">#{tag.name}</div>
          <div className="text-xs text-gray-500 font-mono">{tag.slug}</div>
        </>
      ),
    },
    {
      header: 'Status',
      render: (tag) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
          tag.is_draft 
            ? 'bg-amber-50 text-amber-700 border-amber-100' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
        }`}>
          {tag.is_draft ? 'Draft' : 'Live'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (tag) => (
        <div className="space-x-3">
          <button 
            onClick={() => navigate(`edit/${tag.id}`)}
            className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={(e) => handleDelete(e, tag.id)}
            className="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-8 italic text-gray-500">Loading tags...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-500">Categorize your projects by technology and skills.</p>
        </div>
        <button 
          onClick={() => navigate('new')}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 shadow-sm transition-colors"
        >
          + New Tag
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {tags.length > 0 ? (
          <GenericTable 
            items={tags} 
            columns={columns} 
            onRowClick={(tag) => navigate(`edit/${tag.id}`)}
          />
        ) : (
          <div className="p-12 text-center text-gray-400 italic border-t border-gray-100">
            No tags created yet.
          </div>
        )}
      </div>
    </div>
  );
};