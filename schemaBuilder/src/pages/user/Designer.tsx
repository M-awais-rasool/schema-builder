import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  ConnectionMode,
} from 'reactflow';
import type { Node } from 'reactflow';
import 'reactflow/dist/style.css';

// Components
import { TableNode } from '../../components/designer/TableNode';
import { DesignerToolbar } from '../../components/toolbar';
import { ChatPanel } from '../../components/chat';
import { TablePropertiesPanel } from '../../components/sidebars';
import { SQLPreviewPanel } from '../../components/panels';
import { MobileButtons } from '../../components/mobile';

// Hooks
import { 
  useTableOperations, 
  useChatFunctionality, 
  useHistoryManagement, 
  useRelationshipOperations 
} from '../../hooks';

// Utils
import { generateSQL } from '../../utils/sqlGenerator';
import { initialEdges, initialNodes } from '../../utils/utils';

const nodeTypes = {
  table: TableNode,
};

const Designer: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showToolbar] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [, setReactFlowInstance] = useState<any>(null);

  // Custom hooks
  const { chatMessages, currentMessage, setCurrentMessage, sendMessage } = useChatFunctionality();
  
  const { undo, redo, canUndo, canRedo } = useHistoryManagement({
    nodes,
    edges,
    setNodes,
    setEdges,
  });

  const {
    addNewTable,
    updateTableName,
    addField,
    updateField,
    removeField,
    deleteTable,
    duplicateTable,
  } = useTableOperations({
    nodes,
    setNodes,
    setEdges,
    selectedNode,
    setSelectedNode,
  });

  const { onConnect } = useRelationshipOperations({
    nodes,
    setEdges,
    updateField,
  });

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (selectedNode) {
      const updatedSelectedNode = nodes.find(node => node.id === selectedNode.id);
      if (updatedSelectedNode && updatedSelectedNode !== selectedNode) {
        setSelectedNode(updatedSelectedNode);
      }
    }
  }, [nodes, selectedNode]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const latestNode = nodes.find(n => n.id === node.id) || node;
    setSelectedNode(latestNode);
    setIsRightSidebarOpen(true);
  }, [nodes]);

  // Utility functions
  const handleCopySQL = () => {
    const sqlContent = generateSQL(nodes, edges);
    navigator.clipboard.writeText(sqlContent);
    alert('SQL copied to clipboard!');
  };

  const handleCloseRightSidebar = () => {
    setIsRightSidebarOpen(false);
  };

  const handleDeleteTable = (tableId: string) => {
    deleteTable(tableId);
    setIsRightSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <DesignerToolbar
        onNavigateHome={() => navigate('/dashboard')}
        onSave={() => {}}
        onDownload={() => {}}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onAddTable={addNewTable}
        onToggleSQL={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
        canUndo={canUndo}
        canRedo={canRedo}
        showToolbar={showToolbar}
      />

      <div className="flex-1 flex overflow-hidden">
        <ChatPanel
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          messages={chatMessages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSendMessage={sendMessage}
        />

        <div className="flex-1 relative bg-gray-50">
          <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="w-full h-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                className="bg-white"
              >
                <Background 
                  gap={20} 
                  size={1} 
                  color="#e5e7eb"
                />
                <Controls 
                  className="bg-white border border-gray-200 rounded-lg shadow-lg"
                />
                <MiniMap 
                  className="bg-white border border-gray-200 rounded-lg shadow-lg"
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>

        <TablePropertiesPanel
          isOpen={isRightSidebarOpen}
          onClose={handleCloseRightSidebar}
          selectedNode={selectedNode}
          nodes={nodes}
          onUpdateTableName={updateTableName}
          onAddField={addField}
          onUpdateField={updateField}
          onRemoveField={removeField}
          onDeleteTable={handleDeleteTable}
          onDuplicateTable={duplicateTable}
          onUpdateEdges={setEdges}
        />
      </div>

      <SQLPreviewPanel
        isOpen={isBottomPanelOpen}
        onClose={() => setIsBottomPanelOpen(false)}
        sqlContent={generateSQL(nodes, edges)}
        onCopySQL={handleCopySQL}
      />

      <MobileButtons
        onAddTable={addNewTable}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(true)}
        isLeftSidebarOpen={isLeftSidebarOpen}
      />
    </div>
  );
};

export default Designer;