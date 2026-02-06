import React, { useState, useEffect } from 'react';
import { GeneratedComponent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Lightbulb, Code2 } from 'lucide-react';
import { explainCode } from '@/services/codeConverter';
import DesignExplanation from './DesignExplanation';

interface LearningPanelProps {
  component: GeneratedComponent | null;
  isOpen: boolean;
}

const LearningPanel: React.FC<LearningPanelProps> = ({ component, isOpen }) => {
  const [explanation, setExplanation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (component && isOpen && !explanation) {
      loadExplanation();
    }
  }, [component, isOpen]);

  const loadExplanation = async () => {
    if (!component) return;

    setIsLoading(true);
    try {
      const result = await explainCode(component.code, component.framework);
      setExplanation(result);
    } catch (error) {
      console.error('Failed to load explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !component) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Learning Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="explanation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="concepts">Concepts</TabsTrigger>
            <TabsTrigger value="tips">Best Practices</TabsTrigger>
          </TabsList>

          <TabsContent value="explanation" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading explanation...
              </div>
            ) : explanation ? (
              <DesignExplanation explanation={explanation} />
            ) : (
              <div className="text-center py-8">
                <Button onClick={loadExplanation}>Load Explanation</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="concepts" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <Code2 className="mr-2 h-4 w-4" />
                Key Concepts
              </h4>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  • Component composition and reusability
                </li>
                <li className="text-sm text-muted-foreground">
                  • Props and state management patterns
                </li>
                <li className="text-sm text-muted-foreground">
                  • Event handling and user interaction
                </li>
                <li className="text-sm text-muted-foreground">
                  • Styling with Tailwind CSS utilities
                </li>
                <li className="text-sm text-muted-foreground">
                  • TypeScript for type safety
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                Best Practices
              </h4>
              <ul className="space-y-2">
                <li className="text-sm">
                  <strong>Keep components small:</strong>
                  <span className="text-muted-foreground ml-1">
                    Break down complex UIs into smaller, reusable pieces
                  </span>
                </li>
                <li className="text-sm">
                  <strong>Use TypeScript:</strong>
                  <span className="text-muted-foreground ml-1">
                    Catch errors early with proper type definitions
                  </span>
                </li>
                <li className="text-sm">
                  <strong>Accessibility first:</strong>
                  <span className="text-muted-foreground ml-1">
                    Always include ARIA labels and keyboard navigation
                  </span>
                </li>
                <li className="text-sm">
                  <strong>Responsive design:</strong>
                  <span className="text-muted-foreground ml-1">
                    Use Tailwind's responsive utilities for all screen sizes
                  </span>
                </li>
                <li className="text-sm">
                  <strong>Performance:</strong>
                  <span className="text-muted-foreground ml-1">
                    Optimize with React.memo, useMemo, and useCallback
                  </span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LearningPanel;
