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

Choose one of the following setup methods:

**Option A: Docker (Recommended)**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- Git

**Option B: Manual Setup**
- Node.js 18+
- MongoDB 4.4+
- Git

---

### Option 1: Docker Setup (Recommended)

The easiest way to get started. Docker will automatically set up MongoDB, backend server, and frontend client.

1. **Install Docker Desktop**
   
   Download and install for your platform:
   - [Mac](https://docs.docker.com/desktop/install/mac-install/)
   - [Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [Linux](https://docs.docker.com/engine/install/)

2. **Clone the repository**

   ```bash
   git clone https://github.com/TejasS1233/TAIL.ai.git
   cd TAIL.ai
````

3. **Configure environment variables**

   ```bash
   # Server configuration
   cd server
   cp .env.example .env
   nano .env  # or use any text editor
   ```

   **Required:** Update these values in `server/.env`:

   ```bash
   # JWT Secret - Generate with: openssl rand -base64 32
   JWT_SECRET=your-secure-random-string-here

   # Razorpay Payment Gateway (get from https://razorpay.com)
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
   ```

   **Optional:** Add AI service API keys based on features you need:

   ```bash
   OPENAI_API_KEY=sk-proj-your-key-here
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   COHERE_API_KEY=your-key-here
   ```

   ```bash
   # Client configuration (optional - defaults work for Docker)
   cd ../client
   cp .env.example .env
   cd ..
   ```

4. **Start all services**

   ```bash
   docker-compose up -d --build
   ```

   This command will:

   * Build Docker images for client and server
   * Pull MongoDB 6.0 image
   * Start all three containers
   * Set up networking between services

5. **Verify services are running**

   ```bash
   docker-compose ps
   ```

   You should see three services with "Up" status:

   * `tailai-mongodb` (port 27017)
   * `tailai-server` (port 8000)
   * `tailai-client` (port 3000)

6. **Access the application**

   * **Frontend**: [http://localhost:3000](http://localhost:3000)
   * **Backend API**: [http://localhost:8000](http://localhost:8000)
   * **MongoDB**: localhost:27017 (for database tools)

7. **View logs** (optional)

   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f server
   docker-compose logs -f client
   docker-compose logs -f mongodb
   ```

8. **Stop services**

   ```bash
   # Stop containers (preserves data)
   docker-compose stop

   # Stop and remove containers (preserves images)
   docker-compose down

   # Stop and remove everything including volumes (⚠️ deletes database data)
   docker-compose down --volumes
   ```

---

### Option 2: Manual Setup

If you prefer to run services locally without Docker:

1. **Install MongoDB**

   * [MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
   * Start MongoDB: `mongod` or `brew services start mongodb-community` (Mac)

2. **Clone the repository**

   ```bash
   git clone https://github.com/TejasS1233/TAIL.ai.git
   cd TAIL.ai
   ```

3. **Setup Backend**

   ```bash
   cd server
   npm install
   cp .env.example .env
   nano .env  # Edit configuration (use localhost for MongoDB)
   ```

   Update `MONGODB_URI` for local setup:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/agentic-ai-lab
   ```

   ```bash
   npm run dev
   ```

4. **Setup Frontend** (in a new terminal)

   ```bash
   cd client
   npm install
   cp .env.example .env
   npm run dev
   ```

5. **Access the application**

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend: [http://localhost:8000](http://localhost:8000)

---

## Configuration

### Environment Variables

#### Server Configuration (`server/.env`)

**Required Variables:**

```bash
# Database (use 'mongodb' for Docker, 'localhost' for manual setup)
MONGODB_URI=mongodb://mongodb:27017/agentic-ai-lab
DB_NAME=agentic-ai-lab

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=8000
NODE_ENV=development

# Frontend URL
CLIENT_URL=http://localhost:3000

# Payment Gateway (Required)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

**Optional AI Service Keys:**

```bash
# LLM Providers
OPENAI_API_KEY=sk-proj-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
COHERE_API_KEY=your-cohere-key

# Vector Database
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=us-east-1-aws

# Communication Services
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

See `server/.env.example` for complete documentation.

#### Client Configuration (`client/.env`)

```bash
# Backend URLs (defaults work for Docker setup)
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
VITE_FLASK_API_URL=http://localhost:5000

# Application Settings
VITE_APP_NAME=TAIL.AI
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

---

## Architecture

### Technology Stack

**Frontend:**

* React 19 with TypeScript
* Vite build tool
* Tailwind CSS + shadcn/ui components
* Framer Motion animations
* WebSocket for real-time features

**Backend:**

* Node.js + Express
* MongoDB with Mongoose ODM
* JWT authentication
* Multi-provider AI integrations
* RESTful API architecture

**Infrastructure:**

* Docker containerization
* Docker Compose orchestration
* MongoDB 6.0 database
* Nginx-ready for production

### Docker Architecture

```
┌─────────────────────────────────────────────┐
│         Docker Network (tailai-network)      │
│                                              │
│  ┌──────────────┐  ┌──────────────┐        │
│  │   Client     │  │   Server     │        │
│  │  (React)     │  │  (Node.js)   │        │
│  │  Port: 3000  │  │  Port: 8000  │        │
│  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                 │
│         └──────────┬───────┘                 │
│                    │                         │
│              ┌─────▼──────┐                 │
│              │  MongoDB   │                 │
│              │ Port: 27017│                 │
│              └────────────┘                 │
└─────────────────────────────────────────────┘
```

---

## Core Components

### Agent Types

* **Retrieval Agent**: RAG pipelines with vector databases
* **Reasoning Agent**: Chain-of-thought orchestration
* **Planner Agent**: Hierarchical task decomposition
* **Tool-Using Agent**: External API integrations
* **Multi-Agent Orchestrator**: Coordinated agent workflows
* **Autonomous Agent**: Goal-driven continuous execution
* **Creative Agent**: Content generation with novelty scoring
* **Safety Agent**: Content moderation and risk assessment

### Integrations

* **LLM Providers**: OpenAI, Anthropic, Cohere, HuggingFace, Ollama
* **Vector Databases**: Pinecone, Chroma, FAISS
* **Tools**: Web search, calculators, code execution, file processing
* **Memory Systems**: Conversation buffers, summaries, vector storage

---

## Development

### Project Structure

```
TAIL.ai/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/          # Application pages
│   │   ├── components/     # Reusable components
│   │   └── utils/          # Helper functions
│   ├── Dockerfile          # Client container configuration
│   ├── .dockerignore       # Docker build exclusions
│   └── .env.example        # Environment template
├── server/                  # Node.js backend
│   ├── routes/             # API endpoints
│   ├── models/             # Database schemas
│   ├── middleware/         # Express middleware
│   ├── Dockerfile          # Server container configuration
│   ├── .dockerignore       # Docker build exclusions
│   └── .env.example        # Environment template
├── docker-compose.yml       # Multi-container orchestration
├── .gitignore              # Git exclusions
└── README.md               # This file
```

---

### Available Commands

#### Docker Commands

```bash
# Start all services in background
docker-compose up -d

# Start with rebuild (after code changes)
docker-compose up -d --build

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f mongodb

# Check service status
docker-compose ps

# Stop services (keep containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Restart specific service
docker-compose restart server

# Execute commands in running container
docker-compose exec server npm install new-package
docker-compose exec mongodb mongosh

# Remove everything including volumes (⚠️ deletes data)
docker-compose down --volumes --remove-orphans
```

#### Frontend Scripts

```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend Scripts

```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm run test         # Run test suite
```

---

### Making Code Changes

When developing with Docker:

1. **Code changes are automatically reflected** — volumes are mounted for hot-reload
2. **After changing dependencies** (package.json):

   ```bash
   docker-compose down
   docker-compose up -d --build
   ```
3. **After changing Dockerfile or docker-compose.yml**:

   ```bash
   docker-compose up -d --build
   ```

---

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the ports
sudo lsof -i :3000  # Frontend
sudo lsof -i :8000  # Backend  
sudo lsof -i :27017 # MongoDB

# Kill the process
sudo kill -9 <PID>

# Or stop Docker services properly
docker-compose down
```

### MongoDB Connection Issues

**Docker Setup:**

* Ensure `MONGODB_URI=mongodb://mongodb:27017/...` (use service name, not localhost)
* Wait for MongoDB to be healthy: `docker-compose ps`

**Manual Setup:**

* Ensure `MONGODB_URI=mongodb://localhost:27017/...`
* Verify MongoDB is running: `mongod --version`

### Container Won't Start

```bash
# View detailed logs
docker-compose logs server
docker-compose logs client

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### Disk Space Issues

```bash
# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a

# Remove all stopped containers, networks, and volumes
docker-compose down --volumes --remove-orphans
docker system prune -a --volumes
```

### Reset Everything

```bash
# Stop and remove all containers, networks, volumes
docker-compose down --volumes --remove-orphans

# Remove all Docker images
docker system prune -a --volumes

# Rebuild from scratch
docker-compose up -d --build
```

### Common Issues

**Issue:** "Cannot find module" errors
**Solution:** Rebuild containers after changing dependencies

```bash
docker-compose up -d --build
```

**Issue:** Changes not reflecting in browser
**Solution:**

* Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
* Check if volumes are properly mounted in `docker-compose.yml`

**Issue:** MongoDB data loss after restart
**Solution:** Ensure volumes are defined in `docker-compose.yml` (they are by default)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

* Follow existing code style and conventions
* Write meaningful commit messages
* Add tests for new features
* Update documentation as needed
* Test Docker setup before submitting PR

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Support

* 📧 Email: [tsss1552@gmail.com](mailto:tsss1552@gmail.com)
* 🐛 Issues: [GitHub Issues](https://github.com/TejasS1233/TAIL.ai/issues)
* 📖 Documentation: [Wiki](https://github.com/TejasS1233/TAIL.ai/wiki)

---

**Built with ❤️ by the TAIL.ai Team**



