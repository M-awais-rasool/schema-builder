import React from 'react';
import { Menu, Plus } from 'lucide-react';

interface MobileButtonsProps {
  onAddTable: () => void;
  onToggleLeftSidebar: () => void;
  isLeftSidebarOpen: boolean;
}

export const MobileButtons: React.FC<MobileButtonsProps> = ({
  onAddTable,
  onToggleLeftSidebar,
  isLeftSidebarOpen,
}) => {
  return (
    <>
      <button
        onClick={onAddTable}
        className="fixed bottom-6 right-6 p-4 bg-black hover:bg-gray-800 text-white border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-full z-50 md:hidden"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={onToggleLeftSidebar}
        className="fixed top-4 left-4 p-3 bg-black hover:bg-gray-800 text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 z-30 md:hidden"
        style={{ display: isLeftSidebarOpen ? 'none' : 'block' }}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};