import React from 'react';
import { Bot, User } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types/designer';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
          {message.sender === 'user' ? (
            <User className="w-4 h-4 text-indigo-600" />
          ) : (
            <Bot className="w-4 h-4 text-gray-600" />
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          message.sender === 'user' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 text-black border border-gray-200'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className={`text-xs mt-1 ${
            message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};