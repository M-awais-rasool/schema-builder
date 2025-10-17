import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Search, Clock, Lock, Unlock, Edit, Trash2, Eye } from 'lucide-react';
import { useSchemaOperations, type Schema } from '../../hooks/useSchemaOperations';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { getUserSchemas, deleteSchema, loading, error } = useSchemaOperations();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'public' | 'private'>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const loadSchemas = async () => {
    try {
      const data = await getUserSchemas(pagination.page, pagination.limit);
      setSchemas(data.schemas || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      console.error('Failed to load schemas:', err);
    }
  };

  useEffect(() => {
    loadSchemas();
  }, [pagination.page]);

  const handleDeleteSchema = async (schemaId: string, schemaName: string) => {
    if (window.confirm(`Are you sure you want to delete "${schemaName}"? This action cannot be undone.`)) {
      try {
        await deleteSchema(schemaId);
        loadSchemas();
      } catch (err) {
        console.error('Failed to delete schema:', err);
        alert('Failed to delete schema');
      }
    }
  };

  const handleEditSchema = (schemaId: string) => {
    navigate(`/designer?schema=${schemaId}`);
  };

  const handleViewSchema = (schemaId: string) => {
    navigate(`/export/${schemaId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredSchemas = schemas.filter(schema => {
    const matchesSearch = schema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schema.description && schema.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = statusFilter === 'all' ||
      (statusFilter === 'public' && schema.is_public) ||
      (statusFilter === 'private' && !schema.is_public);

    return matchesSearch && matchesFilter;
  });

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Schemas</h1>
            <p className="text-gray-600">Manage and organize your database schemas.</p>
          </div>
          <button
            onClick={() => navigate('/designer')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Schema
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search schemas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'public' | 'private')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Schemas</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : filteredSchemas.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No schemas found</h3>
          <p className="text-gray-600 mb-6">
            {schemas.length === 0
              ? "You haven't created any schemas yet. Start building your first database schema!"
              : "No schemas match your current search and filter criteria."
            }
          </p>
          {schemas.length === 0 && (
            <button
              onClick={() => navigate('/designer')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Create Your First Schema
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredSchemas.map((schema) => (
              <div
                key={schema.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <FolderOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{schema.name}</h3>
                      <p className="text-sm text-gray-600">{schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {schema.is_public ? (
                      <div title="Public schema">
                        <Unlock className="w-4 h-4 text-blue-500" />
                      </div>
                    ) : (
                      <div title="Private schema">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {schema.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{schema.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(schema.updated_at)}</span>
                  </div>
                  <span>v{schema.version}</span>
                </div>

                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleEditSchema(schema.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleViewSchema(schema.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSchema(schema.id, schema.name)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} schemas
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={prevPage}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;