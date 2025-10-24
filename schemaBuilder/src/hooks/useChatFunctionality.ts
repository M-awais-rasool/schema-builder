import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types/designer';
import { aiApi } from '../services/api';

const initialMessage: ChatMessage = {
  id: '1',
  content: 'Hello! I\'m your AI assistant. I can help you design your database schema, suggest improvements, and answer questions about best practices.\n\n🎯 **Quick Tips:**\n• Drag from Primary Key fields (yellow dots) to create relationships\n• Use the right sidebar to edit table properties\n• Click "SQL" to see your generated schema',
  sender: 'ai',
  timestamp: new Date(),
};

export const useChatFunctionality = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialMessage]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await aiApi.chat(messageToSend, `session-${Date.now()}`);
      
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: response.data.message,
        sender: 'ai',
        timestamp: new Date(),
        schemaAction: response.data.schema_action
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [currentMessage]);

  return {
    chatMessages,
    currentMessage,
    setCurrentMessage,
    sendMessage,
    isLoading,
  };
};