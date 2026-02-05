import { Framework } from '../types';

// Simple code formatting without prettier to avoid import issues
export async function formatCode(code: string, framework: Framework): Promise<string> {
  try {
    // Minimal normalization to avoid breaking generated code
    const normalized = code.replace(/\r\n/g, '\n');
    const trimmedLines = normalized
      .split('\n')
      .map((line) => line.replace(/\s+$/g, ''))
      .join('\n');
    return trimmedLines.trimEnd();
  } catch (error) {
    console.error('Format error:', error);
    return code; // Return original code if formatting fails
  }
}

export function extractComponentName(code: string): string {
  // Try to extract component name from code
  const patterns = [
    /export\s+(?:const|function)\s+(\w+)/,
    /function\s+(\w+)/,
    /class\s+(\w+)/,
    /const\s+(\w+)\s*=/,
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match) return match[1];
  }

  return 'Component';
}

export function addImports(code: string, framework: Framework): string {
  if (framework === 'react' && !code.includes('import React')) {
    return `import React from 'react';\n\n${code}`;
  }
  return code;
}

export function wrapInFragment(code: string): string {
  return `<>\n${code}\n</>`;
}
