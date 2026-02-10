import React from 'react';
import { Message } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  onComponentClick?: (componentId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onComponentClick }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-1">
          <Card className={`p-3 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : isSystem 
              ? 'bg-muted' 
              : 'bg-card'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>

            {/* Component Preview */}
            {message.component && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Code2 size={16} />
                    <span className="text-xs font-medium">{message.component.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{message.component.framework}</span>
                </div>
                
                {message.component.description && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {message.component.description}
                  </p>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onComponentClick?.(message.component!.id)}
                >
                  View Component
                </Button>
              </div>
            )}
          </Card>

          {/* Timestamp */}
          <span className={`text-xs text-muted-foreground ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
