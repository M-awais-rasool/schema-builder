import React from 'react';
import { Copy, X } from 'lucide-react';

interface SQLPreviewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sqlContent: string;
  onCopySQL: () => void;
}

export const SQLPreviewPanel: React.FC<SQLPreviewPanelProps> = ({
  isOpen,
  onClose,
  sqlContent,
  onCopySQL,
}) => {
  return (
    <div className={`
      bg-white border-t border-gray-200 transition-all duration-500 ease-in-out z-10
      ${isOpen ? 'h-64' : 'h-0'}
      overflow-hidden
    `}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">SQL Preview</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onCopySQL}
              className="px-3 py-1 bg-black hover:bg-gray-800 text-white border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 rounded text-sm flex items-center space-x-1"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
          <pre>{sqlContent}</pre>
        </div>
      </div>
    </div>
  );
};