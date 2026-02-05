import { useState, useCallback } from 'react';
import { Framework, GeneratedComponent, UserPreferences } from '../types';
import { generateComponent, refineComponent } from '../services/codeConverter';
import { formatCode, addImports } from '../utils/codeFormatters';
import { generateId } from '../lib/utils';

interface UseCodeGenerationReturn {
  currentComponent: GeneratedComponent | null;
  isLoading: boolean;
  error: string | null;
  preferences: UserPreferences;
  generate: (prompt: string) => Promise<void>;
  refine: (feedback: string) => Promise<void>;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  setCurrentComponent: (component: GeneratedComponent | null) => void;
}

const defaultPreferences: UserPreferences = {
  framework: 'react',
  styleLibrary: 'tailwind',
  typescript: true,
  accessibility: true,
  responsive: true,
};

export function useCodeGeneration(): UseCodeGenerationReturn {
  const [currentComponent, setCurrentComponent] = useState<GeneratedComponent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  const generate = useCallback(
    async (prompt: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await generateComponent(prompt, preferences.framework, preferences);

        const formattedCode = await formatCode(result.code, preferences.framework);
        const finalizedCode = addImports(formattedCode, preferences.framework);

        const component: GeneratedComponent = {
          id: generateId(),
          code: finalizedCode,
          framework: preferences.framework,
          name: extractComponentName(finalizedCode),
          description: prompt,
          explanation: result.explanation,
          suggestions: result.suggestions,
        };

        setCurrentComponent(component);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate component');
        console.error('Generation error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [preferences]
  );

  const refine = useCallback(
    async (feedback: string) => {
      if (!currentComponent) {
        setError('No component to refine');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await refineComponent(
          currentComponent.code,
          feedback,
          currentComponent.framework
        );

        const formattedCode = await formatCode(result.code, currentComponent.framework);
        const finalizedCode = addImports(formattedCode, currentComponent.framework);

        const updatedComponent: GeneratedComponent = {
          ...currentComponent,
          code: finalizedCode,
          explanation: result.explanation,
        };

        setCurrentComponent(updatedComponent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to refine component');
        console.error('Refinement error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentComponent]
  );

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  }, []);

  return {
    currentComponent,
    isLoading,
    error,
    preferences,
    generate,
    refine,
    updatePreferences,
    setCurrentComponent,
  };
}

function extractComponentName(code: string): string {
  const patterns = [
    /export\s+(?:const|function)\s+(\w+)/,
    /function\s+(\w+)/,
    /class\s+(\w+)/,
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) return match[1];
  }

  return 'Component';
}
