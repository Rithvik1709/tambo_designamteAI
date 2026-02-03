import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import apiRoutes from './routes/api';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('generate-component', async (data: any) => {
    try {
      console.log('Generating component:', data);
      
      // Emit progress updates
      socket.emit('generation-progress', { status: 'processing', message: 'Analyzing requirements...' });
      
      // Simulate component generation (replace with actual Tambo integration)
      setTimeout(() => {
        socket.emit('generation-progress', { status: 'generating', message: 'Creating component...' });
      }, 1000);

      setTimeout(() => {
        socket.emit('component-generated', {
          code: data.mockCode || '// Component code will be generated here',
          framework: data.framework || 'react',
          explanation: 'Component generated successfully',
        });
      }, 2000);
    } catch (error) {
      console.error('Generation error:', error);
      socket.emit('generation-error', { message: 'Failed to generate component' });
    }
  });

  socket.on('update-component', async (data: any) => {
    try {
      console.log('Updating component:', data);
      socket.emit('component-updated', {
        code: data.updatedCode || '// Updated component code',
        framework: data.framework || 'react',
      });
    } catch (error) {
      console.error('Update error:', error);
      socket.emit('update-error', { message: 'Failed to update component' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});

export { io };
