import React, { useState } from 'react';
import { Framework, GeneratedComponent } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { convertCode } from '@/services/codeConverter';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface FrameworkTabsProps {
  component: GeneratedComponent | null;
}

const frameworks: { id: Framework; label: string }[] = [
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'html', label: 'HTML' },
];

const FrameworkTabs: React.FC<FrameworkTabsProps> = ({ component }) => {
  const [activeFramework, setActiveFramework] = useState<Framework>(
    component?.framework || 'react'
  );
  const [convertedCode, setConvertedCode] = useState<Record<Framework, string>>({
    react: component?.code || '',
    vue: '',
    svelte: '',
    html: '',
  });
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const handleTabChange = async (value: string) => {
    const framework = value as Framework;
    setActiveFramework(framework);

    // If code for this framework doesn't exist, convert it
    if (!convertedCode[framework] && component) {
      setIsConverting(true);
      try {
        const result = await convertCode(
          component.code,
          component.framework,
          framework
        );
        setConvertedCode((prev) => ({
          ...prev,
          [framework]: result.code,
        }));
      } catch (error) {
        console.error('Conversion error:', error);
      } finally {
        setIsConverting(false);
      }
    }
  };

  const handleCopy = async () => {
    const code = convertedCode[activeFramework];
    if (code) {
      await copyToClipboard(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const code = convertedCode[activeFramework];
    if (code && component) {
      const extension = getFileExtension(activeFramework);
      downloadFile(code, `${component.name}.${extension}`, 'text/plain');
    }
  };

  if (!component) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No component code available</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <Tabs value={activeFramework} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList>
            {frameworks.map((fw) => (
              <TabsTrigger key={fw.id} value={fw.id}>
                {fw.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {frameworks.map((fw) => (
          <TabsContent
            key={fw.id}
            value={fw.id}
            className="flex-1 m-0 overflow-hidden"
          >
            <div className="h-full overflow-auto p-4 bg-[#2d2d2d]">
              {isConverting && activeFramework === fw.id ? (
                <div className="text-white">Converting to {fw.label}...</div>
              ) : (
                <pre className="!m-0 !bg-transparent">
                  <code
                    className="language-tsx"
                    dangerouslySetInnerHTML={{
                      __html: Prism.highlight(
                        convertedCode[fw.id] || '// Code will appear here',
                        Prism.languages.tsx,
                        'tsx'
                      ),
                    }}
                  />
                </pre>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
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

export default FrameworkTabs;
