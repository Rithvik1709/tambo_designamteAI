import { generateWithTambo, refineWithTambo } from '../services/tamboIntegration';
import { getDesignExplanation } from '../services/learningService';

export async function generateComponent(
  prompt: string,
  framework: string = 'react',
  preferences?: any
) {
  try {
    const result = await generateWithTambo({
      prompt,
      framework,
      preferences,
    });

    return {
      success: true,
      code: result.code,
      framework: result.framework,
      explanation: result.explanation,
      suggestions: result.suggestions,
    };
  } catch (error) {
    console.error('Controller: Generate error:', error);
    throw error;
  }
}

export async function refineComponent(
  code: string,
  feedback: string,
  framework: string = 'react'
) {
  try {
    const result = await refineWithTambo({
      code,
      feedback,
      framework,
    });

    return {
      success: true,
      code: result.code,
      changes: result.changes,
      explanation: result.explanation,
    };
  } catch (error) {
    console.error('Controller: Refine error:', error);
    throw error;
  }
}

export async function explainDesign(code: string, framework: string = 'react') {
  try {
    const explanation = await getDesignExplanation(code, framework);

    return {
      success: true,
      explanation,
    };
  } catch (error) {
    console.error('Controller: Explain error:', error);
    throw error;
  }
}
