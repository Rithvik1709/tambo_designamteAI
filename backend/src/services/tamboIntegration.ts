import OpenAI from 'openai';

// Initialize Tambo SDK or OpenAI as fallback
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface GenerateParams {
  prompt: string;
  framework: string;
  preferences?: any;
}

interface RefineParams {
  code: string;
  feedback: string;
  framework: string;
}

interface GeneratedResponse {
  code: string;
  explanation: string;
  suggestions: string[];
}

export async function generateWithTambo(params: GenerateParams) {
  try {
    const { prompt, framework, preferences } = params;

    // System prompt for component generation
    const systemPrompt = `You are an expert UI/UX developer specializing in ${framework}.
  Return STRICT JSON only. Do not include Markdown or code fences.
  The JSON schema must be:
  {
    "code": string, // complete, production-ready component code
    "explanation": string, // brief design decisions
    "suggestions": string[] // 2-5 improvement ideas
  }
  Requirements:
  - Use Tailwind CSS for styling.
  - Include proper TypeScript types.
  - Include accessibility best practices.
  - Ensure the component is exported.
  - Use React for react framework and include the React import if needed.`;

    const userPrompt = `Generate a ${framework} component based on this requirement:

  ${prompt}

  ${preferences ? `User preferences: ${JSON.stringify(preferences, null, 2)}` : ''}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '';
    const parsed = safeParseGenerated(content);
    const sanitizedCode = sanitizeGeneratedCode(parsed.code, framework);

    return {
      code: sanitizedCode,
      framework,
      explanation: parsed.explanation,
      suggestions: parsed.suggestions,
    };
  } catch (error) {
    console.error('Tambo generation error:', error);
    
    // Fallback response
    return {
      code: generateFallbackComponent(params.framework, params.prompt),
      framework: params.framework,
      explanation: 'Generated a basic component structure. Please refine as needed.',
      suggestions: ['Add more interactivity', 'Enhance styling', 'Add props validation'],
    };
  }
}

export async function refineWithTambo(params: RefineParams) {
  try {
    const { code, feedback, framework } = params;

    const systemPrompt = `You are an expert code reviewer and ${framework} developer.
Return STRICT JSON only. Do not include Markdown or code fences.
The JSON schema must be:
{
  "code": string, // refined component code
  "explanation": string // brief summary of changes
}
Requirements:
- Maintain TypeScript types and accessibility best practices.
- Ensure the component is exported.
- Use Tailwind CSS for styling.`;

    const userPrompt = `Here's the current component code:

  ${code}

  User feedback: ${feedback}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '';
    const parsed = safeParseGenerated(content, false);
    const sanitizedCode = sanitizeGeneratedCode(parsed.code, framework);

    return {
      code: sanitizedCode,
      changes: ['Applied user feedback', 'Improved code structure'],
      explanation: parsed.explanation,
    };
  } catch (error) {
    console.error('Tambo refinement error:', error);
    return {
      code: params.code,
      changes: ['No changes applied due to error'],
      explanation: 'Unable to refine at this time.',
    };
  }
}

function generateFallbackComponent(framework: string, prompt: string): string {
  const componentName = 'GeneratedComponent';
  
  if (framework === 'react') {
    return `import React from 'react';

interface ${componentName}Props {
  // Add your props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">Generated Component</h2>
      <p className="text-gray-600">
        Component for: ${prompt.slice(0, 50)}...
      </p>
    </div>
  );
};`;
  }
  
  return `// ${framework} component\n// ${prompt}`;
}

function safeParseGenerated(content: string, includeSuggestions: boolean = true): GeneratedResponse {
  try {
    const parsed = JSON.parse(content) as Partial<GeneratedResponse>;
    return {
      code: typeof parsed.code === 'string' ? parsed.code : content,
      explanation: typeof parsed.explanation === 'string' ? parsed.explanation : '',
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.filter((item) => typeof item === 'string')
        : includeSuggestions
        ? ['Add loading states', 'Implement error boundaries', 'Add unit tests']
        : [],
    };
  } catch {
    const code = stripCodeFences(content);
    return {
      code,
      explanation: content,
      suggestions: includeSuggestions
        ? ['Add loading states', 'Implement error boundaries', 'Add unit tests']
        : [],
    };
  }
}

function stripCodeFences(content: string): string {
  const codeMatch = content.match(/```(?:tsx|jsx|typescript|javascript)?\n([\s\S]*?)```/);
  return codeMatch ? codeMatch[1].trim() : content.trim();
}

function sanitizeGeneratedCode(code: string, framework: string): string {
  let sanitized = stripCodeFences(code);

  if (framework === 'react') {
    if (!/from\s+['\"]react['\"]/i.test(sanitized)) {
      sanitized = `import React from 'react';\n\n${sanitized}`;
    }

    if (!/export\s+(default|const|function|class)\s+/m.test(sanitized)) {
      const constMatch = sanitized.match(/const\s+(\w+)\s*=\s*\(/);
      if (constMatch) {
        sanitized = sanitized.replace(/const\s+(\w+)\s*=\s*\(/, 'export const $1 = (');
      } else {
        const fnMatch = sanitized.match(/function\s+(\w+)\s*\(/);
        if (fnMatch) {
          sanitized = sanitized.replace(/function\s+(\w+)\s*\(/, 'export function $1(');
        }
      }
    }
  }

  return sanitized.trim();
}
