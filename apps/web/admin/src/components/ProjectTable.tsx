// apps/web/admin/components/ProjectTable.tsx
import { type ProjectAdminRead } from '@portfolio/shared';
import { useNavigate } from 'react-router-dom';

interface ProjectTableProps {
  projects: ProjectAdminRead[];
  onDelete: (id: string) => void;
}

export const ProjectTable = ({ projects, onDelete }: ProjectTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-gray-50 uppercase text-gray-700 font-semibold italic text-[10px] tracking-wider">
          <tr>
            <th className="px-6 py-4">Project</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Tags</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">{project.title}</div>
                <div className="text-xs text-gray-500 font-mono">/{project.slug}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  project.is_draft 
                    ? 'bg-amber-50 text-amber-700 border-amber-100' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {project.is_draft ? 'Draft' : 'Published'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {project.tags.map(t => (
                    <span key={t.id} className="text-gray-400 text-xs italic">
                      #{t.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {new Date(project.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button 
                  onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
                  className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(project.id)}
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