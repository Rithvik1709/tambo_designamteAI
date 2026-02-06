import React, { useState } from 'react';
import { GeneratedComponent, Framework, ExportOptions as ExportOptionsType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileDown } from 'lucide-react';
import { downloadFile } from '@/lib/utils';
import { convertCode } from '@/services/codeConverter';

interface ExportOptionsProps {
  component: GeneratedComponent | null;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ component }) => {
  const [options, setOptions] = useState<ExportOptionsType>({
    framework: component?.framework || 'react',
    includeTypes: true,
    includeStyles: true,
    format: 'single-file',
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!component) return;

    setIsExporting(true);

    try {
      let code = component.code;

      // Convert to selected framework if different
      if (options.framework !== component.framework) {
        const result = await convertCode(
          component.code,
          component.framework,
          options.framework
        );
        code = result.code;
      }

      // Process based on options
      if (!options.includeTypes) {
        code = removeTypeAnnotations(code);
      }

      if (!options.includeStyles) {
        code = removeStyleClasses(code);
      }

      // Export based on format
      if (options.format === 'single-file') {
        const extension = getFileExtension(options.framework);
        downloadFile(code, `${component.name}.${extension}`, 'text/plain');
      } else {
        // Component folder format
        exportAsFolder(component.name, code, options.framework);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!component) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No component available for export
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileDown className="mr-2 h-5 w-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Framework Selection */}
        <div className="space-y-2">
          <Label>Target Framework</Label>
          <Select
            value={options.framework}
            onValueChange={(value: Framework) =>
              setOptions({ ...options, framework: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select
            value={options.format}
            onValueChange={(value: 'single-file' | 'component-folder') =>
              setOptions({ ...options, format: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single-file">Single File</SelectItem>
              <SelectItem value="component-folder">Component Folder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Options Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeTypes"
              checked={options.includeTypes}
              onCheckedChange={(checked) =>
                setOptions({ ...options, includeTypes: checked as boolean })
              }
            />
            <Label htmlFor="includeTypes" className="cursor-pointer">
              Include TypeScript types
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeStyles"
              checked={options.includeStyles}
              onCheckedChange={(checked) =>
                setOptions({ ...options, includeStyles: checked as boolean })
              }
            />
            <Label htmlFor="includeStyles" className="cursor-pointer">
              Include styling classes
            </Label>
          </div>
        </div>

        {/* Export Button */}
        <Button
          className="w-full"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Component'}
        </Button>
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

function removeTypeAnnotations(code: string): string {
  // Simple removal of TypeScript type annotations
  return code
    .replace(/:\s*\w+(\[\])?/g, '')
    .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
    .replace(/<\w+>/g, '');
}

function removeStyleClasses(code: string): string {
  // Remove className attributes
  return code.replace(/className="[^"]*"/g, '');
}

function exportAsFolder(name: string, code: string, framework: Framework) {
  // For now, just export the main file
  // In a full implementation, this would create a zip with multiple files
  const extension = getFileExtension(framework);
  downloadFile(code, `${name}.${extension}`, 'text/plain');
}

export default ExportOptions;
