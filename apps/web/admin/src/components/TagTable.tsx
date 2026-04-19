// apps/web/admin/components/TagTable.tsx
import { type TagRead } from '@portfolio/shared';
import { useNavigate } from 'react-router-dom';

interface TagTableProps {
  tags: TagRead[];
  onDelete: (id: string) => void;
}

export const TagTable = ({ tags, onDelete }: TagTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-50 uppercase text-gray-700 font-semibold text-xs italic">
          <tr>
            <th className="px-6 py-4">Tag Name</th>
            <th className="px-6 py-4">ID / Slug Reference</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tags.map((tag) => (
            <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-bold text-gray-900">
                #{tag.name}
              </td>
              <td className="px-6 py-4 font-mono text-xs text-gray-500">
                {tag.id}
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button 
                  onClick={() => navigate(`/dashboard/tags/edit/${tag.id}`)}
                  className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(tag.id)}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};