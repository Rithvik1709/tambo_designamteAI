# DesignMate AI 🎨✨

An intelligent design assistant where designers and developers chat about their UI needs, and Tambo generates components that evolve through conversation with multi-framework export and learning mode.

![DesignMate AI](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

- **Conversational UI Generation**: Chat naturally about what you want to build
- **Multi-Framework Support**: Export to React, Vue, Svelte, or HTML
- **Learning Mode**: Understand design patterns and best practices
- **Live Preview**: See your components in action
- **Real-time Updates**: Components evolve as you refine your requirements
- **Code Export**: Download components with customizable options
- **TypeScript Support**: Full type safety across the application
- **Tailwind CSS**: Modern, utility-first styling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for AI-powered generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tambo_designamteAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Backend (`.env` in `backend/` folder):
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env`:
   ```env
   PORT=3001
   TAMBO_API_KEY=your_tambo_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

   Frontend (`.env` in `frontend/` folder):
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   
   The defaults should work for local development.

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

   Or run them separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend

   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
tambo_designamteAI/
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── Chat/         # Chat interface components
│   │   │   ├── Preview/      # Component preview & live rendering
│   │   │   ├── CodeDisplay/  # Code viewer & export options
│   │   │   ├── Learning/     # Learning mode components
│   │   │   ├── Layout/       # Layout components
│   │   │   └── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API & WebSocket services
│   │   ├── utils/            # Utility functions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── lib/              # Helper libraries
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                    # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   │   ├── tamboIntegration.ts  # Tambo SDK integration
│   │   │   └── learningService.ts   # Learning mode logic
│   │   └── server.ts         # Express server setup
│   ├── package.json
│   └── tsconfig.json
│
├── package.json               # Root package.json (workspace)
└── README.md
```

## 🎯 Usage

### Basic Workflow

1. **Start a Conversation**: Type what you want to build in the chat
   ```
   "Create a modern login form with email and password fields"
   ```

2. **Review the Generated Component**: View the preview and code in real-time

3. **Refine Your Request**: Continue the conversation to improve the component
   ```
   "Add a forgot password link and make it more colorful"
   ```

4. **Export in Your Framework**: Switch between React, Vue, Svelte, or HTML

5. **Learn as You Build**: Enable Learning Mode to understand design patterns

### Features in Detail

#### 💬 Chat Interface
- Natural language component requests
- Conversation history
- Real-time generation status
- Component suggestions

#### 👁️ Preview & Code
- Live component preview
- Multi-framework code view
- Syntax highlighting
- One-click copy/download

#### 📚 Learning Mode
- Design pattern explanations
- Best practices
- Accessibility insights
- Performance tips

#### 🔧 Preferences
- Framework selection (React, Vue, Svelte, HTML)
- Style library preference
- TypeScript toggle
- Accessibility options
- Responsive design settings

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **Zustand**: State management (optional)
- **Socket.io Client**: Real-time communication
- **Prism.js**: Syntax highlighting

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **Socket.io**: WebSocket server
- **OpenAI API**: AI-powered generation
- **Tambo SDK**: Component generation engine

## 🔌 API Endpoints

### REST API

```
POST /api/generate
Body: { prompt, framework, preferences }
Response: { code, framework, explanation, suggestions }

POST /api/refine
Body: { code, feedback, framework }
Response: { code, changes, explanation }

POST /api/explain
Body: { code, framework }
Response: { explanation }

POST /api/convert
Body: { code, fromFramework, toFramework }
Response: { code, framework }
```

### WebSocket Events

```
Client → Server:
- generate-component: Start component generation
- update-component: Refine existing component

Server → Client:
- component-generated: New component ready
- component-updated: Component refinement complete
- generation-progress: Status updates
- generation-error: Error notifications
```

## 🎨 Customization

### Adding New Frameworks

1. Update types in `frontend/src/types/index.ts`:
   ```typescript
   export type Framework = 'react' | 'vue' | 'svelte' | 'html' | 'your-framework';
   ```

2. Add converter in `frontend/src/utils/frameworkConverters.ts`:
   ```typescript
   export function convertToYourFramework(reactCode: string): string {
     // Implementation
   }
   ```

3. Update UI components to include the new framework

### Styling Customization

Edit `frontend/tailwind.config.js` to customize colors, spacing, etc.:
```javascript
theme: {
  extend: {
    colors: {
      primary: 'your-color',
      // ...
    }
  }
}
```

## 🧪 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

### Building for Production
```bash
# Build everything
npm run build

# Or build separately
npm run build --workspace=frontend
npm run build --workspace=backend
```

### Linting
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Heroku/Digital Ocean)
```bash
cd backend
npm run build
npm start
```

### Environment Variables for Production
```env
# Backend
PORT=3001
TAMBO_API_KEY=your_production_key
OPENAI_API_KEY=your_production_key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com

# Frontend
VITE_API_URL=https://your-backend-url.com/api
VITE_SOCKET_URL=https://your-backend-url.com
```

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues & Roadmap

### Known Issues
- Live preview currently shows a placeholder (iframe rendering in development)
- Framework conversion is basic (can be enhanced)

### Roadmap
- [ ] Advanced component templates
- [ ] Team collaboration features
- [ ] Component library management
- [ ] Advanced AI customization
- [ ] Plugin system for custom converters
- [ ] Version control for components
- [ ] Cloud storage integration

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Tambo AI](https://tambo.ai) - Core generation engine
- [OpenAI](https://openai.com) - AI-powered assistance
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## 💬 Support

- **Issues**: [GitHub Issues](your-repo-url/issues)
- **Discussions**: [GitHub Discussions](your-repo-url/discussions)
- **Email**: support@designmate.ai

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ by developers, for developers**
