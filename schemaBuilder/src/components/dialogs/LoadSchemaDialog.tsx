import React, { useState, useEffect } from 'react';
import { X, FolderOpen, Clock, Lock, Unlock, Eye, Trash2 } from 'lucide-react';
import { useSchemaOperations, type Schema } from '../../hooks/useSchemaOperations';

interface LoadSchemaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (schema: Schema) => void;
  onDelete?: (schemaId: string) => void;
}

export const LoadSchemaDialog: React.FC<LoadSchemaDialogProps> = ({
  isOpen,
  onClose,
  onLoad,
  onDelete,
}) => {
  const { getUserSchemas, getPublicSchemas, loading, error } = useSchemaOperations();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [activeTab, setActiveTab] = useState<'mine' | 'public'>('mine');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const loadSchemas = async () => {
    try {
      let data;
      if (activeTab === 'mine') {
        data = await getUserSchemas(pagination.page, pagination.limit);
      } else {
        data = await getPublicSchemas(pagination.page, pagination.limit);
      }
      
      setSchemas(data.schemas || []);
      setPagination(data.pagination || pagination);
    } catch (err) {
      console.error('Failed to load schemas:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSchemas();
    }
  }, [isOpen, activeTab, pagination.page]);

  const handleSchemaClick = (schema: Schema) => {
    onLoad(schema);
    onClose();
  };

  const handleDelete = async (schemaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this schema?')) {
      onDelete(schemaId);
      loadSchemas(); // Reload schemas after deletion
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Load Schema</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === 'mine'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Schemas
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === 'public'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Public Schemas
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : schemas.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {activeTab === 'mine' ? 'No schemas found. Create your first schema!' : 'No public schemas available.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {schemas.map((schema) => (
                <div
                  key={schema.id}
                  onClick={() => handleSchemaClick(schema)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                      {schema.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {schema.is_public ? (
                        <div title="Public schema">
                          <Unlock className="w-4 h-4 text-blue-500" />
                        </div>
                      ) : (
                        <div title="Private schema">
                          <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      {activeTab === 'mine' && onDelete && (
                        <button
                          onClick={(e) => handleDelete(schema.id, e)}
                          className="p-1 hover:bg-red-100 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all duration-200"
                          title="Delete schema"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {schema.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {schema.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(schema.updated_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>v{schema.version}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {schemas.length > 0 && (
          <div className="border-t border-gray-200 p-4">
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
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};