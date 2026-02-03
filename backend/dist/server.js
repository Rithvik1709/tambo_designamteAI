"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api', api_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('generate-component', async (data) => {
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
        }
        catch (error) {
            console.error('Generation error:', error);
            socket.emit('generation-error', { message: 'Failed to generate component' });
        }
    });
    socket.on('update-component', async (data) => {
        try {
            console.log('Updating component:', data);
            socket.emit('component-updated', {
                code: data.updatedCode || '// Updated component code',
                framework: data.framework || 'react',
            });
        }
        catch (error) {
            console.error('Update error:', error);
            socket.emit('update-error', { message: 'Failed to update component' });
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Error handling
app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
});
