"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponent = generateComponent;
exports.refineComponent = refineComponent;
exports.explainDesign = explainDesign;
const tamboIntegration_1 = require("../services/tamboIntegration");
const learningService_1 = require("../services/learningService");
async function generateComponent(prompt, framework = 'react', preferences) {
    try {
        const result = await (0, tamboIntegration_1.generateWithTambo)({
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
    }
    catch (error) {
        console.error('Controller: Generate error:', error);
        throw error;
    }
}
async function refineComponent(code, feedback, framework = 'react') {
    try {
        const result = await (0, tamboIntegration_1.refineWithTambo)({
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
    }
    catch (error) {
        console.error('Controller: Refine error:', error);
        throw error;
    }
}
async function explainDesign(code, framework = 'react') {
    try {
        const explanation = await (0, learningService_1.getDesignExplanation)(code, framework);
        return {
            success: true,
            explanation,
        };
    }
    catch (error) {
        console.error('Controller: Explain error:', error);
        throw error;
    }
}
