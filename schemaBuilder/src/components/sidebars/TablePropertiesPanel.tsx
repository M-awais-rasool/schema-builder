import React from 'react';
import { Settings, X, Plus, Copy } from 'lucide-react';
import type { Node } from 'reactflow';
import type { TableField } from '../../types/designer';
import { FieldEditor } from './FieldEditor';

interface TablePropertiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Node | null;
  nodes: Node[];
  onUpdateTableName: (tableId: string, newName: string) => void;
  onAddField: (tableId: string) => void;
  onUpdateField: (tableId: string, fieldId: string, updates: Partial<TableField>) => void;
  onRemoveField: (tableId: string, fieldId: string) => void;
  onDeleteTable: (tableId: string) => void;
  onDuplicateTable: (tableId: string) => void;
  onUpdateEdges: (updater: (edges: any[]) => any[]) => void;
}

export const TablePropertiesPanel: React.FC<TablePropertiesPanelProps> = ({
  isOpen,
  onClose,
  selectedNode,
  nodes,
  onUpdateTableName,
  onAddField,
  onUpdateField,
  onRemoveField,
  onDeleteTable,
  onDuplicateTable,
  onUpdateEdges,
}) => {
  return (
    <div className={`
      bg-white border-l border-gray-200 flex flex-col z-20 shadow-lg
      transform transition-all duration-500 ease-in-out
      ${isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'}
    `}>
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-black rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-semibold text-black">Table Properties</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedNode && (
        <div className="flex-1 p-4 space-y-6 overflow-y-auto bg-white">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-black">Table Name</label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => onUpdateTableName(selectedNode.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-black bg-white"
              placeholder="Enter table name"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-black">Fields</label>
              <button
                onClick={() => onAddField(selectedNode.id)}
                className="px-3 py-1 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-300 flex items-center space-x-1 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Field</span>
              </button>
            </div>

            <div className="space-y-3">
              {selectedNode.data.fields?.map((field: TableField, index: number) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  index={index}
                  tableId={selectedNode.id}
                  nodes={nodes}
                  onUpdateField={onUpdateField}
                  onRemoveField={onRemoveField}
                  onUpdateEdges={onUpdateEdges}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-black">Actions</label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this table? This action cannot be undone.')) {
                    onDeleteTable(selectedNode.id);
                  }
                }}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Delete Table</span>
              </button>
              <button
                onClick={() => onDuplicateTable(selectedNode.id)}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate Table</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};