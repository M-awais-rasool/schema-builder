import React, { useRef, useEffect } from 'react';
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onToggle,
  messages,
  currentMessage,
  setCurrentMessage,
  onSendMessage,
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
      bg-white border-r border-gray-200 flex flex-col z-20
      transform transition-all duration-500 ease-in-out
      ${isOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'}
    `}>
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-black rounded-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}>
              <h2 className="font-semibold text-black">AI Assistant</h2>
              <p className="text-sm text-gray-600">Database Design Helper</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-300 text-black"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={chatMessagesEndRef} />
      </div>
      
      <ChatInput
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};