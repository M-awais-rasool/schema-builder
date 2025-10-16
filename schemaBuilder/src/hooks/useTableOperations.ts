import { useCallback } from 'react';
import type { Node, Edge } from 'reactflow';
import type { TableField } from '../types/designer';

interface UseTableOperationsProps {
  nodes: Node[];
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

export const useTableOperations = ({ 
  nodes, 
  setNodes, 
  setEdges, 
  selectedNode, 
  setSelectedNode 
}: UseTableOperationsProps) => {
  
  const addNewTable = useCallback(() => {
    const newTableId = `table-${Date.now()}`;
    const newNode: Node = {
      id: newTableId,
      type: 'table',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'new_table',
        fields: [
          { 
            id: `f-${Date.now()}`, 
            name: 'id', 
            type: 'INTEGER', 
            isPrimaryKey: true, 
            isNotNull: true, 
            isUnique: true, 
            isForeignKey: false 
          },
        ],
      },
    };
    setNodes((nds: Node[]) => [...nds, newNode]);
  }, [setNodes]);

  const updateTableName = useCallback((tableId: string, newName: string) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id !== tableId) return node;
        
        const updatedNode = { ...node, data: { ...node.data, label: newName } };
        
        if (selectedNode?.id === tableId) {
          setSelectedNode(updatedNode);
        }
        
        return updatedNode;
      })
    );
  }, [setNodes, selectedNode, setSelectedNode]);

  const addField = useCallback((tableId: string) => {
    const newField: TableField = {
      id: `f-${Date.now()}`,
      name: 'new_field',
      type: 'VARCHAR(255)',
      isPrimaryKey: false,
      isNotNull: false,
      isUnique: false,
      isForeignKey: false,
    };

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== tableId) return node;
        
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            fields: [...(node.data.fields || []), newField],
          },
        };

        if (selectedNode?.id === tableId) {
          setSelectedNode(updatedNode);
        }

        return updatedNode;
      })
    );
  }, [setNodes, selectedNode, setSelectedNode]);

  const updateField = useCallback((tableId: string, fieldId: string, updates: Partial<TableField>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== tableId) return node;
        
        const updatedFields = node.data.fields?.map((field: TableField) => {
          if (field.id === fieldId) {
            return { ...field, ...updates };
          } else if (updates.isPrimaryKey === true) {
            return { ...field, isPrimaryKey: false };
          }
          return field;
        }) || [];

        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            fields: updatedFields,
          },
        };

        if (selectedNode?.id === tableId) {
          setSelectedNode(updatedNode);
        }

        return updatedNode;
      })
    );
  }, [setNodes, selectedNode, setSelectedNode]);

  const removeField = useCallback((tableId: string, fieldId: string) => {
    const isReferencedByFK = nodes.some(node => 
      node.data.fields?.some((field: TableField) => 
        field.isForeignKey && field.references?.fieldId === fieldId
      )
    );

    if (isReferencedByFK) {
      alert('Cannot delete this field because it is referenced by foreign keys in other tables. Please remove the foreign key relationships first.');
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== tableId) return node;
        
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            fields: node.data.fields?.filter((field: TableField) => field.id !== fieldId),
          },
        };

        if (selectedNode?.id === tableId) {
          setSelectedNode(updatedNode);
        }

        return updatedNode;
      })
    );

    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !(edge.sourceHandle === fieldId || edge.targetHandle === fieldId)
      )
    );
  }, [setNodes, setEdges, selectedNode, nodes, setSelectedNode]);

  const deleteTable = useCallback((tableId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== tableId));
    setEdges((eds) => eds.filter((edge) => edge.source !== tableId && edge.target !== tableId));
    if (selectedNode?.id === tableId) {
      setSelectedNode(null);
    }
  }, [setNodes, setEdges, selectedNode, setSelectedNode]);

  const duplicateTable = useCallback((tableId: string) => {
    const originalNode = nodes.find((node) => node.id === tableId);
    if (originalNode) {
      const newTableId = `table-${Date.now()}`;
      const newNode: Node = {
        ...originalNode,
        id: newTableId,
        position: {
          x: originalNode.position.x + 50,
          y: originalNode.position.y + 50,
        },
        data: {
          ...originalNode.data,
          label: `${originalNode.data.label}_copy`,
          fields: originalNode.data.fields?.map((field: TableField) => ({
            ...field,
            id: `f-${Date.now()}-${Math.random()}`,
            isForeignKey: false, 
            references: undefined,
          })),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    }
  }, [nodes, setNodes]);

  return {
    addNewTable,
    updateTableName,
    addField,
    updateField,
    removeField,
    deleteTable,
    duplicateTable,
  };
};