// Message types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  component?: GeneratedComponent;
}

// Component generation types
export interface GeneratedComponent {
  id: string;
  code: string;
  framework: Framework;
  name: string;
  description?: string;
  explanation?: string;
  suggestions?: string[];
  previewUrl?: string;
}

export type Framework = 'react' | 'vue' | 'svelte' | 'html';

// Chat state types
export interface ChatState {
  messages: Message[];
  isGenerating: boolean;
  currentComponent: GeneratedComponent | null;
  learningMode: boolean;
}

// User preferences
export interface UserPreferences {
  framework: Framework;
  styleLibrary: 'tailwind' | 'css' | 'styled-components';
  typescript: boolean;
  accessibility: boolean;
  responsive: boolean;
}

// Code generation request
export interface GenerationRequest {
  prompt: string;
  framework: Framework;
  preferences?: Partial<UserPreferences>;
  contextMessages?: Message[];
}

// Code refinement request
export interface RefinementRequest {
  componentId: string;
  code: string;
  feedback: string;
  framework: Framework;
}

// Export options
export interface ExportOptions {
  framework: Framework;
  includeTypes: boolean;
  includeStyles: boolean;
  format: 'single-file' | 'component-folder';
}

// Learning content
export interface LearningContent {
  title: string;
  sections: LearningSection[];
}

export interface LearningSection {
  heading: string;
  content: string;
  code?: string;
  points?: string[];
}

// Design explanation
export interface DesignExplanation {
  structure: string;
  patterns: string;
  styling: string;
  accessibility: string;
  performance: string;
  improvements: string;
  fullExplanation?: string;
}

// WebSocket events
export interface SocketEvents {
  'generate-component': GenerationRequest;
  'update-component': RefinementRequest;
  'component-generated': GeneratedComponent;
  'component-updated': GeneratedComponent;
  'generation-progress': ProgressUpdate;
  'generation-error': ErrorEvent;
}

export interface ProgressUpdate {
  status: 'processing' | 'generating' | 'complete';
  message: string;
  progress?: number;
}

export interface ErrorEvent {
  message: string;
  code?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GenerateResponse {
  code: string;
  framework: Framework;
  explanation: string;
  suggestions: string[];
}

export interface ConversionResponse {
  code: string;
  framework: Framework;
}
