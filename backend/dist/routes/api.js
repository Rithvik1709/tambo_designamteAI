"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tamboController_1 = require("../controllers/tamboController");
const router = (0, express_1.Router)();
// Component generation endpoint
router.post('/generate', async (req, res) => {
    try {
        const { prompt, framework, preferences } = req.body;
        const result = await (0, tamboController_1.generateComponent)(prompt, framework, preferences);
        res.json(result);
    }
    catch (error) {
        console.error('Generate error:', error);
        res.status(500).json({ error: 'Failed to generate component' });
    }
});
// Component refinement endpoint
router.post('/refine', async (req, res) => {
    try {
        const { code, feedback, framework } = req.body;
        const result = await (0, tamboController_1.refineComponent)(code, feedback, framework);
        res.json(result);
    }
    catch (error) {
        console.error('Refine error:', error);
        res.status(500).json({ error: 'Failed to refine component' });
    }
});
// Design explanation endpoint
router.post('/explain', async (req, res) => {
    try {
        const { code, framework } = req.body;
        const result = await (0, tamboController_1.explainDesign)(code, framework);
        res.json(result);
    }
    catch (error) {
        console.error('Explain error:', error);
        res.status(500).json({ error: 'Failed to explain design' });
    }
});
// Framework conversion endpoint
router.post('/convert', async (req, res) => {
    try {
        const { code, fromFramework, toFramework } = req.body;
        // This will be implemented with actual conversion logic
        res.json({
            code: `// Converted from ${fromFramework} to ${toFramework}\n${code}`,
            framework: toFramework,
        });
    }
    catch (error) {
        console.error('Convert error:', error);
        res.status(500).json({ error: 'Failed to convert framework' });
    }
});
exports.default = router;
