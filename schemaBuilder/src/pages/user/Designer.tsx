import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  ConnectionMode,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Save,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Plus,
  Table,
  Link,
  MousePointer,
  Move,
  Copy,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  Code,
  Home,
} from 'lucide-react';

// Custom Table Node Component
const TableNode = ({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div className={`
      bg-white rounded-xl shadow-lg border-2 transition-all duration-300 min-w-48
      ${selected 
        ? 'border-indigo-500 shadow-xl shadow-indigo-500/25 animate-pulse' 
        : 'border-gray-200 hover:border-indigo-300'
      }
      hover:scale-105 hover:translate-y-[-2px]
    `}>
      {/* Table Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{data.label}</h3>
          <Table className="w-4 h-4" />
        </div>
      </div>
      
      {/* Table Fields */}
      <div className="p-3">
        {data.fields?.map((field: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-1 text-xs border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-700">{field.name}</span>
            <span className="text-gray-500">{field.type}</span>
          </div>
        ))}
        {(!data.fields || data.fields.length === 0) && (
          <p className="text-gray-400 text-xs italic">No fields defined</p>
        )}
      </div>
    </div>
  );
};

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
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showToolbar] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [, setReactFlowInstance] = useState<any>(null);

  // Sample initial data
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'table',
      position: { x: 100, y: 100 },
      data: {
        label: 'users',
        fields: [
          { name: 'id', type: 'INTEGER' },
          { name: 'email', type: 'VARCHAR(255)' },
          { name: 'name', type: 'VARCHAR(100)' },
          { name: 'created_at', type: 'TIMESTAMP' },
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
          { name: 'id', type: 'INTEGER' },
          { name: 'user_id', type: 'INTEGER' },
          { name: 'title', type: 'VARCHAR(255)' },
          { name: 'content', type: 'TEXT' },
          { name: 'published_at', type: 'TIMESTAMP' },
        ],
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    },
  ];

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge({
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
    }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsRightSidebarOpen(true);
  }, []);

  const addNewTable = useCallback(() => {
    const newNode: Node = {
      id: `table-${Date.now()}`,
      type: 'table',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: 'new_table',
        fields: [
          { name: 'id', type: 'INTEGER' },
        ],
      },
    };
    setNodes((nds: Node[]) => [...nds, newNode]);
  }, [setNodes]);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'move', icon: Move, label: 'Move Canvas' },
    { id: 'table', icon: Table, label: 'Add Table' },
    { id: 'relationship', icon: Link, label: 'Add Relationship' },
  ];

  const generateSQL = () => {
    return nodes.map((node: Node) => {
      const fields = node.data.fields?.map((field: any) => 
        `  ${field.name} ${field.type}`
      ).join(',\n') || '  id INTEGER';
      
      return `CREATE TABLE ${node.data.label} (\n${fields}\n);`;
    }).join('\n\n');
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className={`
        bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between
        transform transition-all duration-500 ease-in-out z-30
        ${showToolbar ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Database Designer</h1>
          <div className="hidden md:flex items-center space-x-2">
            <button className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 rounded-lg">
              <Save className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300">
              <Undo className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300">
              <Redo className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300">
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={addNewTable}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Table</span>
          </button>
          <button 
            onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">SQL</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className={`
          bg-white border-r border-gray-200 flex flex-col z-20
          transform transition-all duration-500 ease-in-out
          ${isLeftSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className={`font-semibold text-gray-900 transition-opacity duration-300 ${isLeftSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}>
                Tools
              </h2>
              <button
                onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-300"
              >
                {isLeftSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const isActive = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`
                      group relative w-full flex items-center p-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                      ${isLeftSidebarOpen ? 'justify-start' : 'justify-center'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {isLeftSidebarOpen && (
                      <span className="ml-3 font-medium">{tool.label}</span>
                    )}
                    
                    {!isLeftSidebarOpen && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                        {tool.label}
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
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

        {/* Right Sidebar */}
        <div className={`
          bg-white border-l border-gray-200 flex flex-col z-20
          transform transition-all duration-500 ease-in-out
          ${isRightSidebarOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'}
        `}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Table Properties</h2>
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {selectedNode && (
            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Table Name</label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter table name"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">Fields</label>
                  <button className="p-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded transition-all duration-300">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedNode.data.fields?.map((field: any, index: number) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
                      <input
                        type="text"
                        value={field.name}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Field name"
                      />
                      <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="INTEGER">INTEGER</option>
                        <option value="VARCHAR(255)">VARCHAR(255)</option>
                        <option value="TEXT">TEXT</option>
                        <option value="TIMESTAMP">TIMESTAMP</option>
                        <option value="BOOLEAN">BOOLEAN</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {!selectedNode && (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a table to edit its properties</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panel */}
      <div className={`
        bg-white border-t border-gray-200 transition-all duration-500 ease-in-out z-10
        ${isBottomPanelOpen ? 'h-64' : 'h-0'}
        overflow-hidden
      `}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">SQL Preview</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 rounded text-sm flex items-center space-x-1">
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => setIsBottomPanelOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto">
            <pre>{generateSQL()}</pre>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={addNewTable}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 rounded-full z-50 md:hidden"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsLeftSidebarOpen(true)}
        className="fixed top-4 left-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 z-30 md:hidden"
        style={{ display: isLeftSidebarOpen ? 'none' : 'block' }}
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Designer;