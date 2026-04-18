import { useEffect, useState } from 'react';
import { ClientApiService, type ProjectSummary } from '@portfolio/shared';

const API_URL = import.meta.env.VITE_API_URL;
const clientApi = new ClientApiService(API_URL);

export const ProjectList = () => {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await clientApi.listProjects();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (projects.length === 0) return <div>No projects found.</div>;

  return (
    <div>
      <h2>Portfolio Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.title}</strong> - {project.short_description}
            <div>
              {project.tags.map(tag => (
                <small key={tag.id} style={{ marginRight: '5px', color: '#666' }}>
                  #{tag.name}
                </small>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};