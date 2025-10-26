import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../../types/designer';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-300`}>
      <div className={`flex items-start space-x-3 max-w-sm ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`
          relative p-2.5 rounded-full shrink-0
          ${message.sender === 'user' 
            ? 'bg-black shadow-lg' 
            : 'bg-gray-100 shadow-md border border-gray-200'
          }
        `}>
          {message.sender === 'user' ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <>
              <Bot className="w-4 h-4 text-black" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
            </>
          )}
          {message.sender === 'ai' && (
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-black animate-pulse" />
          )}
        </div>
        
        <div className={`
          relative p-4 rounded-2xl shadow-sm
          ${message.sender === 'user' 
            ? 'bg-black text-white' 
            : 'bg-white text-black border border-gray-200'
          }
          transform transition-all duration-200 hover:shadow-md
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          <div className={`
            flex items-center justify-between mt-2 pt-2
            ${message.sender === 'user' ? 'border-t border-white/20' : 'border-t border-gray-200'}
          `}>
            <p className={`text-xs ${
              message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            
            {message.sender === 'ai' && (
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">AI</span>
              </div>
            )}
          </div>
          
          <div className={`
            absolute top-3 w-3 h-3 transform rotate-45
            ${message.sender === 'user' 
              ? 'bg-black -right-1.5' 
              : 'bg-white border-l border-t border-gray-200 -left-1.5'
            }
          `}></div>
        </div>
      </div>
    </div>
  );
};