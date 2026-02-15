# 📘 Risk Engine – Modelo Local de Classificação de Risco

Este projeto implementa uma **Risk Engine local em Python**, responsável por classificar o nível de risco clínico com base nos scores retornados pelo Amazon Comprehend.

Pipeline conceitual:

```
Transcribe → Comprehend → Risk Engine (Logistic Regression) → API → Nest
```

A Risk Engine classifica em:

* `ROTINA`
* `MONITORAR`
* `URGENTE`

E também retorna:

* `confidence`
* `probabilities`
* `humanReviewRequired`
* `topSignals`

---

# 📦 Estrutura do Projeto

```
risk-engine/
│
├── data/
│   └── train_risk.csv
│
├── models/
│   └── risk_model.joblib
│
├── src/
│   ├── __init__.py
│   ├── api.py
│   ├── predict.py
│   ├── schema.py
│   └── train.py
│
├── requirements.txt
├── Dockerfile
└── README.md
```

---

# 🧠 1️⃣ Treinando o Modelo

## Criar ambiente virtual

```bash
python -m venv .venv
source .venv/bin/activate  # mac/linux
# .\.venv\Scripts\Activate.ps1  # windows
```

## Instalar dependências

```bash
pip install -r requirements.txt
```

## Treinar o modelo

```bash
python src/train.py
```

Isso irá:

* Ler `data/train_risk.csv`
* Treinar uma Regressão Logística
* Exibir métricas (confusion matrix + classification report)
* Salvar o modelo em:

```
models/risk_model.joblib
```

---

# 🧪 2️⃣ Testar o Modelo (Sem API)

Crie um arquivo de teste:

`data/sample_pred.json`

```json
{
  "Labels": [
    {"Name": "aperto_no_peito", "Score": 0.92},
    {"Name": "alteracao_do_aparelho_cardiovascular", "Score": 0.86},
    {"Name": "alteracao_do_aparelho_respiratorio", "Score": 0.72}
  ]
}
```

Execute:

```bash
python src/predict.py < data/sample_pred.json
```

Exemplo de saída:

```json
{
  "riskLevel": "URGENTE",
  "confidence": 0.96,
  "humanReviewRequired": true,
  "topSignals": [...]
}
```

---

# 🌐 3️⃣ Executando como API (FastAPI)

## Rodar localmente

```bash
uvicorn src.api:app --reload --host 0.0.0.0 --port 8000
```

Acesse:

* Health:

  ```
  http://localhost:8000/health
  ```

* Swagger UI:

  ```
  http://localhost:8000/docs
  ```

## Exemplo de requisição

```bash
curl -X POST "http://localhost:8000/risk" \
  -H "Content-Type: application/json" \
  -d '{
    "Labels": [
      {"Name":"aperto_no_peito","Score":0.92},
      {"Name":"alteracao_do_aparelho_cardiovascular","Score":0.86},
      {"Name":"alteracao_do_aparelho_respiratorio","Score":0.72}
    ]
  }'
```

---

# 🐳 4️⃣ Rodando com Docker (Hot Reload)

## Build + Run

```bash
docker compose up --build
```

A API ficará disponível em:

```
http://localhost:8000
```

Hot reload ativado com:

```
uvicorn --reload
```

Qualquer alteração em `src/*.py` reinicia automaticamente o servidor.

---

# 🔌 5️⃣ Integração com NestJS

No `docker-compose.yml` do backend:

```yaml
environment:
  RISK_ENGINE_URL: http://risk-engine:8000
```

No Nest:

```ts
POST ${process.env.RISK_ENGINE_URL}/risk
```

Payload esperado:

```ts
type Predictions = {
  Labels: {
    Name: string,
    Score: number
  }[]
}
```

---

# 📊 Modelo Utilizado

* Algoritmo: Logistic Regression
* Features: Scores do Comprehend (11 labels)
* Saída: Multi-class (`ROTINA`, `MONITORAR`, `URGENTE`)
* Confidence via `predict_proba`
* Human-in-the-loop baseado em:

    * risco URGENTE
    * baixa confiança

---

# 🚀 Resumo

Este serviço:

✔ Recebe scores do Comprehend
✔ Classifica risco clínico
✔ Retorna nível + confiança
✔ Pode acionar revisão humana
✔ É leve, explicável e local

---

Se você quiser, posso agora:

* Criar uma seção de **Arquitetura Final do Sistema** (para colocar no relatório da faculdade)
* Ou melhorar o README deixando com diagramas de fluxo e explicação acadêmica.
