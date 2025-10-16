import React from 'react';
import {
  Save,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
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
  const baseClasses = "p-2 transition-all duration-300 rounded-lg flex items-center space-x-2";
  const variantClasses = {
    primary: "bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
  };
  const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''}`}
    >
      {icon}
      {label && showLabel && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
};

interface DesignerToolbarProps {
  onNavigateHome: () => void;
  onSave: () => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onAddTable: () => void;
  onToggleSQL: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showToolbar: boolean;
}

export const DesignerToolbar: React.FC<DesignerToolbarProps> = ({
  onNavigateHome,
  onSave,
  onDownload,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onAddTable,
  onToggleSQL,
  canUndo,
  canRedo,
  showToolbar,
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
        <h1 className="text-2xl font-bold text-gray-900">Database Designer</h1>
        
        <div className="hidden md:flex items-center space-x-2">
          <ToolbarButton
            onClick={onSave}
            icon={<Save className="w-4 h-4" />}
            variant="primary"
            showLabel={false}
          />
          <ToolbarButton
            onClick={onDownload}
            icon={<Download className="w-4 h-4" />}
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
          <ToolbarButton
            onClick={onZoomIn}
            icon={<ZoomIn className="w-4 h-4" />}
          />
          <ToolbarButton
            onClick={onZoomOut}
            icon={<ZoomOut className="w-4 h-4" />}
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