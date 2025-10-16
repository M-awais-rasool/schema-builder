import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Node, type Edge, MarkerType } from 'reactflow';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'table',
    position: { x: 100, y: 100 },
    data: {
      label: 'users',
      fields: [
        {
          id: 'f1',
          name: 'id',
          type: 'INTEGER',
          isPrimaryKey: true,
          isNotNull: true,
          isUnique: true,
          isForeignKey: false
        },
        {
          id: 'f2',
          name: 'email',
          type: 'VARCHAR(255)',
          isPrimaryKey: false,
          isNotNull: true,
          isUnique: true,
          isForeignKey: false
        },
        {
          id: 'f3',
          name: 'name',
          type: 'VARCHAR(100)',
          isPrimaryKey: false,
          isNotNull: true,
          isUnique: false,
          isForeignKey: false
        },
        {
          id: 'f4',
          name: 'created_at',
          type: 'TIMESTAMP',
          isPrimaryKey: false,
          isNotNull: true,
          isUnique: false,
          isForeignKey: false
        },
      ],
    },
  },
  {
    id: '2',
    type: 'table',
    position: { x: 400, y: 200 },
    data: {
      label: 'posts',
      fields: [
        {
          id: 'f5',
          name: 'id',
          type: 'INTEGER',
          isPrimaryKey: true,
          isNotNull: true,
          isUnique: true,
          isForeignKey: false
        },
        {
          id: 'f6',
          name: 'user_id',
          type: 'INTEGER',
          isPrimaryKey: false,
          isNotNull: true,
          isUnique: false,
          isForeignKey: true,
          references: { tableId: '1', fieldId: 'f1' }
        },
        {
          id: 'f7',
          name: 'title',
          type: 'VARCHAR(255)',
          isPrimaryKey: false,
          isNotNull: true,
          isUnique: false,
          isForeignKey: false
        },
        {
          id: 'f8',
          name: 'content',
          type: 'TEXT',
          isPrimaryKey: false,
          isNotNull: false,
          isUnique: false,
          isForeignKey: false
        },
        {
          id: 'f9',
          name: 'published_at',
          type: 'TIMESTAMP',
          isPrimaryKey: false,
          isNotNull: false,
          isUnique: false,
          isForeignKey: false
        },
      ],
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'f1',
    targetHandle: 'f6',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#3b82f6',
    },
    label: 'FK: user_id → id',
    labelStyle: {
      fontSize: 10,
      fontWeight: 600,
      fill: '#3b82f6',
    },
    labelBgStyle: {
      fill: 'white',
      fillOpacity: 0.9,
    },
  },
];