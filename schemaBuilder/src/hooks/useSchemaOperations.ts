import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import type { Node, Edge } from 'reactflow';
import { MarkerType } from 'reactflow';

export interface Schema {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  tables: Table[];
  version: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  fields: Field[];
  indexes?: Index[];
  constraints?: Constraint[];
}

export interface Field {
  id: string;
  name: string;
  type: string;
  is_primary_key: boolean;
  is_not_null: boolean;
  is_unique: boolean;
  default_value?: string;
  is_foreign_key: boolean;
  references?: {
    table_id: string;
    field_id: string;
  };
}

export interface Index {
  name: string;
  fields: string[];
  is_unique: boolean;
}

export interface Constraint {
  name: string;
  type: string;
  field: string;
  reference_table?: string;
  reference_field?: string;
  on_update?: string;
  on_delete?: string;
  check_condition?: string;
}

export interface CreateSchemaRequest {
  name: string;
  description?: string;
  tables: Table[];
  is_public: boolean;
}

export interface UpdateSchemaRequest {
  name?: string;
  description?: string;
  tables?: Table[];
  is_public?: boolean;
}

export const useSchemaOperations = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertNodesToTables = useCallback((nodes: Node[]): Table[] => {
    return nodes.map(node => ({
      id: node.id,
      name: node.data.label,
      position: node.position,
      fields: node.data.fields?.map((field: any) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        is_primary_key: field.isPrimaryKey || false,
        is_not_null: field.isNotNull || false,
        is_unique: field.isUnique || false,
        default_value: field.defaultValue,
        is_foreign_key: field.isForeignKey || false,
        references: field.references ? {
          table_id: field.references.tableId,
          field_id: field.references.fieldId,
        } : undefined,
      })) || [],
      indexes: [],
      constraints: [],
    }));
  }, []);

  const convertTablesToNodes = useCallback((tables: Table[]): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = tables.map(table => ({
      id: table.id,
      type: 'table',
      position: table.position,
      data: {
        label: table.name,
        fields: table.fields.map(field => ({
          id: field.id,
          name: field.name,
          type: field.type,
          isPrimaryKey: field.is_primary_key,
          isNotNull: field.is_not_null,
          isUnique: field.is_unique,
          defaultValue: field.default_value,
          isForeignKey: field.is_foreign_key,
          references: field.references ? {
            tableId: field.references.table_id,
            fieldId: field.references.field_id,
          } : undefined,
        })),
      },
    }));

    const edges: Edge[] = [];
    tables.forEach(table => {
      table.fields.forEach(field => {
        if (field.is_foreign_key && field.references) {
          edges.push({
            id: `${field.references.table_id}-${field.references.field_id}-${table.id}-${field.id}`,
            source: field.references.table_id,
            target: table.id,
            sourceHandle: field.references.field_id,
            targetHandle: field.id,
            type: 'smoothstep',
            animated: true,
            style: { 
              stroke: '#3b82f6', 
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#3b82f6',
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, []);

  const createSchema = useCallback(async (
    name: string, 
    description: string, 
    nodes: Node[], 
    isPublic: boolean = false
  ): Promise<Schema> => {
    setLoading(true);
    setError(null);
    
    try {
      const tables = convertNodesToTables(nodes);
      const request: CreateSchemaRequest = {
        name,
        description,
        tables,
        is_public: isPublic,
      };

      const response = await api.post('/schemas', request);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create schema');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create schema';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, convertNodesToTables]);

  const updateSchema = useCallback(async (
    id: string,
    updates: {
      name?: string;
      description?: string;
      nodes?: Node[];
      isPublic?: boolean;
    }
  ): Promise<Schema> => {
    setLoading(true);
    setError(null);
    
    try {
      const request: UpdateSchemaRequest = {};
      
      if (updates.name !== undefined) request.name = updates.name;
      if (updates.description !== undefined) request.description = updates.description;
      if (updates.isPublic !== undefined) request.is_public = updates.isPublic;
      if (updates.nodes) {
        request.tables = convertNodesToTables(updates.nodes);
      }

      const response = await api.put(`/schemas/${id}`, request);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update schema');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update schema';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, convertNodesToTables]);

  const getSchema = useCallback(async (id: string): Promise<Schema> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/schemas/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get schema');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get schema';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getUserSchemas = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/schemas', { 
        page: page.toString(), 
        limit: limit.toString() 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get schemas');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get schemas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getPublicSchemas = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/schemas/public', { 
        page: page.toString(), 
        limit: limit.toString() 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get public schemas');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get public schemas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const deleteSchema = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/schemas/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete schema');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete schema';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const duplicateSchema = useCallback(async (id: string, newName: string): Promise<Schema> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/schemas/${id}/duplicate`, { name: newName });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to duplicate schema');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate schema';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const toggleSchemaVisibility = useCallback(async (id: string): Promise<Schema> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.makeRequest(`/schemas/${id}/visibility`, { method: 'PATCH' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle schema visibility');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle schema visibility';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api]);

  return {
    loading,
    error,
    createSchema,
    updateSchema,
    getSchema,
    getUserSchemas,
    getPublicSchemas,
    deleteSchema,
    duplicateSchema,
    toggleSchemaVisibility,
    convertTablesToNodes,
    convertNodesToTables,
  };
};