import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Database,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-screen z-50
        transform transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-72'}
        bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700
        shadow-2xl shadow-indigo-500/25
        md:relative md:transform-none
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-ping" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                SchemaBuilder
              </h1>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
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
                      group relative w-full flex items-center px-4 py-3 rounded-xl text-left
                      transition-all duration-300 ease-in-out
                      ${active 
                        ? 'bg-white/20 text-white shadow-lg shadow-white/10 scale-105' 
                        : 'text-purple-100 hover:text-white hover:bg-white/10 hover:scale-105'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-start'}
                    `}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-pulse" />
                    )}
                    
                    <Icon className={`
                      w-5 h-5 transition-all duration-300
                      ${active ? 'text-white' : 'text-purple-200 group-hover:text-white'}
                      ${!isCollapsed ? 'mr-3' : ''}
                      group-hover:scale-110
                    `} />
                    
                    {!isCollapsed && (
                      <span className="font-medium transition-all duration-300 group-hover:translate-x-1">
                        {item.label}
                      </span>
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900" />
                      </div>
                    )}

                    <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`
              group w-full flex items-center px-4 py-3 rounded-xl text-purple-100 hover:text-white hover:bg-red-500/20 transition-all duration-300 hover:scale-105
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
          >
            <LogOut className={`
              w-5 h-5 transition-all duration-300 group-hover:scale-110
              ${!isCollapsed ? 'mr-3' : ''}
            `} />
            {!isCollapsed && (
              <span className="font-medium">Logout</span>
            )}
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                Logout
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </button>

          {!isCollapsed && (
            <div className="mt-4 text-center">
              <p className="text-xs text-purple-200/60">Version 1.0.0</p>
              <p className="text-xs text-purple-200/40 mt-1">© 2025 SchemaBuilder</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className={`
          md:hidden fixed top-4 left-4 z-30 p-3 rounded-xl
          bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
          text-white shadow-lg shadow-indigo-500/50 transition-all duration-300
          hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};

export default Sidebar;