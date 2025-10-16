import { useState, useCallback, useEffect } from 'react';
import type { Node, Edge } from 'reactflow';

interface UseHistoryManagementProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export const useHistoryManagement = ({ 
  nodes, 
  edges, 
  setNodes, 
  setEdges 
}: UseHistoryManagementProps) => {
  const [history, setHistory] = useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes, edges });
      return newHistory.slice(-50); 
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [nodes, edges, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (nodes.length > 0) {
        saveToHistory();
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, saveToHistory]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
};