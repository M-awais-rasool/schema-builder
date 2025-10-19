import React, { useState } from 'react';
import {
  Save,
  Undo,
  Redo,
  Plus,
  Code,
  Home,
} from 'lucide-react';

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary';
  showLabel?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  disabled = false,
  icon,
  label,
  variant = 'secondary',
  showLabel = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseClasses =
    'relative p-2 transition-all duration-300 rounded-lg flex items-center space-x-2';
  const variantClasses = {
    primary:
      'bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  };
  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${
          disabled ? disabledClasses : ''
        }`}
      >
        {icon}
        {label && showLabel && <span className="hidden sm:inline">{label}</span>}
      </button>

      {label && showTooltip && (
        <div className="absolute top-full mt-2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg opacity-90 animate-fadeIn z-50">
          {label}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};



interface DesignerToolbarProps {
  onNavigateHome: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddTable: () => void;
  onToggleSQL: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showToolbar: boolean;
  schemaName?: string;
  isEditing?: boolean;
}

export const DesignerToolbar: React.FC<DesignerToolbarProps> = ({
  onNavigateHome,
  onSave,
  onUndo,
  onRedo,
  onAddTable,
  onToggleSQL,
  canUndo,
  canRedo,
  showToolbar,
  schemaName,
  isEditing = false,
}) => {
  return (
    <div className={`
      bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between
      transform transition-all duration-500 ease-in-out z-30
      ${showToolbar ? 'translate-y-0' : '-translate-y-full'}
    `}>
      <div className="flex items-center space-x-4">
        <ToolbarButton
          onClick={onNavigateHome}
          icon={<Home className="w-4 h-4" />}
          label="Dashboard"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing && schemaName ? (
            <span>
              Editing: <span className="text-indigo-600">{schemaName}</span>
            </span>
          ) : (
            'Database Designer'
          )}
        </h1>
        
        <div className="flex items-center space-x-2">
          <ToolbarButton
            onClick={onSave}
            icon={<Save className="w-4 h-4" />}
            label={isEditing ? "Update" : "Save"}
            variant="primary"
            showLabel={false}
          />
          <ToolbarButton
            onClick={onUndo}
            disabled={!canUndo}
            icon={<Undo className="w-4 h-4" />}
          />
          <ToolbarButton
            onClick={onRedo}
            disabled={!canRedo}
            icon={<Redo className="w-4 h-4" />}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <ToolbarButton
          onClick={onAddTable}
          icon={<Plus className="w-4 h-4" />}
          label="Add Table"
          variant="primary"
        />
        <ToolbarButton
          onClick={onToggleSQL}
          icon={<Code className="w-4 h-4" />}
          label="SQL"
        />
      </div>
    </div>
  );
};