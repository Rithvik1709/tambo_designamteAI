import { Framework, ConversionResponse } from '../types';
import { convertFramework } from '../utils/frameworkConverters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function convertCode(
  code: string,
  fromFramework: Framework,
  toFramework: Framework
): Promise<ConversionResponse> {
  try {
    // Try server-side conversion first
    const response = await fetch(`${API_URL}/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        fromFramework,
        toFramework,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    // Fallback to client-side conversion
    return {
      code: convertFramework(code, fromFramework, toFramework),
      framework: toFramework,
    };
  } catch (error) {
    console.error('Conversion error:', error);
    
    // Use client-side conversion as fallback
    return {
      code: convertFramework(code, fromFramework, toFramework),
      framework: toFramework,
    };
  }
}

export async function explainCode(code: string, framework: Framework) {
  try {
    const response = await fetch(`${API_URL}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        framework,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get explanation');
    }

    const data = await response.json();
    return data.explanation;
  } catch (error) {
    console.error('Explanation error:', error);
    return null;
  }
}

export async function generateComponent(
  prompt: string,
  framework: Framework,
  preferences?: any
) {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        framework,
        preferences,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate component');
    }

    return await response.json();
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
}

export async function refineComponent(
  code: string,
  feedback: string,
  framework: Framework
) {
  try {
    const response = await fetch(`${API_URL}/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        feedback,
        framework,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refine component');
    }

    return await response.json();
  } catch (error) {
    console.error('Refinement error:', error);
    throw error;
  }
}
