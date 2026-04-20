// apps/web/admin/components/ExperienceTable.tsx
import { type ExperienceRead } from '@portfolio/shared';
import { useNavigate } from 'react-router-dom';

interface ExperienceTableProps {
  experiences: ExperienceRead[];
  onDelete: (id: string) => void;
}

export const ExperienceTable = ({ experiences, onDelete }: ExperienceTableProps) => {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-50 uppercase text-gray-700 font-semibold italic text-[10px] tracking-wider">
          <tr>
            <th className="px-6 py-4">Company & Role</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Tags</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {experiences.map((exp) => (
            <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">{exp.company}</div>
                <div className="text-xs text-gray-500 font-medium">{exp.role}</div>
              </td>
              <td className="px-6 py-4">
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
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {exp.tags.map(t => (
                    <span key={t.id} className="text-gray-400 text-xs italic">
                      #{t.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button 
                  onClick={() => navigate(`/dashboard/experience/edit/${exp.id}`)}
                  className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(exp.id)}
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