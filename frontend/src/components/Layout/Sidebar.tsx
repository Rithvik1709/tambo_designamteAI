import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, BookOpen, Download, Sparkles } from 'lucide-react';
import { Framework, UserPreferences } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SidebarProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: Partial<UserPreferences>) => void;
  learningMode: boolean;
  onLearningModeToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  preferences,
  onPreferencesChange,
  learningMode,
  onLearningModeToggle,
}) => {
  return (
    <Card className="w-64 h-full p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold">DesignMate AI</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Label>
        </div>

        {/* Framework Selection */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Framework</Label>
          <Select
            value={preferences.framework}
            onValueChange={(value: Framework) =>
              onPreferencesChange({ framework: value })
            }
          >
            <SelectTrigger className="w-full">
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

        {/* Style Library */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Styling</Label>
          <Select
            value={preferences.styleLibrary}
            onValueChange={(value: 'tailwind' | 'css' | 'styled-components') =>
              onPreferencesChange({ styleLibrary: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tailwind">Tailwind CSS</SelectItem>
              <SelectItem value="css">Plain CSS</SelectItem>
              <SelectItem value="styled-components">Styled Components</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t space-y-2">
        <Button
          variant={learningMode ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={onLearningModeToggle}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Learning Mode
        </Button>
      </div>

      <div className="pt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Options:</p>
          <ul className="space-y-1 ml-2">
            <li>✓ TypeScript: {preferences.typescript ? 'On' : 'Off'}</li>
            <li>✓ Accessibility: {preferences.accessibility ? 'On' : 'Off'}</li>
            <li>✓ Responsive: {preferences.responsive ? 'On' : 'Off'}</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
