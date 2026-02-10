import React from 'react';
import { GeneratedComponent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, AlertCircle } from 'lucide-react';

interface ComponentPreviewProps {
  component: GeneratedComponent | null;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component }) => {
  if (!component) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground p-8">
          <Eye className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No component to preview</p>
          <p className="text-sm mt-2">
            Start a conversation to generate a component
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{component.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {component.framework}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Preview Container */}
          <div className="border rounded-lg p-6 bg-background min-h-[300px]">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Live preview is currently in development. View the code to see the component implementation.
              </AlertDescription>
            </Alert>
            
            {/* Placeholder for live preview */}
            <div className="mt-4 p-4 border-2 border-dashed border-muted rounded-lg bg-muted/10">
              <p className="text-sm text-muted-foreground text-center">
                Component Preview Area
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                {component.description || 'Generated component will render here'}
              </p>
            </div>
          </div>

          {/* Component Info */}
          {component.explanation && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Explanation</h4>
              <p className="text-sm text-muted-foreground">
                {component.explanation}
              </p>
            </div>
          )}

          {/* Suggestions */}
          {component.suggestions && component.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Suggestions</h4>
              <ul className="list-disc list-inside space-y-1">
                {component.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentPreview;
