"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDesignExplanation = getDesignExplanation;
exports.generateLearningInsights = generateLearningInsights;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || '',
});
async function getDesignExplanation(code, framework) {
    try {
        const prompt = `Analyze this ${framework} component and provide a detailed explanation for learning purposes:

\`\`\`${framework}
${code}
\`\`\`

Explain:
1. Component structure and architecture
2. Design patterns used
3. Styling approach and best practices
4. Accessibility features
5. Performance considerations
6. Potential improvements

Format as JSON with these sections: structure, patterns, styling, accessibility, performance, improvements`;
        const response = await client.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert educator in web development and UI design. Provide clear, educational explanations.',
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1500,
        });
        const content = response.choices[0]?.message?.content || '';
        // Try to parse as JSON, otherwise return structured text
        try {
            return JSON.parse(content);
        }
        catch {
            return {
                structure: 'Component uses modern patterns',
                patterns: 'Follows React best practices',
                styling: 'Uses Tailwind CSS utilities',
                accessibility: 'Includes basic accessibility features',
                performance: 'Optimized for performance',
                improvements: 'Consider adding more features',
                fullExplanation: content,
            };
        }
    }
    catch (error) {
        console.error('Learning service error:', error);
        return {
            structure: 'Unable to analyze structure',
            patterns: 'Analysis unavailable',
            styling: 'Styling analysis unavailable',
            accessibility: 'Accessibility check unavailable',
            performance: 'Performance analysis unavailable',
            improvements: 'Suggestions unavailable',
        };
    }
}
function generateLearningInsights(code, framework) {
    return {
        concepts: [
            'Component composition',
            'Props and state management',
            'Event handling',
            'Styling with Tailwind',
        ],
        bestPractices: [
            'Use TypeScript for type safety',
            'Follow naming conventions',
            'Keep components small and focused',
            'Implement proper error handling',
        ],
        resources: [
            {
                title: `${framework} Documentation`,
                url: `https://react.dev`,
            },
            {
                title: 'Tailwind CSS',
                url: 'https://tailwindcss.com',
            },
        ],
    };
}
