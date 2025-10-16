import React from 'react';
import { X } from 'lucide-react';
import type { Node } from 'reactflow';
import type { TableField } from '../../types/designer';

interface FieldEditorProps {
  field: TableField;
  index: number;
  tableId: string;
  nodes: Node[];
  onUpdateField: (tableId: string, fieldId: string, updates: Partial<TableField>) => void;
  onRemoveField: (tableId: string, fieldId: string) => void;
  onUpdateEdges: (updater: (edges: any[]) => any[]) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  index,
  tableId,
  nodes,
  onUpdateField,
  onRemoveField,
  onUpdateEdges,
}) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-black">Field {index + 1}</span>
          {field.isPrimaryKey && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">PK</span>
          )}
          {field.isForeignKey && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">FK</span>
          )}
        </div>
        <button 
          onClick={() => onRemoveField(tableId, field.id)}
          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <input
        type="text"
        value={field.name}
        onChange={(e) => onUpdateField(tableId, field.id, { name: e.target.value })}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black bg-white"
        placeholder="Field name"
      />
      
      <select 
        value={field.type}
        onChange={(e) => onUpdateField(tableId, field.id, { type: e.target.value })}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black bg-white"
      >
        <option value="INTEGER">INTEGER</option>
        <option value="BIGINT">BIGINT</option>
        <option value="VARCHAR(50)">VARCHAR(50)</option>
        <option value="VARCHAR(100)">VARCHAR(100)</option>
        <option value="VARCHAR(255)">VARCHAR(255)</option>
        <option value="TEXT">TEXT</option>
        <option value="LONGTEXT">LONGTEXT</option>
        <option value="TIMESTAMP">TIMESTAMP</option>
        <option value="DATETIME">DATETIME</option>
        <option value="DATE">DATE</option>
        <option value="TIME">TIME</option>
        <option value="BOOLEAN">BOOLEAN</option>
        <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
        <option value="FLOAT">FLOAT</option>
        <option value="DOUBLE">DOUBLE</option>
        <option value="JSON">JSON</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={field.isPrimaryKey}
            onChange={(e) => {
              if (e.target.checked) {
                if (field.isForeignKey) {
                  alert('Cannot set a Foreign Key field as Primary Key. Please remove the foreign key relationship first.');
                  return;
                }
                
                const selectedNode = nodes.find(n => n.id === tableId);
                const existingPK = selectedNode?.data.fields?.find((f: TableField) => f.isPrimaryKey && f.id !== field.id);
                if (existingPK) {
                  const confirmChange = window.confirm(
                    `Field "${existingPK.name}" is already the primary key. Setting "${field.name}" as primary key will remove it from "${existingPK.name}". Continue?`
                  );
                  if (!confirmChange) return;
                }
              }
              
              const updates: Partial<TableField> = { 
                isPrimaryKey: e.target.checked,
                isNotNull: e.target.checked || field.isNotNull, 
                isUnique: e.target.checked || field.isUnique   
              };
              onUpdateField(tableId, field.id, updates);
            }}
            className="rounded text-indigo-600" 
          />
          <span className="text-sm text-black">Primary Key</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={field.isNotNull}
            onChange={(e) => {
              if (!e.target.checked && field.isPrimaryKey) {
                alert('Primary key fields must be NOT NULL');
                return;
              }
              onUpdateField(tableId, field.id, { isNotNull: e.target.checked });
            }}
            className="rounded text-indigo-600" 
          />
          <span className="text-sm text-black">Not Null</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={field.isUnique}
            onChange={(e) => {
              if (!e.target.checked && field.isPrimaryKey) {
                alert('Primary key fields must be UNIQUE');
                return;
              }
              onUpdateField(tableId, field.id, { isUnique: e.target.checked });
            }}
            className="rounded text-indigo-600" 
          />
          <span className="text-sm text-black">Unique</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={field.isForeignKey}
            onChange={(e) => {
              if (e.target.checked) {
                alert('Foreign keys are created automatically by dragging relationships from Primary Key fields. Uncheck this to remove the foreign key relationship.');
                return;
              } else {
                onUpdateField(tableId, field.id, { 
                  isForeignKey: false, 
                  references: undefined 
                });
                onUpdateEdges((eds) => eds.filter(edge => 
                  !(edge.targetHandle === field.id || edge.sourceHandle === field.id)
                ));
              }
            }}
            className="rounded text-indigo-600" 
          />
          <span className="text-sm text-black">Foreign Key</span>
        </label>
      </div>

      {field.isForeignKey && field.references && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
          <span className="text-blue-800">
            References: {nodes.find(n => n.id === field.references?.tableId)?.data.label || 'Unknown'}.
            {nodes.find(n => n.id === field.references?.tableId)?.data.fields?.find((f: TableField) => f.id === field.references?.fieldId)?.name || 'Unknown'}
          </span>
        </div>
      )}

      <input
        type="text"
        value={field.defaultValue || ''}
        onChange={(e) => onUpdateField(tableId, field.id, { defaultValue: e.target.value })}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black bg-white"
        placeholder="Default value (optional)"
      />
    </div>
  );
};