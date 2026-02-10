import React, { useEffect, useRef, useState } from 'react';
import { GeneratedComponent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Maximize2 } from 'lucide-react';

interface LivePreviewProps {
  component: GeneratedComponent | null;
}

const LivePreview: React.FC<LivePreviewProps> = ({ component }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (component && iframeRef.current) {
      updatePreview();
    }
  }, [component]);

  const updatePreview = () => {
    if (!component || !iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const html = generatePreviewHTML(component);
    doc.open();
    doc.write(html);
    doc.close();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    updatePreview();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen();
    }
  };

  if (!component) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No component to preview</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Live Preview</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="Component Preview"
          sandbox="allow-scripts"
        />
      </CardContent>
    </Card>
  );
};

function generatePreviewHTML(component: GeneratedComponent): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${component.name} Preview</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <style>
        body {
          margin: 0;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        ${component.code}
        
        // Render the component
        const root = ReactDOM.createRoot(document.getElementById('root'));
        try {
          // Try to find and render the exported component
          const componentName = '${component.name}';
          if (typeof window[componentName] !== 'undefined') {
            root.render(React.createElement(window[componentName]));
          } else {
            root.render(
              React.createElement('div', { className: 'p-4 border border-gray-300 rounded' },
                'Preview not available. View code to see the component.'
              )
            );
          }
        } catch (error) {
          root.render(
            React.createElement('div', { className: 'p-4 border border-red-300 bg-red-50 rounded text-red-800' },
              'Error rendering component: ' + error.message
            )
          );
        }
      </script>
    </body>
    </html>
  `;
}

export default LivePreview;
