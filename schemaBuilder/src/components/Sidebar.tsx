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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-500 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-screen z-50
        transform transition-all duration-700 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-80'}
        bg-gradient-to-br from-gray-950 via-black to-gray-900
        border-r border-gray-800/50
        shadow-2xl shadow-black/50
        backdrop-blur-xl
        md:relative md:transform-none
        flex flex-col
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-800/10 before:via-transparent before:to-gray-900/20 before:pointer-events-none
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800/30 flex-shrink-0 relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
          
          {!isCollapsed && (
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg shadow-black/50 group-hover:shadow-gray-600/30 transition-all duration-500">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-gray-600/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </div>
              <div className="overflow-hidden">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent tracking-tight">
                  SchemaBuilder
                </h1>
                <div className="h-0.5 w-0 bg-gradient-to-r from-gray-400 to-gray-600 group-hover:w-full transition-all duration-500 mt-1"></div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30 border border-gray-700/50 backdrop-blur-sm"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-800/50 hover:bg-red-600/50 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-black/30 border border-gray-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ul className="space-y-3">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path} 
                    className="animate-slideIn" 
                    style={{ animationDelay: `${index * 100}ms` }}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      group relative w-full flex items-center px-5 py-4 rounded-2xl text-left
                      transition-all duration-500 ease-out transform
                      border border-transparent
                      ${active 
                        ? 'bg-gradient-to-r from-gray-800/80 to-gray-700/60 text-white shadow-2xl shadow-gray-900/50 scale-105 border-gray-600/30' 
                        : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/40 hover:to-gray-700/30 hover:scale-105 hover:border-gray-600/20'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-start'}
                      backdrop-blur-sm
                    `}
                  >
                    {active && (
                      <>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-gray-400 to-gray-600 rounded-r-full shadow-lg shadow-gray-400/50" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-600/10 to-transparent animate-pulse" />
                      </>
                    )}
                    
                    <div className="relative flex items-center">
                      <div className={`
                        relative p-2 rounded-xl transition-all duration-500
                        ${active 
                          ? 'bg-gray-700/50 shadow-inner shadow-gray-900/50' 
                          : 'group-hover:bg-gray-700/30'
                        }
                      `}>
                        <Icon className={`
                          w-5 h-5 transition-all duration-500
                          ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}
                          group-hover:scale-110 group-hover:rotate-3
                        `} />
                        {active && (
                          <div className="absolute inset-0 rounded-xl bg-gray-400/20 animate-ping" />
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <span className={`
                          ml-4 font-semibold transition-all duration-500 tracking-wide
                          ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                          group-hover:translate-x-2
                        `}>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {isCollapsed && (
                      <div className="absolute left-full ml-6 px-4 py-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl shadow-black/50 border border-gray-700/50">
                        {item.label}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 border-8 border-transparent border-r-gray-900" />
                      </div>
                    )}

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-600/5 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                    
                    {!active && (
                      <div className="absolute inset-0 rounded-2xl border border-gray-600/0 group-hover:border-gray-600/20 transition-all duration-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-800/30 flex-shrink-0 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
          
          <button
            onClick={handleLogout}
            className={`
              group relative w-full flex items-center px-5 py-4 rounded-2xl text-gray-300 hover:text-white 
              hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20 
              transition-all duration-500 hover:scale-105 border border-transparent 
              hover:border-red-700/30 hover:shadow-lg hover:shadow-red-900/30
              ${isCollapsed ? 'justify-center' : 'justify-start'}
              backdrop-blur-sm
            `}
          >
            <div className="relative flex items-center">
              <div className="relative p-2 rounded-xl group-hover:bg-red-800/30 transition-all duration-500">
                <LogOut className={`
                  w-5 h-5 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12
                  ${!isCollapsed ? 'mr-0' : ''}
                `} />
              </div>
              
              {!isCollapsed && (
                <span className="ml-4 font-semibold transition-all duration-500 group-hover:translate-x-2">
                  Logout
                </span>
              )}
            </div>
            
            {isCollapsed && (
              <div className="absolute left-full ml-6 px-4 py-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl shadow-black/50 border border-gray-700/50">
                Logout
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 border-8 border-transparent border-r-gray-900" />
              </div>
            )}

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600/5 to-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
          </button>

          {!isCollapsed && (
            <div className="mt-6 text-center space-y-2 animate-fadeIn">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>
              <div className="space-y-1 opacity-60">
                <p className="text-xs text-gray-400 font-medium tracking-wide">Version 1.0.0</p>
                <p className="text-xs text-gray-500">© 2025 SchemaBuilder</p>
              </div>
              <div className="flex justify-center space-x-1 mt-3">
                <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className={`
          md:hidden fixed top-4 left-4 z-30 p-4 rounded-2xl
          bg-gradient-to-br from-gray-900 via-black to-gray-800
          border border-gray-700/50 backdrop-blur-xl
          text-gray-300 hover:text-white 
          shadow-2xl shadow-black/50 
          transition-all duration-500 ease-out
          hover:shadow-xl hover:shadow-gray-900/60 hover:scale-110
          hover:border-gray-600/60
          ${isOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}
          before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-gray-600/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        `}
      >
        <Menu className="w-5 h-5 transition-transform duration-300 hover:rotate-180" />
      </button>
    </>
  );
};

export default Sidebar;