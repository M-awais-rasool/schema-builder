import { useCallback } from 'react';
import { addEdge, MarkerType } from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import type { TableField } from '../types/designer';

interface UseRelationshipOperationsProps {
  nodes: Node[];
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  updateField: (tableId: string, fieldId: string, updates: Partial<TableField>) => void;
}

export const useRelationshipOperations = ({ 
  nodes, 
  setEdges, 
  updateField 
}: UseRelationshipOperationsProps) => {
  
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target || !params.sourceHandle || !params.targetHandle) {
        return;
      }

      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;

      const sourceField = sourceNode.data.fields?.find((f: TableField) => f.id === params.sourceHandle);
      const targetField = targetNode.data.fields?.find((f: TableField) => f.id === params.targetHandle);

      if (!sourceField || !targetField) return;

      if (!sourceField.isPrimaryKey) {
        alert('Relationships must start from a Primary Key field.');
        return;
      }

      if (targetField.isPrimaryKey) {
        alert('Cannot create a relationship to a Primary Key field. Primary keys cannot be foreign keys.');
        return;
      }

      if (params.source === params.target && params.sourceHandle === params.targetHandle) {
        alert('Cannot create a relationship to the same field.');
        return;
      }

      if (params.source === params.target) {
        alert('Cannot create relationships within the same table.');
        return;
      }

      if (targetField.isForeignKey) {
        if (!window.confirm('This field is already a foreign key. Do you want to replace the existing relationship?')) {
          return;
        }
      }

      updateField(params.target, params.targetHandle, {
        isForeignKey: true,
        references: {
          tableId: params.source,
          fieldId: params.sourceHandle,
        },
      });

      const newEdge: Edge = {
        id: `${params.source}-${params.sourceHandle}-${params.target}-${params.targetHandle}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
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
        label: `FK: ${targetField.name} → ${sourceField.name}`,
        labelStyle: { 
          fontSize: 10, 
          fontWeight: 600,
          fill: '#3b82f6',
        },
        labelBgStyle: { 
          fill: 'white', 
          fillOpacity: 0.9,
        },
      };

      setEdges((eds: Edge[]) => {
        const filteredEdges = eds.filter(
          edge => edge.targetHandle !== params.targetHandle
        );
        return addEdge(newEdge, filteredEdges);
      });
    },
    [nodes, updateField, setEdges]
  );

  return {
    onConnect,
  };
};