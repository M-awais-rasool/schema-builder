import {
  LayoutDashboard,
  FolderOpen,
  Database,
  User,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/export', icon: Database, label: 'Schemas' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
  };

  return (
    <>
      <div className={`
        fixed top-0 left-0 h-screen z-50
        transition-all duration-300 ease-in-out
        -translate-x-full md:translate-x-0
        w-72
        bg-black
        border-r border-gray-800
        md:sticky md:top-0
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              SchemaBuilder
            </h1>
          </div>

        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      group relative w-full flex items-center px-4 py-3 rounded-lg text-left
                      transition-all duration-200
                      ${active
                        ? 'bg-gray-900 text-white border border-gray-800'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                      }
                       justify-start
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}

                    <Icon className={'w-5 h-5}'} />

                    <span className="font-medium ml-3">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`
              group relative w-full flex items-center px-4 py-3 rounded-lg text-gray-400 
              hover:text-white hover:bg-gray-900/50
              transition-all duration-200
              justify-start
            `}
          >
            <LogOut className={`w-5 h-5 mr-3}`} />

            <span className="font-medium">
              Logout
            </span>

            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-700">
              Logout
            </div>
          </button>

          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">Version 1.0.0</p>
            <p className="text-xs text-gray-600 mt-1">© 2025 SchemaBuilder</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;