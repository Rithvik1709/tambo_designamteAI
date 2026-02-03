# Quick Start Guide 🚀

Get DesignMate AI up and running in 5 minutes!

## Prerequisites Check

Before you begin, make sure you have:
- ✅ Node.js 18 or higher (`node --version`)
- ✅ npm or yarn
- ✅ An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation Steps

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd tambo_designamteAI

# Install all dependencies
npm install
```

### 2. Configure Environment (1 minute)

**Backend Configuration:**
```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit with your favorite editor
nano backend/.env
```

Add your API keys:
```env
PORT=3001
OPENAI_API_KEY=sk-your-openai-key-here
NODE_ENV=development
```

**Frontend Configuration:**
```bash
# Copy the example file
cp frontend/.env.example frontend/.env
```

The defaults are fine for local development.

### 3. Start the App (1 minute)

```bash
# Start both frontend and backend
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📡 WebSocket server ready
```

And in another terminal output:
```
VITE ready in XXX ms
➜ Local: http://localhost:3000
```

### 4. Open & Test (1 minute)

1. Open your browser to `http://localhost:3000`
2. You should see the DesignMate AI interface
3. Try asking: "Create a modern button component"
4. Watch as it generates the component in real-time!

## Quick Troubleshooting

### Port Already in Use?

If port 3000 or 3001 is already in use:

```bash
# Change backend port in backend/.env
PORT=3002

# Update frontend/.env to match
VITE_API_URL=http://localhost:3002/api
VITE_SOCKET_URL=http://localhost:3002
```

### Dependencies Issues?

```bash
# Clear and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json frontend/package-lock.json backend/package-lock.json
npm install
```

### API Key Not Working?

Make sure:
- ✅ Your OpenAI API key is valid
- ✅ You have credits in your OpenAI account
- ✅ The `.env` file is in the `backend/` folder
- ✅ You restarted the backend after adding the key

## Next Steps

Now that you're up and running:

1. **Explore Features**: Try different component requests
2. **Switch Frameworks**: Export to Vue, Svelte, or HTML
3. **Enable Learning Mode**: Learn design patterns as you build
4. **Customize Preferences**: Adjust settings in the sidebar

## Getting Help

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](../../issues)
- 💬 [Join Discussions](../../discussions)

---

**Happy Building! 🎨✨**
