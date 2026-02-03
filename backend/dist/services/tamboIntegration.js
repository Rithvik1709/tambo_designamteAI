"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWithTambo = generateWithTambo;
exports.refineWithTambo = refineWithTambo;
const openai_1 = __importDefault(require("openai"));
// Initialize Tambo SDK or OpenAI as fallback
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
async function generateWithTambo(params) {
    try {
        const { prompt, framework, preferences } = params;
        // System prompt for component generation
        const systemPrompt = `You are an expert UI/UX developer specializing in ${framework}. 
Generate clean, production-ready components with best practices.
Include proper TypeScript types, accessibility features, and responsive design.
Use Tailwind CSS for styling.`;
        const userPrompt = `Generate a ${framework} component based on this requirement:

${prompt}

${preferences ? `User preferences: ${JSON.stringify(preferences, null, 2)}` : ''}

Provide:
1. Complete component code
2. Brief explanation of the design decisions
3. Suggestions for improvements or variations`;
        const response = await client.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });
        const content = response.choices[0]?.message?.content || '';
        // Parse the response to extract code and explanation
        const codeMatch = content.match(/```(?:tsx|jsx|typescript|javascript)?\n([\s\S]*?)```/);
        const code = codeMatch ? codeMatch[1].trim() : content;
        return {
            code,
            framework,
            explanation: content,
            suggestions: [
                'Add loading states',
                'Implement error boundaries',
                'Add unit tests',
            ],
        };
    }
    catch (error) {
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
async function refineWithTambo(params) {
    try {
        const { code, feedback, framework } = params;
        const systemPrompt = `You are an expert code reviewer and ${framework} developer.
Refine the component based on user feedback while maintaining code quality and best practices.`;
        const userPrompt = `Here's the current component code:

\`\`\`${framework}
${code}
\`\`\`

User feedback: ${feedback}

Please refine the component and explain the changes made.`;
        const response = await client.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });
        const content = response.choices[0]?.message?.content || '';
        const codeMatch = content.match(/```(?:tsx|jsx|typescript|javascript)?\n([\s\S]*?)```/);
        const refinedCode = codeMatch ? codeMatch[1].trim() : code;
        return {
            code: refinedCode,
            changes: ['Applied user feedback', 'Improved code structure'],
            explanation: content,
        };
    }
    catch (error) {
        console.error('Tambo refinement error:', error);
        return {
            code: params.code,
            changes: ['No changes applied due to error'],
            explanation: 'Unable to refine at this time.',
        };
    }
}
function generateFallbackComponent(framework, prompt) {
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
