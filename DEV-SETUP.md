# Developer setup and next steps

This file documents how to run the project locally, the ML microservice, and how to integrate OPSWAT (MetaDefender) for file scanning.

## Prerequisites
- Node.js (recommended 22.12+ or 20.19+)
- npm
- Python 3.10+ (optional: Poetry)
- Docker & docker-compose (recommended for full-stack local runs)

## Run backend (Node)

1. Install server deps:

```powershell
cd server
npm ci
```

2. Create a `.env` file (or edit `server/.env`) with at least:

```
PORT=8002
MONGODB_URI=mongodb://localhost:27017/agentic-ai-lab
JWT_SECRET=dev-secret
RAZORPAY_KEY_ID=rzp_test_PLACEHOLDER
RAZORPAY_KEY_SECRET=PLACEHOLDER
OPSWAT_API_KEY=REPLACE_WITH_KEY
```

3. Start server:

```powershell
npm run dev
```

### Quick Docker commands

If you prefer running the full stack via Docker (recommended for parity with CI), these commands will build and start everything defined in `docker-compose.yml`:

```powershell
# from repository root
cd 'e:\tail_ai\TAIL.ai'
docker compose up --build
# or detached
docker compose up --build -d

# check containers
docker compose ps

# view logs (server or mongodb)
docker compose logs server --tail 200
docker compose logs mongodb --tail 200

# stop and remove containers
docker compose down
```

If `docker` is not recognized, install Docker Desktop for Windows and ensure it's running. Run PowerShell as Administrator if you hit permission errors.

### Troubleshooting Docker

- If a container fails `healthcheck` (e.g., MongoDB), run `docker compose logs <service>` to inspect the failure and check network/port collisions.
- Ports used by this repo: MongoDB 27017, server 8002, client 3000, ml_service 8003. Make sure those ports are free on the host.
- If images fail to download, check your network/proxy settings.

### Help me run (what to paste here when asking for help)

When you ask for help running Docker or the local stack, please paste the exact commands you ran and the last ~200 lines of output from:

```powershell
docker compose up --build
# and/or
docker compose logs server --tail 200
docker compose logs mongodb --tail 200
```

Also include the output of `docker compose ps`.

### Emulating locally without Docker (quick/demo mode)

If you don't want to use Docker, you can run the server and client locally. The server already falls back to a "demo" mode if MongoDB is unreachable (useful for UI and endpoint smoke-testing).

1. Start the server (PowerShell):

```powershell
cd server
# run in development mode (auto-reload)
npm run dev

# or run the production start script (will read .env)
# set PORT if needed:
$env:PORT=8002; npm run start
```

2. Build the client and serve the `dist/` folder (simple static serve via npx):

```powershell
cd client
npm ci
npm run build
# serve the built client on port 3000 (one-off via npx http-server)
npx http-server ./dist -p 3000
```

3. Visit the app in your browser at `http://localhost:3000` and the backend healthcheck at `http://localhost:8002/api/v1/healthcheck`.

If you want a small helper to start/stop the server for local emulation, see `scripts/start-server-demo.ps1` and `scripts/stop-server-demo.ps1` in the repository.

### When to use which approach

- Use Docker Compose for a full-stack environment (Mongo, server, client, ml_service) that mirrors CI.
- Use the local demo mode if you just want to run the server and client quickly without Docker. Note some features that require MongoDB or ML service will be disabled in demo mode.


## Run client (recommended: Docker)

If your local Node.js doesn't match Vite's engine requirements, use Docker to run the client image (Dockerfile exists in `client/`).

## Run ML service (Python)

Two options:

- With Poetry (preferred):

```bash
cd ml_service
poetry install
poetry run uvicorn app.main:app --reload --port 8003
```

- Without Poetry (pip):

```bash
cd ml_service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8003
```

Once the ML service is running, the backend exposes a proxy at `POST /api/v1/ml/infer` which forwards to `http://localhost:8003/infer`.

## OPSWAT MetaDefender integration (procedure)

1. Sign up for an OPSWAT account and obtain an API key for MetaDefender Cloud: https://www.opswat.com/
2. Add your API key to `server/.env` (or `server/config.yaml`):

```
OPSWAT_API_KEY=your-opswat-key-here
```

3. Replace the placeholder implementation in `server/src/routes/scan.js` with a streaming upload to the MetaDefender file scan endpoint. Key steps:
   - Read the file stream and send to https://api.metadefender.com/v4/file (or the current endpoint per OPSWAT docs)
   - Set header `apikey: <YOUR_KEY>` and `Content-Type: application/octet-stream`.
   - Handle asynchronous analysis by polling the reported resource ID if required by the API.
   - Save scan results (metadata + verdict) in MongoDB (e.g., `scans` collection) for audit and traceability.

4. Add retries and exponential backoff for network errors.

5. Consider scanning on upload (sync) for small files and async scanning for large uploads; update the frontend to display scan progress and final verdict.

6. Secure the endpoint: require authentication, rate limiting, and validate file types/sizes on both client and server.

## Next recommended tasks
- Add unit tests for `/api/v1/scan` (happy path + error path).
- Add GitHub Actions steps to run lint/test and build Docker images for `server`, `client`, and `ml_service`.
- Implement monitoring (prometheus client for Node and FastAPI) and dashboards (Grafana).
