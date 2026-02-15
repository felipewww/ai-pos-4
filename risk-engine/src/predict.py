# src/predict.py
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

import joblib

from src.schema import LABELS  # src/schema.py
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "models" / "risk_model.joblib"


RiskLevel = str  # "ROTINA" | "MONITORAR" | "URGENTE"


def _load_model_bundle() -> dict:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Modelo não encontrado em {MODEL_PATH}. Rode: python src/train.py"
        )
    return joblib.load(MODEL_PATH)


def _predictions_to_feature_row(pred: Dict[str, Any]) -> Dict[str, float]:
    """
    Converte:
      { Labels: [ {Name, Score}, ... ] }
    em um dict com todas as LABELS preenchidas (default 0.0).
    """
    row = {lab: 0.0 for lab in LABELS}

    labels = pred.get("Labels", [])
    for item in labels:
        name = item.get("Name")
        score = item.get("Score")
        if name in row and isinstance(score, (int, float)):
            row[name] = float(score)

    return row


def predict_risk(pred: Dict[str, Any]) -> Dict[str, Any]:
    bundle = _load_model_bundle()
    pipeline = bundle["pipeline"]
    feature_columns: List[str] = bundle["feature_columns"]

    row_dict = _predictions_to_feature_row(pred)

    # Mantém a mesma ordem de colunas usada no treino
    X = pd.DataFrame([[row_dict[col] for col in feature_columns]], columns=feature_columns)

    risk_level: RiskLevel = pipeline.predict(X)[0]

    # Probabilidade/confiança
    if hasattr(pipeline, "predict_proba"):
        proba = pipeline.predict_proba(X)[0]
        classes = list(pipeline.classes_)
        # pega probabilidade da classe prevista
        idx = classes.index(risk_level)
        confidence = float(proba[idx])
        proba_map = {classes[i]: float(proba[i]) for i in range(len(classes))}
    else:
        confidence = None
        proba_map = None

    # Regras simples de human-in-the-loop
    # - sempre revisar URGENTE
    # - revisar MONITORAR se confiança baixa
    # - revisar ROTINA se confiança MUITO baixa (padrão estranho)
    if risk_level == "URGENTE":
        human_review = True
    elif risk_level == "MONITORAR":
        human_review = (confidence is not None and confidence < 0.75)
    else:  # ROTINA
        human_review = (confidence is not None and confidence < 0.55)

    # Ajuda na explicação: top 5 sinais do Comprehend
    top_signals = sorted(
        [(lab, row_dict[lab]) for lab in LABELS],
        key=lambda x: x[1],
        reverse=True,
    )[:5]

    return {
        "riskLevel": risk_level,
        "confidence": confidence,
        "probabilities": proba_map,
        "humanReviewRequired": human_review,
        "topSignals": [{"label": k, "score": v} for k, v in top_signals],
        "features": row_dict,  # útil pra debug (pode omitir em prod)
    }


def main() -> None:
    """
    Uso:
      python src/predict.py < input.json

    Onde input.json é algo como:
    {
      "Labels": [
        {"Name":"aperto_no_peito","Score":0.93},
        {"Name":"alteracao_do_aparelho_cardiovascular","Score":0.88}
      ]
    }
    """
    raw = json.load(sys.stdin)  # type: ignore[name-defined]
    out = predict_risk(raw)
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    import sys
    main()
