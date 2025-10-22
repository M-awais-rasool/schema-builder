import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Calendar, Table, Plus, Search, Users, ExternalLink } from 'lucide-react';
import { useSchemaOperations } from '../../hooks/useSchemaOperations';
import type { Schema } from '../../hooks/useSchemaOperations';

const Export: React.FC = () => {
  const navigate = useNavigate();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { getOtherUsersSchemas, loading } = useSchemaOperations();

  useEffect(() => {
    loadSchemas();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 
        && !loading
        && !isLoadingMore
        && currentPage < totalPages
        && isLoaded
      ) {
        loadSchemas(currentPage + 1, false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, isLoadingMore, currentPage, totalPages, isLoaded]);

  const loadSchemas = async (page = 1, reset = true) => {
    try {
      setIsLoadingMore(page > 1);
      const result = await getOtherUsersSchemas(page, 12);
      
      if (reset) {
        setSchemas(result.schemas || []);
      } else {
        setSchemas(prev => [...prev, ...(result.schemas || [])]);
      }
      
      setCurrentPage(page);
      setTotalPages(result.pagination?.totalPages || 0);
      setIsLoaded(true);
    } catch (err) {
      console.error('Failed to load schemas:', err);
      setIsLoaded(true);
    } finally {
      setIsLoadingMore(false);
    }
  };



  const filteredSchemas = schemas.filter(schema =>
    schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schema.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSchemaClick = (schemaId: string) => {
    navigate(`/designer?schema=${schemaId}&mode=view`);
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

  const getTableCount = (schema: Schema) => {
    return schema.tables?.length || 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">
                Community Schemas
              </h1>
              <p className="text-gray-600 text-lg">
                Discover and explore schemas created by other users
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">{schemas.length} schemas</span>
              </div>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search community schemas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black bg-white shadow-sm transition-all duration-300"
            />
          </div>
        </div>

        {loading && !isLoaded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-2xl p-6 animate-pulse"
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
            ))}
          </div>
        )}

        {isLoaded && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredSchemas.map((schema, index) => (
              <div
                key={schema.id}
                onClick={() => handleSchemaClick(schema.id)}
                className={`
                  bg-white rounded-2xl shadow-md border-2 border-gray-100 p-6 cursor-pointer
                  hover:shadow-xl hover:border-black hover:scale-105 
                  transition-all duration-300 group relative overflow-hidden
                  animate-fade-in-up
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-1 group-hover:text-gray-800 transition-colors duration-300">
                      {schema.name}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {schema.description || 'No description provided'}
                </p>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {getTableCount(schema)} tables
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      {formatDate(schema.created_at)}
                    </span>
                  </div>
                </div>

                <button className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium">
                  View Schema
                </button>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black/5 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 font-medium">Loading more schemas...</span>
            </div>
          </div>
        )}

        {isLoaded && filteredSchemas.length === 0 && !loading && (
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No schemas found' : 'No community schemas available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all schemas'
                : 'Be the first to create and share a schema with the community'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-300 mb-4"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleNewSchema}
          className="fixed bottom-8 right-8 w-16 h-16 bg-black hover:bg-gray-800 text-white border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 rounded-full flex items-center justify-center z-40 group"
          title="Create New Schema"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Export;