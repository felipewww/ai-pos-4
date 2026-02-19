# 🩺 AI-Based Risk Detection for Women’s Health

### IA para Devs

---

# 📌 Visão Geral

Este projeto implementa um sistema de **análise multimodal aplicada à saúde da mulher**, com foco em:

* Detecção de sinais de vulnerabilidade (ex.: risco de violência doméstica)
* Monitoramento de bem-estar psicológico
* Identificação de padrões clínicos potencialmente anômalos
* Priorização de casos via Risk Engine
* Revisão humana (Human-in-the-Loop)

O sistema integra:

* 🎙️ **Amazon Transcribe** – Conversão de áudio em texto
* 🧠 **Amazon Comprehend (Custom Multi-label Model)** – Extração de sinais clínicos e sociais
* 📡 **Amazon EventBridge** – Orquestração orientada a eventos.
  Captura automaticamente mudanças de status dos jobs do Amazon Transcribe
  e aciona o backend para processamento do transcript.
* 🗂️ **Amazon S3** – Armazenamento centralizado de artefatos do pipeline.
  Guarda áudios, transcrições geradas pelo Transcribe e arquivos de entrada/saída do Comprehend.
* 🟢 **NestJS API + MongoDB** – Orquestração e persistência
* 🧮 **Risk Engine (modelo local em Python)** – Classificação de risco
* 🔁 **Human-in-the-Loop (HITL)** – Governança e validação humana

---

# 🏗️ Arquitetura do Sistema

```
Paciente (áudio)
        ↓
Amazon Transcribe
        ↓
Amazon EventBridge (Transcription Job State Change)
        ↓
NestJS Orchestrator
        ↓
Texto transcrito (S3)
        ↓
Amazon Comprehend (modelo customizado)
        ↓
Scores por label (multi-label)
        ↓
Python Risk Engine (Logistic Regression local)
        ↓
Risk Level + Confidence
        ↓
Human-in-the-Loop (se necessário)
        ↓
Registro / Encaminhamento
```

---

# 🧠 Modelo 1 – Amazon Comprehend (Multi-label)

## Objetivo

Detectar múltiplos sinais clínicos e sociais na fala da paciente.

## Labels treinadas

### 🧊 Vulnerabilidade

* `risco_violencia_domestica`
* `isolamento_social`

### 🩺 Sintomas Físicos

* `dor_de_cabeca_frequente`
* `aperto_no_peito`
* `dor_muscular`
* `alteracao_do_aparelho_respiratorio`
* `alteracao_do_aparelho_cardiovascular`
* `alteracao_do_aparelho_digestivo`
* `alteracao_do_aparelho_reprodutor`

### ♀️ Específico (Saúde da Mulher)

* `fadiga_persistente`
* `sintoma_hormonal`

## Dataset

* 700 exemplos de treino
* 175 exemplos de teste
* Multi-label com combinações complexas

## Resultado

* F1 Score: ~0.92
* Accuracy: ~0.88

---

# 🧮 Modelo 2 – Risk Engine (Python Local)

## Motivação

O Comprehend identifica sinais individuais.
A Risk Engine transforma esses sinais em **nível de prioridade clínica**.

## Algoritmo

* Logistic Regression (scikit-learn)
* Entrada: vetor com os 11 scores do Comprehend
* Saída: classificação multi-classe:

```
ROTINA
MONITORAR
URGENTE
```

## Por que Logistic Regression?

* Leve
* Explicável
* Retorna probabilidades (`predict_proba`)
* Adequado para features numéricas contínuas

---

# 🚨 Detecção de Anomalias

A detecção de anomalias ocorre em dois níveis:

## 1️⃣ Anomalia Semântica

Detectada pelo modelo multi-label:

* Combinação inesperada de sintomas
* Sinais de violência
* Alterações cardiorrespiratórias

## 2️⃣ Anomalia de Prioridade

Detectada pela Risk Engine:

* `URGENTE` → padrão potencialmente crítico
* `confidence` baixa → modelo incerto (padrão atípico)

Isso atende o requisito de:

> “Aplicar técnicas de detecção de anomalias para monitoramento preventivo”

---

# 🔁 Human-in-the-Loop (HITL)

Casos são encaminhados para revisão humana quando:

* `riskLevel == URGENTE`
* `riskLevel == MONITORAR` com baixa confiança
* Modelo apresenta alta incerteza

## Fluxo de revisão

1. Caso criado com status `PENDING`
2. Profissional revisa:

    * CONFIRMED
    * DISMISSED
    * ESCALATED
3. Auditoria registrada

Isso garante:

* Governança
* Segurança
* Evita decisões automatizadas sensíveis

---

# 🔌 API – Integração com NestJS

A Risk Engine é exposta via FastAPI:

```
POST /risk
```

Entrada:

```json
{
  "Labels": [
    { "Name": "aperto_no_peito", "Score": 0.92 },
    { "Name": "alteracao_do_aparelho_cardiovascular", "Score": 0.86 }
  ]
}
```

Saída:

```json
{
  "riskLevel": "URGENTE",
  "confidence": 0.96,
  "humanReviewRequired": true,
  "topSignals": [...]
}
```

---

# 🐳 Infraestrutura

* Docker Compose
* Serviço NestJS
* MongoDB – Persistência de transcrições, classificações e casos para revisão
* Risk Engine Python
* Comunicação interna via DNS Docker (`http://risk-engine:8000`)

---

# 🎯 Objetivos Atendidos

✔ Processamento de gravações de voz
✔ Identificação de sinais de violência doméstica
✔ Monitoramento de bem-estar psicológico
✔ Detecção de anomalias clínicas
✔ Classificação de prioridade
✔ Integração com serviços gerenciados AWS
✔ Governança via Human-in-the-Loop

---

# 📊 Diferencial Técnico

Este projeto implementa:

* Modelo multi-label na nuvem
* Modelo secundário de priorização local (stacking)
* Fusão de sinais
* Detecção baseada em incerteza
* Arquitetura híbrida (AWS + modelo local)
* Governança humana

---

# 🚀 Próximos Passos (Possíveis Extensões)

* Retreino automático da Risk Engine
* Monitoramento de drift
* Notificação automática (SES/SNS)
* Dashboard clínico
* Versionamento de modelos

---

# 🏁 Conclusão

O sistema demonstra como técnicas modernas de IA podem:

* Analisar linguagem natural médica
* Detectar sinais clínicos e sociais relevantes
* Identificar padrões anômalos
* Priorizar atendimentos
* Manter supervisão humana em decisões sensíveis

Tudo isso integrando serviços gerenciados em nuvem com modelos locais leves e explicáveis.

---

Se você quiser, posso agora:

* Transformar isso numa versão ainda mais acadêmica (com seção de metodologia e métricas)
* Ou montar um diagrama visual em formato Mermaid para colocar no README.
