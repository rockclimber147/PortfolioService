import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AdminAuthContext';
import { AdminApiService, type ProjectSummary } from '@portfolio/shared';

export const Dashboard = () => {
  const { apiKey, logout } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminApi = useMemo(() => 
    new AdminApiService(import.meta.env.VITE_API_URL, apiKey!), 
    [apiKey]
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        // On the admin side, we want to see everything
        const data = await adminApi.listProjects(); 
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [adminApi]);

  if (loading) return <div className="p-8">Syncing with AWS/Supabase...</div>;

  return (
    <div className="admin-dashboard">
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <h1>Portfolio Admin</h1>
        <div>
          <button onClick={() => {/* TODO: Navigate to Create Page */}} style={{ marginRight: '10px' }}>
            + New Project
          </button>
          <button onClick={logout} style={{ backgroundColor: '#ff4444', color: 'white' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>⚠️ {error}</div>}

        <section>
          <h2>Project Management</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th>Title</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 0' }}>
                    <strong>{project.title}</strong>
                    <br />
                    <small style={{ color: '#666' }}>/{project.slug}</small>
                  </td>
                  <td>
                    {/* Visual indicator for Draft vs Published */}
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem',
                    //   background: project.is_draft ? '#fff3cd' : '#d4edda',
                    //   color: project.is_draft ? '#856404' : '#155724'
                    }}>
                      {/* {project.is_draft ? 'Draft' : 'Published'} */}
                    </span>
                  </td>
                  <td>
                    {project.tags.map(t => (
                      <span key={t.id} style={{ marginRight: '4px', fontSize: '0.75rem', opacity: 0.7 }}>
                        #{t.name}
                      </span>
                    ))}
                  </td>
                  <td>{new Date(project.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => {/* TODO: Edit Logic */}}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};