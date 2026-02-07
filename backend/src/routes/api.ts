import { Router, Request, Response } from 'express';
import { generateComponent, refineComponent, explainDesign } from '../controllers/tamboController';

const router = Router();

// Component generation endpoint
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, framework, preferences } = req.body;
    const result = await generateComponent(prompt, framework, preferences);
    res.json(result);
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate component' });
  }
});

// Component refinement endpoint
router.post('/refine', async (req: Request, res: Response) => {
  try {
    const { code, feedback, framework } = req.body;
    const result = await refineComponent(code, feedback, framework);
    res.json(result);
  } catch (error) {
    console.error('Refine error:', error);
    res.status(500).json({ error: 'Failed to refine component' });
  }
});

// Design explanation endpoint
router.post('/explain', async (req: Request, res: Response) => {
  try {
    const { code, framework } = req.body;
    const result = await explainDesign(code, framework);
    res.json(result);
  } catch (error) {
    console.error('Explain error:', error);
    res.status(500).json({ error: 'Failed to explain design' });
  }
});

// Framework conversion endpoint
router.post('/convert', async (req: Request, res: Response) => {
  try {
    const { code, fromFramework, toFramework } = req.body;
    
    // This will be implemented with actual conversion logic
    res.json({
      code: `// Converted from ${fromFramework} to ${toFramework}\n${code}`,
      framework: toFramework,
    });
  } catch (error) {
    console.error('Convert error:', error);
    res.status(500).json({ error: 'Failed to convert framework' });
  }
});

export default router;
