from __future__ import annotations

from typing import Any, Dict, List, Optional
from fastapi import FastAPI
from pydantic import BaseModel, Field

from src.predict import predict_risk
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Risk Engine API", version="1.0.0")

ALLOWED_ORIGINS = [
    "http://localhost:3000",

    "http://localhost:3001",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LabelScore(BaseModel):
    Name: str
    Score: float = Field(ge=0.0, le=1.0)


class PredictionsIn(BaseModel):
    Labels: List[LabelScore]


@app.post("/risk")
def risk_endpoint(payload: PredictionsIn) -> Dict[str, Any]:
    # payload.model_dump() preserva chaves Name/Score como você mandou
    pred = payload.model_dump()
    result = predict_risk(pred)
    return result


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}
