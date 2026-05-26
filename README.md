# 🌐 Live Platform

## 🚀 Production Deployment

| Service | Link |
|---|---|
| Frontend (Vercel) | https://carrer-intelligence.vercel.app/ |
| Backend API (Render) | https://pathora-backend1.onrender.com |
| GitHub Repository | https://github.com/bhagavan444/pathora |

---



# 🚀 Pathora — AI Career Intelligence Platform

> **A production-grade AI-powered engineering career intelligence system that evaluates resumes like a Staff Engineer — not a keyword bot.**

<p align="center">

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge\&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge\&logo=fastapi)
![Python](https://img.shields.io/badge/AI-Python%20%2B%20Gemini-3776AB?style=for-the-badge\&logo=python)
![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge\&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

# 🌌 What is Pathora?

**Pathora** is an advanced AI Career Intelligence Platform engineered specifically for software engineers and technical students.

Unlike traditional ATS scanners that only count keywords, Pathora combines:

* Deterministic Engineering Analysis
* AI Semantic Intelligence
* Career Benchmarking
* Market Competitiveness Evaluation
* Technical Skill Gap Detection
* Recruiter-Level Resume Auditing

The system evaluates resumes similarly to how a **Senior Engineer / Hiring Manager** reviews candidates in real hiring pipelines.

---

# ⚡ Core Vision

Most resume analyzers are shallow.

They:

* Match keywords
* Generate random scores
* Hallucinate feedback
* Fail under real engineering evaluation

Pathora was designed to solve this problem.

The platform uses:

✅ Deterministic Scoring Engines
✅ AI-Orchestrated Semantic Analysis
✅ Engineering Maturity Detection
✅ Resume Intelligence Pipelines
✅ Real Deployment Constraints Optimization

to produce stable, production-grade evaluations.

---

# 🧠 Key Features

## 📄 Resume Intelligence Engine

* PDF Resume Upload
* Resume Parsing
* ATS Benchmarking
* Engineering Competitiveness Analysis
* Market Percentile Estimation
* Recruiter Trust Signal Detection
* Resume Structure Evaluation

---

## 🧬 Career Genome System

Pathora generates a dynamic engineering profile called:

> **Career Genome**

This analyzes:

* Technical depth
* Deployment maturity
* Real-world project complexity
* Stack diversity
* Engineering consistency
* Hiring readiness

---

## 📊 Advanced Dashboard Analytics

Interactive visual intelligence including:

* ATS Score Rings
* Radar Charts
* Skill Distribution Mapping
* Career Progression Curves
* Market Benchmark Metrics
* Gap Analysis Systems

---

## 🤖 AI-Powered Career Advisor

Integrated Gemini AI orchestration enables:

* Semantic resume understanding
* Project quality evaluation
* Engineering maturity analysis
* Personalized career roadmap generation
* Interview readiness insights

---

## ⚡ Real-Time AI Chatbot

Features:

* Server-Sent Event Streaming (SSE)
* Real-time chunked AI responses
* Low latency interaction model
* Context-aware career guidance

---

# 🏗️ Production Architecture

# 🧭 System Architecture

<img width="1758" height="480" alt="image" src="https://github.com/user-attachments/assets/856c8ea7-d6f0-4f1a-af95-e3076bcdd6a7" />


# ⚙️ Resume Analysis Pipeline
<img width="824" height="776" alt="image" src="https://github.com/user-attachments/assets/75de75b9-fbd8-46f4-a00d-6b91a95438ac" />


---

# 🧠 AI Intelligence Flow
<img width="1475" height="409" alt="image" src="https://github.com/user-attachments/assets/9c0619f9-ef04-4f74-8443-48c3c6757342" />


# 🛠️ Tech Stack

| Layer            | Technologies                         |
| ---------------- | ------------------------------------ |
| Frontend         | React, Vite, Framer Motion, Recharts |
| Backend          | FastAPI, Python                      |
| AI               | Gemini AI, spaCy                     |
| PDF Processing   | pdfplumber                           |
| Deployment       | Vercel + Render                      |
| State Management | React Hooks                          |
| Streaming        | SSE                                  |
| Visualization    | Recharts                             |
| Styling          | Advanced CSS + Motion UI             |

---

# 🔥 Engineering Challenges Solved

## 🚨 Render 512MB Memory Constraint

### Problem

Heavy ML libraries caused:

* Out Of Memory crashes
* Deployment failures
* Slow cold starts

### Solution

Pathora aggressively optimized the backend by:

* Removing Torch
* Removing Sentence Transformers
* Eliminating FAISS
* Using lightweight NLP systems
* Offloading inference to Gemini APIs

### Result

✅ Stable deployment on Render Free Tier
✅ Reduced memory footprint dramatically
✅ Faster API response times

---

## 🚨 Flask → FastAPI Migration

### Problem

Legacy Flask backend failed under:

* AI streaming workloads
* Concurrent requests
* SSE streaming

### Solution

Migrated architecture to:

* FastAPI ASGI
* Async streaming pipelines
* a2wsgi compatibility bridge

### Result

✅ Real-time streaming support
✅ Better scalability
✅ Improved developer experience

---

## 🚨 Frontend Payload Mismatch

### Problem

Frontend expected nested AI payloads while backend returned flat responses.

### Solution

Created strict normalization layers inside:

* `useResumeAnalysis.js`

### Result

✅ Stable rendering
✅ No fake ATS values
✅ Accurate dashboard metrics

---

# 🎨 UI/UX Philosophy

Pathora follows a cinematic SaaS design system inspired by:

* Apple
* Linear
* Vercel
* Perplexity
* Arc Browser

Design goals:

* Premium dark aesthetic
* Motion-first interactions
* Minimal visual noise
* Intelligent information density
* Enterprise-grade feel

---

# 📂 Project Structure

```bash
Pathora/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   └── assets/
│   │
│   └── public/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   │
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

# 🚀 Deployment Architecture

<img width="609" height="441" alt="image" src="https://github.com/user-attachments/assets/00f5ce2c-d814-4a81-90b1-24a259f60a58" />


# 📈 Future Scalability Roadmap

## Planned Upgrades

### 🔹 Redis Distributed Cache

Replace runtime memory storage.

### 🔹 PostgreSQL + pgvector

Persistent vector search infrastructure.

### 🔹 JWT Authentication

Persistent secure user systems.

### 🔹 Multi-Agent AI Career System

Advanced autonomous AI career planning.

### 🔹 RAG-Based Engineering Knowledge Layer

Context-aware engineering recommendations.

---

# 🧪 Local Development Setup

## Clone Repository

```bash
git clone https://github.com/your-username/pathora.git
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# 🌐 Environment Variables

## Frontend

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Backend

```env
GOOGLE_API_KEY=your_gemini_api_key
```

---

# 📊 Real Engineering Strengths

| Capability                 | Rating |
| -------------------------- | ------ |
| AI Systems Integration     | ⭐⭐⭐⭐⭐  |
| Deployment Engineering     | ⭐⭐⭐⭐⭐  |
| Frontend UX Engineering    | ⭐⭐⭐⭐⭐  |
| Resume Intelligence Design | ⭐⭐⭐⭐⭐  |
| Production Optimization    | ⭐⭐⭐⭐⭐  |

---

# 🎯 Why Pathora is Different

Most student projects:

* are CRUD apps
* use fake AI
* have static dashboards
* cannot scale
* fail in production

Pathora instead demonstrates:

✅ Real AI orchestration
✅ Production optimization
✅ System architecture thinking
✅ Engineering tradeoff decisions
✅ Streaming AI systems
✅ Advanced frontend visualization
✅ Infrastructure constraints handling

This transforms the project from:

> “college project”

into:

> **production-grade engineering platform**

---


---

# 📜 License

MIT License

---

# ⭐ Final Note

Pathora is not designed to be another resume checker.

It is engineered as:

> **An AI-powered engineering career intelligence operating system for modern developers.**

---

# 🌌 Pathora

### *Decode Your Engineering Potential.*

---

Based on the uploaded architecture analysis document. 
# 🌐 Live Platform



---

# 🎥 Platform Preview

![Pathora Banner](docs/assets/pathora-preview.png)
