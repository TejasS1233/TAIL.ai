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
