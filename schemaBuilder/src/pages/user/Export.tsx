import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Calendar, Table, Plus, Search } from 'lucide-react';

interface Schema {
  id: string;
  name: string;
  dateCreated: string;
  tableCount: number;
  description?: string;
}

const Export: React.FC = () => {
  const navigate = useNavigate();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock data - replace with actual API call
  const mockSchemas: Schema[] = [
    {
      id: '1',
      name: 'E-commerce Database',
      dateCreated: '2024-10-08',
      tableCount: 12,
      description: 'Complete e-commerce platform schema with users, products, orders'
    },
    {
      id: '2',
      name: 'User Management System',
      dateCreated: '2024-10-05',
      tableCount: 8,
      description: 'Authentication and user profile management'
    },
    {
      id: '3',
      name: 'Analytics Platform',
      dateCreated: '2024-10-01',
      tableCount: 15,
      description: 'Data warehouse schema for analytics and reporting'
    },
    {
      id: '4',
      name: 'Content Management',
      dateCreated: '2024-09-28',
      tableCount: 6,
      description: 'CMS schema for blogs and articles'
    },
    {
      id: '5',
      name: 'Inventory System',
      dateCreated: '2024-09-25',
      tableCount: 10,
      description: 'Warehouse and inventory tracking system'
    },
    {
      id: '6',
      name: 'Social Media App',
      dateCreated: '2024-09-20',
      tableCount: 14,
      description: 'Social networking platform database design'
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setSchemas(mockSchemas);
      setIsLoaded(true);
    }, 500);
  }, []);

  const filteredSchemas = schemas.filter(schema =>
    schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schema.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSchemaClick = (schemaId: string) => {
    navigate(`/export/${schemaId}`);
  };

  const handleNewSchema = () => {
    navigate('/designer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                Your Database Schemas 📂
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and explore your database schema designs
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search schemas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all duration-300"
            />
          </div>
        </div>

        {/* Schema Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {isLoaded ? (
            filteredSchemas.map((schema, index) => (
              <div
                key={schema.id}
                onClick={() => handleSchemaClick(schema.id)}
                className={`
                  bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer
                  hover:shadow-xl hover:shadow-indigo-500/10 hover:scale-105 
                  transition-all duration-300 hover:border-indigo-200
                  animate-fade-in-up group relative
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Schema Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-all duration-300">
                    <Database className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Table className="w-4 h-4 mr-1" />
                    {schema.tableCount}
                  </div>
                </div>

                {/* Schema Info */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-indigo-700 transition-colors duration-300">
                    {schema.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {schema.description}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(schema.dateCreated)}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))
          ) : (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="w-8 h-4 bg-gray-200 rounded" />
                </div>
                <div className="mb-4">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {isLoaded && filteredSchemas.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemas found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or create a new schema.
            </p>
            <button
              onClick={handleNewSchema}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 rounded-xl font-medium"
            >
              Create New Schema
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={handleNewSchema}
          className={`
            fixed bottom-8 right-8 w-16 h-16 
            bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
            text-white border-0 shadow-lg shadow-indigo-500/50 transition-all duration-300 
            hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105
            rounded-full flex items-center justify-center z-40
            group
          `}
          title="Create New Schema"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>


    </div>
  );
};

export default Export;