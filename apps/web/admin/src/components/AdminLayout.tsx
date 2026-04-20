import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AdminAuthContext';

export const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming you have a logout function

  const navItems = [
    { label: 'Work Experience', path: '/dashboard/experience' },
    { label: 'Projects', path: '/dashboard/projects' },
    { label: 'Tags', path: '/dashboard/tags' },
    { label: 'Profile', path: '/dashboard/profile' },
  ];

  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
    ${pathname.startsWith(path) 
      ? 'bg-blue-50 text-blue-700 shadow-sm' 
      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
  `;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20">
        <div className="p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Portfolio Admin
          </h2>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={linkClass(item.path)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button 
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 hover:rounded-lg transition-all"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};