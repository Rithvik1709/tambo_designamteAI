import React, { useRef, useEffect } from 'react';
import { Message } from '@/types';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Card } from '@/components/ui/card';

interface ChatInterfaceProps {
  messages: Message[];
  isGenerating: boolean;
  onSendMessage: (message: string) => void;
  onComponentClick?: (componentId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isGenerating,
  onSendMessage,
  onComponentClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onComponentClick={onComponentClick}
          />
        ))}
        {isGenerating && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">Generating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <ChatInput onSend={onSendMessage} disabled={isGenerating} />
      </div>
    </Card>
  );
};

export default ChatInterface;
