# src/train.py
from __future__ import annotations

import os
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "data" / "train_risk.csv"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_PATH = MODEL_DIR / "risk_model.joblib"


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset não encontrado: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)

    if "risk_level" not in df.columns:
        raise ValueError("Coluna 'risk_level' não encontrada no CSV.")

    y = df["risk_level"].astype(str)
    X = df.drop(columns=["risk_level"])

    # Validação simples: garante que todas as features são numéricas
    for col in X.columns:
        X[col] = pd.to_numeric(X[col], errors="raise")

    feature_cols = list(X.columns)

    # Split estratificado para manter proporção das classes
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # Pipeline: escala -> regressão logística
    pre = ColumnTransformer(
        transformers=[("num", StandardScaler(), feature_cols)],
        remainder="drop",
    )

    clf = LogisticRegression(
        max_iter=2000,
        class_weight="balanced",  # ajuda se ficar desbalanceado
        multi_class="auto",
        solver="lbfgs",
        random_state=42,
    )

    model = Pipeline([("pre", pre), ("clf", clf)])
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    print("\n=== Confusion Matrix ===")
    print(confusion_matrix(y_test, y_pred, labels=["ROTINA", "MONITORAR", "URGENTE"]))

    print("\n=== Classification Report ===")
    print(classification_report(y_test, y_pred, digits=3))

    # Salvar modelo
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "pipeline": model,
            "feature_columns": feature_cols,
            "classes": sorted(y.unique().tolist()),
        },
        MODEL_PATH,
    )
    print(f"\n✅ Modelo salvo em: {MODEL_PATH}")


if __name__ == "__main__":
    main()
