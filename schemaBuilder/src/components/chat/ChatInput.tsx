import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  setCurrentMessage,
  onSendMessage,
  isLoading = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  useEffect(() => {
    resize();
  }, [currentMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4">
      <div className="relative">
        <div className="relative flex items-center space-x-3">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "AI is thinking..." : "Ask me about database..."}
              disabled={isLoading}
              rows={1}
              className={`
                w-full px-4 py-3 pr-12
                bg-white
                border border-gray-300
                rounded-xl
                focus:ring-2 focus:ring-black/20 focus:border-black
                focus:outline-none
                text-black placeholder-gray-500
                disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
                transition-all duration-200
                shadow-sm hover:shadow-md focus:shadow-lg
                resize-none overflow-hidden
              `}
            />
          </div>
          
          <button
            onClick={onSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className="
              relative overflow-hidden
              px-4 py-3
              bg-black
              hover:bg-gray-800
              disabled:bg-gray-300
              text-white rounded-xl
              transition-all duration-200
              flex items-center justify-center
              shadow-lg hover:shadow-xl
              disabled:shadow-sm
              transform hover:scale-105 active:scale-95
              disabled:cursor-not-allowed disabled:transform-none
              group
            "
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <Send className={`
              w-4 h-4 relative z-10
              transition-transform duration-200
              ${isLoading ? 'animate-pulse' : 'group-hover:translate-x-0.5'}
            `} />
          </button>
        </div>
        
        <div className="absolute -bottom-px left-0 right-16 h-px bg-black opacity-0 transition-opacity duration-200 group-focus-within:opacity-100"></div>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
        <span>Press Enter to send, Shift+Enter for new line</span>
      </div>
    </div>
  );
};