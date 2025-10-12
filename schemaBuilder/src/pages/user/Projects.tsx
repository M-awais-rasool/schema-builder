import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Search, Filter } from 'lucide-react';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  
  const projects = [
    { name: 'E-commerce Platform', schemas: 12, lastModified: '2 hours ago', status: 'Active' },
    { name: 'User Management System', schemas: 8, lastModified: '1 day ago', status: 'Active' },
    { name: 'Analytics Dashboard', schemas: 15, lastModified: '3 days ago', status: 'Archived' },
    { name: 'Blog Platform', schemas: 6, lastModified: '1 week ago', status: 'Active' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">Manage and organize your schema projects.</p>
          </div>
          <button 
            onClick={() => navigate('/designer')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <FolderOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.schemas} schemas</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                project.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">Last modified: {project.lastModified}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;