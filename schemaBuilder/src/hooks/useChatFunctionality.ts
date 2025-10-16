import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types/designer';

const initialMessage: ChatMessage = {
  id: '1',
  content: 'Hello! I\'m your AI assistant. I can help you design your database schema, suggest improvements, and answer questions about best practices.\n\n🎯 **Quick Tips:**\n• Drag from Primary Key fields (yellow dots) to create relationships\n• Use the right sidebar to edit table properties\n• Click "SQL" to see your generated schema',
  sender: 'ai',
  timestamp: new Date(),
};

export const useChatFunctionality = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([initialMessage]);
  const [currentMessage, setCurrentMessage] = useState('');

  const getAIResponse = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('table') || lowerMessage.includes('create')) {
      return '🆕 **Creating Tables:**\n• Click "Add Table" button in the toolbar\n• Each table starts with an ID primary key\n• Click on a table to edit its properties in the right sidebar\n• Add fields with the "Add Field" button\n\n💡 **Pro Tip:** Use meaningful table names like "users", "orders", "products"';
    } else if (lowerMessage.includes('relationship') || lowerMessage.includes('foreign key') || lowerMessage.includes('connect')) {
      return '🔗 **Creating Relationships:**\n1. Drag from a **Primary Key field** (yellow dot) on one table\n2. Drop it on any field in another table\n3. The target field automatically becomes a Foreign Key\n4. Relationship lines will appear with labels\n\n⚠️ **Important:** Relationships must start from Primary Key fields!';
    } else if (lowerMessage.includes('sql') || lowerMessage.includes('generate')) {
      return '📝 **SQL Generation:**\n• Click the "SQL" button to view generated code\n• Includes CREATE TABLE statements\n• Shows all constraints (PRIMARY KEY, NOT NULL, UNIQUE)\n• Generates ALTER TABLE statements for foreign keys\n• Copy button available for easy use\n\n✨ The SQL updates automatically as you design!';
    } else if (lowerMessage.includes('field') || lowerMessage.includes('column')) {
      return '⚙️ **Managing Fields:**\n• **Primary Key:** Unique identifier (yellow indicator)\n• **Foreign Key:** References another table (blue indicator)\n• **Not Null:** Field must have a value\n• **Unique:** No duplicate values allowed\n• **Default Value:** Fallback when no value provided\n\n🎨 **Data Types:** INTEGER, VARCHAR, TEXT, TIMESTAMP, BOOLEAN, DECIMAL, etc.';
    } else if (lowerMessage.includes('constraint') || lowerMessage.includes('primary') || lowerMessage.includes('unique')) {
      return '🔒 **Database Constraints:**\n• **Primary Key:** Automatically NOT NULL + UNIQUE\n• **Foreign Key:** Links to another table\'s Primary Key\n• **Unique:** Ensures no duplicate values\n• **Not Null:** Prevents empty values\n\n💡 **Best Practice:** Every table should have a Primary Key!';
    } else if (lowerMessage.includes('best practice') || lowerMessage.includes('tips')) {
      return '🏆 **Database Design Best Practices:**\n• Use singular table names (user, not users)\n• Always have a Primary Key (usually ID)\n• Keep field names descriptive but concise\n• Use appropriate data types\n• Create indexes for frequently searched fields\n• Normalize data to reduce redundancy\n\n🎯 **Schema Tip:** Start with main entities, then add relationships!';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('guide')) {
      return '🚀 **Welcome to Database Designer!**\n\n**Quick Start:**\n1️⃣ Add tables with the "Add Table" button\n2️⃣ Click tables to edit fields and properties\n3️⃣ Drag from yellow dots to create relationships\n4️⃣ Check your SQL with the "SQL" button\n\n**Features:**\n• Visual table design\n• Drag-and-drop relationships\n• Real-time SQL generation\n• Undo/Redo support\n• Professional constraints\n\nWhat would you like to create first? 🎨';
    } else if (lowerMessage.includes('undo') || lowerMessage.includes('redo')) {
      return '↩️ **Undo/Redo:**\n• Undo: Ctrl+Z or click the undo button\n• Redo: Ctrl+Y or click the redo button\n• Automatically saves your design history\n• Keeps up to 50 previous states\n\n💾 **Auto-Save:** Changes are saved every second!';
    } else if (lowerMessage.includes('export') || lowerMessage.includes('save')) {
      return '💾 **Saving Your Work:**\n• Use the Save button to store your schema\n• Export SQL with the copy button in SQL preview\n• Download button for schema files\n• Changes auto-save as you work\n\n📤 **Export Options:** SQL scripts, JSON schema, or visual exports coming soon!';
    } else {
      return '🤖 **I\'m here to help with database design!**\n\nI can assist with:\n• Creating tables and fields\n• Setting up relationships\n• Understanding constraints\n• Generating SQL\n• Best practices\n• Troubleshooting\n\n❓ **Try asking:**\n"How do I create a relationship?"\n"What\'s a foreign key?"\n"Show me best practices"\n\nWhat would you like to know? 😊';
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: getAIResponse(currentMessage),
        sender: 'ai',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  }, [currentMessage, getAIResponse]);

  return {
    chatMessages,
    currentMessage,
    setCurrentMessage,
    sendMessage,
  };
};