from fastapi import FastAPI
from pydantic import BaseModel
from typing import Any, Dict

from ..agents.example_agent import ExampleAgent

app = FastAPI()


class InferenceRequest(BaseModel):
    prompt: str


agent = ExampleAgent()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/infer")
def infer(req: InferenceRequest):
    # Use the example agent to process the prompt
    result = agent.run(req.prompt)
    # If agent.run returns a coroutine, await it (support sync/coroutine)
    if hasattr(result, '__await__'):
        import asyncio

        result = asyncio.get_event_loop().run_until_complete(result)
    return result


@app.post("/agent/run")
def agent_run(payload: Dict[str, Any]):
    prompt = payload.get('prompt') or ''
    result = agent.run(prompt)
    if hasattr(result, '__await__'):
        import asyncio

        result = asyncio.get_event_loop().run_until_complete(result)
    return {"agent": agent.name, "result": result}
