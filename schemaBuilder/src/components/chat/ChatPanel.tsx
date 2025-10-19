import React, { useRef, useEffect } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight, Bot, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { ChatMessage as ChatMessageType } from '../../types/designer';

interface ChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessageType[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onToggle,
  messages,
  currentMessage,
  setCurrentMessage,
  onSendMessage,
  isLoading = false,
}) => {
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`
      bg-white border-r border-gray-200 
      flex flex-col z-20 shadow-lg
      transform transition-all duration-500 ease-in-out
      ${isOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}
      relative overflow-hidden
    `}>
      
      <div className="relative p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2.5 bg-black rounded-xl shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className={`transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 md:opacity-0'}`}>
              <div className="flex items-center space-x-1">
                <h2 className="font-semibold text-black">AI Assistant</h2>
                <Sparkles className="w-4 h-4 text-black animate-pulse" />
              </div>
              <p className="text-sm text-gray-600">Database Design Helper</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-black hover:scale-110 transform"
            aria-label={isOpen ? "Close chat" : "Open chat"}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className={`
        flex-1 overflow-y-auto p-4 space-y-4 
        bg-white
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
        ${isOpen ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-300
      `}>
        {messages.length === 0 && isOpen && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-black font-medium mb-2">Welcome to AI Assistant</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
              Ask me anything about database design, schemas, or get help with your project!
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="relative">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-black"></div>
              <div className="absolute inset-0 rounded-full bg-gray-100/20"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-black">AI is thinking...</span>
              <span className="text-xs text-gray-600">Generating response</span>
            </div>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className={`
        relative border-t border-gray-200 bg-white
        ${isOpen ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-300
      `}>
        <ChatInput
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
    </div>
  );
};