# TAIL.ai

**The AI Lab** - Build, Test & Deploy AI Agents Visually

## Overview

TAIL.ai is a comprehensive platform for building, testing, and deploying AI agents through an intuitive visual interface. Create sophisticated workflows without coding, from simple chatbots to complex multi-agent systems.

## Features

### 🧠 Agent Catalog

- 8 core agent types with live demos
- 60+ AI components and integrations
- Pre-built agents marketplace
- Technical deep-dives and documentation

### ⚡ Workflow Composer

- Drag & drop visual workflow builder
- LangGraph-compatible workflows
- Real-time node configuration
- Template library with working examples

### 🚀 Live Playground

- Execute workflows in real-time
- Performance metrics and cost tracking
- Live execution logs and debugging
- Multi-model support (OpenAI, Anthropic, Cohere)

### 📖 Story Mode

- Cinematic narratives of AI solutions
- Interactive chapter-based learning
- Real-world use case demonstrations
- Technical implementation guides

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TejasS1233/TAIL.ai.git
   cd TAIL.ai
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Architecture

### Frontend (React + Vite)

- Modern React 19 with TypeScript support
- Tailwind CSS + shadcn/ui components
- Framer Motion animations
- Real-time WebSocket connections

### Backend (Node.js + Express)

- RESTful API with JWT authentication
- MongoDB with Mongoose ODM
- Real-time workflow execution
- Multi-provider AI integrations

## Core Components

### Agent Types

- **Retrieval Agent**: RAG pipelines with vector databases
- **Reasoning Agent**: Chain-of-thought orchestration
- **Planner Agent**: Hierarchical task decomposition
- **Tool-Using Agent**: External API integrations
- **Multi-Agent Orchestrator**: Coordinated agent workflows
- **Autonomous Agent**: Goal-driven continuous execution
- **Creative Agent**: Content generation with novelty scoring
- **Safety Agent**: Content moderation and risk assessment

### Integrations

- **LLM Providers**: OpenAI, Anthropic, Cohere, HuggingFace, Ollama
- **Vector Databases**: Pinecone, Chroma, FAISS
- **Tools**: Web search, calculators, code execution, file processing
- **Memory Systems**: Conversation buffers, summaries, vector storage

## Development

### Project Structure

```
TAIL.ai/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Main application pages
│   │   ├── components/ # Reusable UI components
│   │   └── utils/   # Utilities and helpers
├── server/          # Node.js backend
│   ├── routes/      # API route handlers
│   ├── models/      # Database models
│   └── middleware/  # Express middleware
└── docs/           # Documentation
```

### Available Scripts

**Frontend**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend**

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: tsss1552@gmai.com

- 🐛 Issues: [GitHub Issues](https://github.com/TejasS1233/TAIL.ai/issues)

---
