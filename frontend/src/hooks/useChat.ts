import { useState, useCallback } from 'react';
import { Message, GeneratedComponent } from '../types';
import { generateId } from '../lib/utils';

interface UseChatReturn {
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  addComponentMessage: (content: string, component: GeneratedComponent) => void;
  clearMessages: () => void;
  updateLastMessage: (content: string) => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Hi! I\'m DesignMate AI. Describe the component you\'d like to create, and I\'ll generate it for you.',
      timestamp: new Date(),
    },
  ]);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const addComponentMessage = useCallback(
    (content: string, component: GeneratedComponent) => {
      const newMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content,
        component,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: 'Chat cleared. What would you like to create?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content,
        };
      }
      return updated;
    });
  }, []);

  return {
    messages,
    addMessage,
    addComponentMessage,
    clearMessages,
    updateLastMessage,
  };
}
