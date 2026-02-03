import { useEffect, useState, useCallback } from 'react';
import { tamboService } from '../services/tamboService';
import {
  GenerationRequest,
  RefinementRequest,
  GeneratedComponent,
  ProgressUpdate,
} from '../types';

interface UseTamboReturn {
  isConnected: boolean;
  isGenerating: boolean;
  progress: ProgressUpdate | null;
  error: string | null;
  generateComponent: (request: GenerationRequest) => void;
  updateComponent: (request: RefinementRequest) => void;
}

export function useTambo(
  onComponentGenerated?: (component: GeneratedComponent) => void,
  onComponentUpdated?: (component: GeneratedComponent) => void
): UseTamboReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to Tambo service
    tamboService.connect();

    // Set up event listeners
    const handleConnection = (data: any) => {
      setIsConnected(data.status === 'connected');
    };

    const handleGenerated = (component: GeneratedComponent) => {
      setIsGenerating(false);
      setProgress(null);
      setError(null);
      onComponentGenerated?.(component);
    };

    const handleUpdated = (component: GeneratedComponent) => {
      setIsGenerating(false);
      setProgress(null);
      setError(null);
      onComponentUpdated?.(component);
    };

    const handleProgress = (update: ProgressUpdate) => {
      setProgress(update);
      setIsGenerating(true);
    };

    const handleError = (errorData: { message: string }) => {
      setError(errorData.message);
      setIsGenerating(false);
      setProgress(null);
    };

    tamboService.on('connection', handleConnection);
    tamboService.on('component-generated', handleGenerated);
    tamboService.on('component-updated', handleUpdated);
    tamboService.on('generation-progress', handleProgress);
    tamboService.on('generation-error', handleError);

    return () => {
      tamboService.off('connection', handleConnection);
      tamboService.off('component-generated', handleGenerated);
      tamboService.off('component-updated', handleUpdated);
      tamboService.off('generation-progress', handleProgress);
      tamboService.off('generation-error', handleError);
    };
  }, [onComponentGenerated, onComponentUpdated]);

  const generateComponent = useCallback((request: GenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    setProgress({ status: 'processing', message: 'Starting generation...' });
    tamboService.generateComponent(request);
  }, []);

  const updateComponent = useCallback((request: RefinementRequest) => {
    setIsGenerating(true);
    setError(null);
    setProgress({ status: 'processing', message: 'Updating component...' });
    tamboService.updateComponent(request);
  }, []);

  return {
    isConnected,
    isGenerating,
    progress,
    error,
    generateComponent,
    updateComponent,
  };
}
