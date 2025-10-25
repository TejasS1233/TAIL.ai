# ML Service (placeholder)

This is a minimal FastAPI-based microservice that exposes a /infer endpoint for placeholder ML inference. It's scaffolded for expansion with LangChain, LlamaIndex, or other tooling.

To run locally with poetry:

```bash
cd ml_service
poetry install
poetry run uvicorn app.main:app --reload --port 8003
```

Or build with Docker:

```bash
docker build -t tailai-ml:dev ./ml_service
docker run -p 8003:8003 tailai-ml:dev
```
