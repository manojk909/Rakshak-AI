<div align="center">

# 🛡️ RAKSHAK AI

### Defeat the Invisible Threat

**India's first AI-powered Digital Public Safety Intelligence platform** — shifting law enforcement from reactive complaint filing to predictive neutralisation of digital arrest scams, fraud networks, and counterfeit currency.

`ET AI Hackathon 2026 · PS6 · Digital Public Safety`

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=nextdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?logo=google&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-GL_JS-000000?logo=mapbox&logoColor=white)

</div>

---

## 🔗 Live Demo

| Surface | URL |
|---|---|
| Frontend (Vercel) | `https://rakshak-ai.vercel.app` |
| Backend API (Render) | `https://rakshak-ai-backend.onrender.com/api/health` |
| API Docs (Swagger) | `https://rakshak-ai-backend.onrender.com/docs` |

Demo operator login: `admin` / `rakshak2026`

---

## 🏗️ Architecture

```
                        ┌─────────────────────────────────┐
                        │  Next.js 14 (Vercel)              │
                        │  Landing · Command Center         │
                        │  Citizen Shield · Counterfeit     │
                        └───────────────┬───────────────────┘
                                        │ REST /api/*
                        ┌───────────────▼───────────────────┐
                        │  FastAPI (Render / localhost)       │
                        │  JWT auth · slowapi rate limits     │
                        │  PII redaction · evidence hashing   │
         ┌──────────┬───┴───────┬────────────┬───────────┬────┴──────────┐
         │          │           │            │           │               │
  ┌──────▼────┐ ┌───▼─────┐ ┌──▼──────┐ ┌───▼──────┐ ┌──▼─────────┐ ┌──▼──────────┐
  │Gemini 1.5 │ │NetworkX │ │Whisper  │ │ OpenCV   │ │ H3 Spatial │ │Sarvam AI    │
  │Flash(LLM) │ │Graph AI │ │+librosa │ │ CFC note │ │ Indexing   │ │TTS+Translate│
  │scam class.│ │PageRank │ │voice AI │ │(heuristic│ │patrol prio │ │12 Indian    │
  │chat assist│ │hub detect│ │spoof det│ │ checks)  │ │H3 hex grid │ │languages    │
  └───────────┘ └─────────┘ └─────────┘ └──────────┘ └────────────┘ └─────────────┘
                                        │
                        ┌───────────────▼───────────────────┐
                        │  MongoDB Atlas (M0 free tier)       │
                        │  9 collections · PII-safe design    │
                        │  SHA-256 evidence chain of custody  │
                        │  Seeded synthetic data (no real PII)│
                        └─────────────────────────────────────┘
```

---

## ✅ Features

- ✅ **Digital Arrest Scam Detection** — Gemini 1.5 Flash classifier with number-spoofing signatures (`caller_id_spoofed`) and call metadata anomalies; automated case creation with MHA-style alerting
- ✅ **Voice Spoofing Detection** — Whisper transcription + librosa heuristics (pitch flatness, noise floor, timing regularity)
- ✅ **Fraud Network Graph Intelligence** — NetworkX PageRank + betweenness centrality, hub detection, fraud ring clustering, **cross-jurisdiction ring flagging** with linked-states evidence
- ✅ **Geospatial Crime Intelligence** — Mapbox dark-v11 heatmap → marker transition, H3 hex clustering, **patrol priority ranking** (density × 7-day recency decay)
- ✅ **Citizen Fraud Shield** — multilingual chat (8 languages), Sarvam AI TTS audio responses for non-English users, caller verification, guided NCRB-style reporting, IVR webhook stub
- ✅ **Counterfeit Currency Check** — heuristic OpenCV checks (security thread, microprint sharpness, serial font consistency, simulated UV band) across all 7 denominations
- ✅ **Evidence Chain of Custody** — SHA-256 hash + immutable UTC timestamp at ingestion, tamper verification, court-admissible packages
- ✅ **Detection Metrics** — live precision / recall / FP-rate / lead-time endpoint surfaced on the dashboard
- ✅ **Security** — JWT auth, per-endpoint rate limits, mandatory PII redaction, masked identifiers, no raw transcript exposure, no image persistence

---

## 🚀 Setup (8 steps)

```bash
# 1. Clone
git clone https://gitlab.com/srmu-group/rakshak-ai.git && cd rakshak-ai

# 2. Backend deps
cd backend && pip install -r requirements.txt && python -m spacy download en_core_web_sm

# 3. Configure backend
cp .env.example .env   # fill MONGODB_URI, GEMINI_API_KEY, JWT_SECRET_KEY (Sarvam optional)

# 4. Run backend (auto-seeds synthetic data on first start)
uvicorn main:app --reload --port 8000

# 5. Frontend deps
cd ../frontend && npm install

# 6. Configure frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_MAPBOX_TOKEN

# 7. Run frontend
npm run dev

# 8. Open http://localhost:3000  (dashboard login: admin / rakshak2026)
```

API documentation: `http://localhost:8000/docs`

---

## 📊 Data Strategy

All demo data is **synthetic**, generated by `backend/data/generate_synthetic.py` (seeded, reproducible):
500 fraud cases · 800 graph nodes · 1,200 edges · 600 crime locations · 300 citizen reports · 120 counterfeit checks · 50 agency actions. Scam script templates are modeled on publicly reported I4C/MHA advisories. **No real victim data, phone numbers, or restricted currency imagery is used anywhere.** Labeled `ground_truth_*` fields exist only in synthetic data, are consumed exclusively by the metrics service, and are never exposed via public API.

## 🔐 Evidence Chain of Custody

Every transcript is hashed at ingestion: `SHA-256(content | UTC-timestamp)` stored atomically with the record. Reads can be integrity-verified; any mutation invalidates the hash. Evidence packages bundle `content_hash`, `metadata_hash`, and a combined `chain_hash` for judicial review, alongside deterministic NCRB-style references (`NCRB-{year}-{city}-{id}`).

## 📈 Detection Metrics

Live at `GET /api/dashboard/metrics` and on the dashboard strip — precision, recall, false positive rate, and average detection lead time for the scam classifier, plus precision/recall for the counterfeit checker. **These are computed against labeled synthetic evaluation data** (10% hard negatives deliberately included so scores are non-trivial), not real-world casework.

## 📌 Scope Notes (informed decisions, not gaps)

1. **Counterfeit Currency Check is a heuristic, rules-based prototype** — region-based OpenCV checks against public RBI note specifications, NOT a trained CV classifier. This avoids collecting restricted currency training image datasets while still addressing the counterfeit build area end-to-end. The UI labels it “Heuristic Check · Prototype” and verdicts carry a permanent disclaimer.
2. **IVR channel is integration-ready, not live** — `POST /api/citizen/ivr-webhook` proves the integration point and runs the full scam-analysis pipeline, but originating/receiving calls requires a telephony provider (Twilio/Exotel) account, which is out of hackathon scope.

## 🏆 Judging Criteria Alignment

| Criterion | Weight | How RAKSHAK delivers |
|---|---|---|
| Innovation | 25% | Gemini scam classification + graph ring intelligence + multilingual Shield + heuristic counterfeit agent in one converged platform |
| Business Impact | 25% | Targets the ₹1,776 Cr digital-arrest problem; court-admissible evidence; cross-jurisdiction ring detection for inter-state coordination |
| Technical Excellence | 20% | Multi-service AI architecture, SHA-256 custody chain, NetworkX PageRank, OpenCV structural checks, PII-safe by design |
| Scalability | 15% | Stateless FastAPI, MongoDB Atlas, H3 spatial indexing, polling-based live updates — no heavyweight infra (no Kafka/Redis/Neo4j) |
| User Experience | 15% | Command center + citizen chatbot + one-tap counterfeit check, 6 Indian languages, works in demo mode even if API is down |

## 👥 Team

SRMU Group — ET AI Hackathon 2026, PS6.

## 📄 License

MIT
