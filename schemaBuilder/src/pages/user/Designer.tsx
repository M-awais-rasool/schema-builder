import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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

import { TableNode } from '../../components/designer/TableNode';
import { DesignerToolbar } from '../../components/toolbar';
import { ChatPanel } from '../../components/chat';
import { TablePropertiesPanel } from '../../components/sidebars';
import { SQLPreviewPanel } from '../../components/panels';
import { MobileButtons } from '../../components/mobile';
import { LoadSchemaDialog } from '../../components/dialogs';
import { OnboardingFlow, type ProjectInfo } from '../../components/onboarding';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';

import { 
  useTableOperations, 
  useChatFunctionality, 
  useRelationshipOperations,
  useSchemaOperations,
} from '../../hooks';

import { generateSQL } from '../../utils/sqlGenerator';
import { initialEdges, initialNodes } from '../../utils/utils';

const nodeTypes = {
  table: TableNode,
};

const Designer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showToolbar] = useState(true);

  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [currentSchemaId, setCurrentSchemaId] = useState<string | null>(null);
  const [currentSchemaName, setCurrentSchemaName] = useState<string>('');
  const [currentSchemaDescription, setCurrentSchemaDescription] = useState<string>('');
  const [currentSchemaIsPublic, setCurrentSchemaIsPublic] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({ name: '', description: '', isPublic: false });
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [, setReactFlowInstance] = useState<any>(null);
  const { toasts, removeToast, success, error } = useToast();

  const { chatMessages, currentMessage, setCurrentMessage, sendMessage, isLoading } = useChatFunctionality();
  
  const { 
    createSchema, 
    updateSchema, 
    deleteSchema,
    getSchema,
    convertTablesToNodes
  } = useSchemaOperations();
  
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
    const loadInitialData = async () => {
      const schemaId = searchParams.get('schema');
      if (schemaId) {
        setShowOnboarding(false);
        try {
          const schema = await getSchema(schemaId);
          const { nodes: loadedNodes, edges: loadedEdges } = convertTablesToNodes(schema.tables);
          setNodes(loadedNodes);
          setEdges(loadedEdges);
          setCurrentSchemaId(schema.id);
          setCurrentSchemaName(schema.name);
          setCurrentSchemaDescription(schema.description || '');
          setCurrentSchemaIsPublic(schema.is_public || false);
          setProjectInfo({ name: schema.name, description: schema.description || '', isPublic: schema.is_public || false });
        } catch (error) {
          setNodes(initialNodes);
          setEdges(initialEdges);
        } 
      } else {
        const skipOnboarding = searchParams.get('skip') === 'true';
        if (skipOnboarding) {
          setShowOnboarding(false);
          setNodes(initialNodes);
          setEdges(initialEdges);
        }
      }
    };

    loadInitialData();
  }, [searchParams, setNodes, setEdges, getSchema, convertTablesToNodes]);

  useEffect(() => {
    if (selectedNode) {
      const updatedSelectedNode = nodes.find(node => node.id === selectedNode.id);
      if (updatedSelectedNode && updatedSelectedNode !== selectedNode) {
        setSelectedNode(updatedSelectedNode);
      }
    }
  }, [nodes, selectedNode]);

  useEffect(() => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage?.sender === 'ai' && lastMessage.schemaAction) {
      const action = lastMessage.schemaAction;
      if ((action.type === 'create_tables' || action.type === 'create_schema') && action.tables) {
        const startX = 100;
        const startY = 100;
        const tableSpacingX = 300;
        const tableSpacingY = 200;
        const tablesPerRow = 3;
        
        const newNodes = action.tables.map((table: any, index: number) => {
          const row = Math.floor(index / tablesPerRow);
          const col = index % tablesPerRow;
          
          const newNode = {
            id: table.id || `table-${Date.now()}-${index}`,
            type: 'table',
            position: { 
              x: table.position?.x || startX + (col * tableSpacingX), 
              y: table.position?.y || startY + (row * tableSpacingY) 
            },
            data: {
              label: table.name || 'New Table',
              animationDelay: index * 0.15, 
              fields: table.fields?.map((field: any) => ({
                id: field.id || `field-${Date.now()}-${Math.random()}`,
                name: field.name || 'field_name',
                type: field.type || 'VARCHAR(255)',
                isPrimaryKey: field.is_primary_key || false,
                isNotNull: field.is_not_null || false,
                isUnique: field.is_unique || false,
                defaultValue: field.default_value || '',
                isForeignKey: field.is_foreign_key || false,
                references: field.references ? {
                  tableId: field.references.table_id,
                  fieldId: field.references.field_id,
                } : undefined,
              })) || [
                {
                  id: `field-${Date.now()}`,
                  name: 'id',
                  type: 'INTEGER',
                  isPrimaryKey: true,
                  isNotNull: true,
                  isUnique: false,
                  defaultValue: '',
                  isForeignKey: false,
                }
              ],
            },
          };
          return newNode;
        });

        setNodes(prevNodes => {
          const updatedNodes = [...prevNodes, ...newNodes];
          return updatedNodes;
        });
        
        if (action.relationships && action.relationships.length > 0) {
          setTimeout(() => {
            const newEdges = action.relationships!.map((rel: any) => ({
              id: rel.id || `edge-${Date.now()}-${Math.random()}`,
              source: rel.from,
              target: rel.to,
              sourceHandle: rel.from_port,
              targetHandle: rel.to_port,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 2 },
              label: rel.type || 'relationship',
              labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
              labelStyle: { 
                fontSize: '12px', 
                fontWeight: 500,
                color: '#374151'
              },
            }));
            
            setEdges(prevEdges => [...prevEdges, ...newEdges]);
          }, 500); 
        }
        
        if (newNodes.length > 0) {
          setTimeout(() => {
            setSelectedNode(newNodes[0]);
            setIsRightSidebarOpen(true);
          }, 300);
        }
      }
    }
  }, [chatMessages, setNodes, setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    const latestNode = nodes.find(n => n.id === node.id) || node;
    setSelectedNode(latestNode);
    setIsRightSidebarOpen(true);
  }, [nodes]);

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

  const handleSaveSchema = async (name?: string, description?: string, isPublic?: boolean) => {
    try {
      const schemaName = name || currentSchemaName || 'Untitled Schema';
      const schemaDescription = description || currentSchemaDescription || '';
      const schemaIsPublic = isPublic !== undefined ? isPublic : currentSchemaIsPublic;
      if (currentSchemaId) {
        await updateSchema(currentSchemaId, {
          name: schemaName,
          description: schemaDescription,
          nodes,
          isPublic: schemaIsPublic,
        });
        success('Schema Updated!', `${schemaName} has been successfully updated.`);
      } else {
        const newSchema = await createSchema(schemaName, schemaDescription, nodes, schemaIsPublic);
        setCurrentSchemaId(newSchema.id);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('schema', newSchema.id);
        window.history.replaceState({}, '', newUrl.toString());
        success('Schema Saved!', `${schemaName} has been successfully created.`);
      }
      setCurrentSchemaName(schemaName);
      setCurrentSchemaDescription(schemaDescription);
      setCurrentSchemaIsPublic(schemaIsPublic);
    } catch (err: any) {
      error('Save Failed', err.message || 'Failed to save schema. Please try again.');
    }
  };

  const handleLoadSchema = (schema: any) => {
    try {
      const { nodes: loadedNodes, edges: loadedEdges } = convertTablesToNodes(schema.tables);
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      setCurrentSchemaId(schema.id);
      setCurrentSchemaName(schema.name);
      alert('Schema loaded successfully!');
    } catch (error) {
      console.error('Failed to load schema:', error);
      alert('Failed to load schema');
    }
  };

  const handleDeleteSchema = async (schemaId: string) => {
    try {
      await deleteSchema(schemaId);
      if (currentSchemaId === schemaId) {
        setCurrentSchemaId(null);
        setCurrentSchemaName('');
      }
      alert('Schema deleted successfully!');
    } catch (error) {
      console.error('Failed to delete schema:', error);
      alert('Failed to delete schema');
    }
  };

  const handleOnboardingComplete = (info: ProjectInfo, databaseType: 'mysql' | 'graphql', schemaId?: string) => {
    setProjectInfo(info);
    setCurrentSchemaName(info.name);
    setCurrentSchemaDescription(info.description);
    setCurrentSchemaIsPublic(info.isPublic);
    
    if (schemaId) {
      setCurrentSchemaId(schemaId);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('schema', schemaId);
      window.history.replaceState({}, '', newUrl.toString());
    }
    
    if (databaseType === 'mysql') {
      setShowOnboarding(false);
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      alert('GraphQL support is coming soon! Please choose MySQL for now.');
    }
  };

  if (showOnboarding) {
    return (
      <div className="relative">
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          initialProjectInfo={projectInfo}
        />
        <button
          onClick={() => {
            setShowOnboarding(false);
            setNodes(initialNodes);
            setEdges(initialEdges);
          }}
          className="absolute top-4 right-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors duration-200"
          style={{ zIndex: 9999 }}
        >
          Skip Onboarding (Dev)
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-screen bg-white flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DesignerToolbar
        onNavigateHome={() => navigate('/dashboard')}
        onSave={() => handleSaveSchema()}
        onAddTable={addNewTable}
        onToggleSQL={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
        showToolbar={showToolbar}
        schemaName={currentSchemaName}
        isEditing={!!currentSchemaId}
      />
     <div className="flex-1 flex overflow-hidden">
        <ChatPanel
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          messages={chatMessages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSendMessage={sendMessage}
          isLoading={isLoading}
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



      <LoadSchemaDialog
        isOpen={isLoadDialogOpen}
        onClose={() => setIsLoadDialogOpen(false)}
        onLoad={handleLoadSchema}
        onDelete={handleDeleteSchema}
      />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </motion.div>
  );
};

export default Designer;