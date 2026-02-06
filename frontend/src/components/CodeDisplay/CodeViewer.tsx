import React, { useState } from 'react';
import { GeneratedComponent, Framework } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download } from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeViewerProps {
  component: GeneratedComponent | null;
  framework?: Framework;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ component, framework }) => {
  const [copied, setCopied] = useState(false);

  if (!component) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No code to display</p>
      </Card>
    );
  }

  const displayFramework = framework || component.framework;
  const code = component.code;

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = getFileExtension(displayFramework);
    downloadFile(code, `${component.name}.${extension}`, 'text/plain');
  };

  const highlightedCode = Prism.highlight(
    code,
    Prism.languages.tsx || Prism.languages.jsx,
    'tsx'
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">
          {component.name}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({displayFramework})
          </span>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-auto bg-[#2d2d2d] p-4">
          <pre className="!m-0 !bg-transparent">
            <code
              className="language-tsx text-sm"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

function getFileExtension(framework: Framework): string {
  switch (framework) {
    case 'react':
      return 'tsx';
    case 'vue':
      return 'vue';
    case 'svelte':
      return 'svelte';
    case 'html':
      return 'html';
    default:
      return 'txt';
  }
}

export default CodeViewer;
