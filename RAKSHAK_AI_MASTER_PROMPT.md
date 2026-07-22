# RAKSHAK AI — MASTER BUILD PROMPT
## Digital Public Safety Intelligence Platform
### ET AI Hackathon 2026 · PS6 · Full Production Build

---

> **AGENT INSTRUCTIONS:** Build this project exactly as specified. Do not skip any section.
> Execute phase by phase. After each phase, verify all files exist and all routes return
> expected responses before moving to the next. This is a competition submission —
> every detail matters.

---

## 0. PROJECT IDENTITY

| Field | Value |
|---|---|
| **Project Name** | RAKSHAK AI |
| **Tagline** | "Defeat the Invisible Threat" |
| **Sub-tagline** | India's first AI-powered Digital Public Safety Intelligence platform |
| **Problem** | ET AI Hackathon 2026 · PS6 — Digital Public Safety |
| **Primary Users** | (1) Law enforcement command centers · (2) Indian citizens |
| **Color Primary** | `#ccff00` (Neon Lime) |
| **Color Base** | `#0a0a0a` (Obsidian) |
| **Color Dashboard** | `#0f172a` (Slate-900) |
| **Fonts** | Space Grotesk (headings) · JetBrains Mono (technical labels) · General Sans (body) |
| **GitHub Repo** | `rakshak-ai` |
| **Demo URL** | Vercel deployment (frontend) + Render deployment (backend) |

---

## 1. NON-NEGOTIABLE TECH STACK

### Backend
```
Python 3.11
FastAPI 0.110.x
uvicorn[standard] 0.29.x
motor 3.4.x              # async MongoDB driver
pymongo 4.7.x
google-generativeai 0.7.x  # Gemini 1.5 Flash
openai-whisper 20231117   # audio transcription
networkx 3.3              # graph analytics
python-jose[cryptography] 3.3.0  # JWT
passlib[bcrypt] 1.7.4
python-multipart 0.0.9    # file upload
aiofiles 23.2.1
apscheduler 3.10.4
faker 24.x                # synthetic data
pandas 2.2.x
numpy 1.26.x
spacy 3.7.x               # NER/PII redaction
python-dotenv 1.0.x
httpx 0.27.x              # async HTTP
slowapi 0.1.9             # rate limiting
pydantic 2.7.x
h3 3.7.x                  # hexagonal spatial indexing
librosa 0.10.x            # audio feature extraction (voice spoof heuristics)
opencv-python-headless 4.9.x  # counterfeit note image analysis
Pillow 10.3.x             # image loading/preprocessing
```

### Frontend
```
Next.js 14.2.x (App Router)
TypeScript 5.x
Tailwind CSS 3.4.x
Framer Motion 11.x
react-map-gl 7.x (Mapbox GL JS React wrapper)
mapbox-gl 2.x
cytoscape 3.29.x + react-cytoscapejs 2.0.x
recharts 2.12.x
lucide-react 0.372.x
socket.io-client 4.7.x    # for live threat WebSocket
axios 1.7.x
```

### Infrastructure
```
MongoDB Atlas M0 (free) — primary DB + vector search
Render.com — FastAPI backend
Vercel — Next.js frontend
Google Gemini 1.5 Flash — primary LLM (free tier)
Sarvam AI — Indian language TTS + translation (free credits)
```

---

## 2. COMPLETE FILE STRUCTURE

Build EXACTLY this structure. Every file listed must exist.

```
rakshak-ai/
├── README.md
├── .gitignore
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   ├── render.yaml
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── scam_detection.py
│   │   ├── graph_intelligence.py
│   │   ├── citizen_shield.py
│   │   ├── geospatial.py
│   │   ├── dashboard.py
│   │   └── counterfeit_detection.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gemini_service.py
│   │   ├── sarvam_service.py
│   │   ├── graph_service.py
│   │   ├── pii_redactor.py
│   │   ├── evidence_hasher.py
│   │   ├── audio_service.py
│   │   ├── alert_service.py
│   │   ├── counterfeit_service.py
│   │   └── metrics_service.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── schemas.py
│   │   └── database.py
│   │
│   ├── data/
│   │   ├── generate_synthetic.py
│   │   ├── seed_database.py
│   │   ├── scam_templates.json
│   │   ├── indian_cities.json
│   │   └── note_security_features.json
│   │
│   └── utils/
│       ├── __init__.py
│       ├── security.py
│       └── rate_limiter.py
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── .env.local.example
    │
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── page.tsx                  ← Landing page (Obsidian & Lime)
        │   ├── dashboard/
        │   │   └── page.tsx              ← Command Center (slate dark)
        │   ├── citizen/
        │   │   └── page.tsx              ← Citizen Fraud Shield
        │   └── counterfeit/
        │       └── page.tsx              ← Counterfeit Currency Check
        │
        ├── components/
        │   ├── landing/
        │   │   ├── Navbar.tsx
        │   │   ├── Hero.tsx
        │   │   ├── FeaturesBento.tsx
        │   │   ├── StatsSection.tsx
        │   │   └── Footer.tsx
        │   │
        │   ├── dashboard/
        │   │   ├── DashboardHeader.tsx
        │   │   ├── KPICards.tsx
        │   │   ├── LiveThreatStream.tsx
        │   │   ├── ThreatCard.tsx
        │   │   ├── LiveIncidentMap.tsx
        │   │   ├── PatrolPriority.tsx
        │   │   ├── DetectionMetrics.tsx
        │   │   ├── FraudNetworkGraph.tsx
        │   │   ├── AIThreatAnalysis.tsx
        │   │   └── AgencyCoordination.tsx
        │   │
        │   ├── citizen/
        │   │   ├── ChatInterface.tsx
        │   │   ├── LanguageSelector.tsx
        │   │   ├── MessageBubble.tsx
        │   │   ├── ReportForm.tsx
        │   │   └── EmergencyContacts.tsx
        │   │
        │   └── counterfeit/
        │       ├── NoteScanner.tsx
        │       └── CounterfeitResult.tsx
        │
        ├── lib/
        │   ├── api.ts
        │   ├── types.ts
        │   └── constants.ts
        │
        └── hooks/
            ├── useLiveThreats.ts
            └── useGraphData.ts
```

---

## 3. ENVIRONMENT VARIABLES

### `backend/.env.example`
```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rakshak_ai
DATABASE_NAME=rakshak_ai

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
SARVAM_API_KEY=your_sarvam_api_key_here

# Security
JWT_SECRET_KEY=your_256_bit_secret_key_here_minimum_32_chars
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24

# App Config
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,https://rakshak-ai.vercel.app
RATE_LIMIT_PER_MINUTE=30
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt_hash_here

# Synthetic Data
DEFAULT_SYNTHETIC_RECORDS=500
```

### `frontend/.env.local.example`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=RAKSHAK AI
NEXT_PUBLIC_DASHBOARD_PASSWORD=rakshak2026
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## 4. MONGODB SCHEMA DEFINITIONS

Define these exact collections in `backend/models/schemas.py` using Pydantic v2:

### Collection: `fraud_cases`
```python
class FraudCase(BaseModel):
    case_id: str                    # UUID
    timestamp: datetime
    victim_name: str                # PII-safe display name (e.g., "R. Sharma")
    victim_location_city: str
    victim_location_lat: float
    victim_location_lng: float
    victim_location_h3: str         # H3 index at resolution 7
    caller_number_masked: str       # "+91 98*** **456" format
    scam_type: str                  # "digital_arrest" | "customs_duty" | "trai_disconnection" | "electricity_bill" | "aadhaar_misuse" | "kyc_fraud" | "tax_refund"
    authority_impersonated: str     # "CBI" | "ED" | "TRAI" | "Customs" | "Police" | null
    scam_probability: float         # 0.0-1.0
    voice_spoof_confidence: float   # 0.0-1.0 (from audio analysis)
    script_match_percent: int       # 0-100
    risk_triggers: List[str]        # matched phrases
    caller_id_spoofed: bool         # detected number-spoofing signature (CLI/SIP header mismatch simulation)
    call_metadata_anomalies: List[str]  # e.g. ["voip_relay_detected", "recent_sim_swap", "shared_imei_cluster"]
    urgency_level: str              # "critical" | "high" | "medium" | "low"
    status: str                     # "active" | "investigating" | "blocked" | "resolved"
    transcript_snippet: str         # first 200 chars, PII-redacted
    evidence_hash: str              # SHA-256 of raw transcript
    amount_at_risk_inr: int
    amount_lost_inr: int            # 0 if intervention successful
    channel: str                    # "video_call" | "voice_call" | "whatsapp" | "sms"
    agency_assigned: str            # "I4C" | "local_cyber_cell" | "state_cid"
    detected_at_seconds: int        # seconds from session start to detection — feeds the "lead time before mass victimisation" metric
    ground_truth_is_scam: bool      # synthetic label for evaluation only; consumed by metrics_service, NEVER exposed via public API
    created_at: datetime
    updated_at: datetime
```

### Collection: `scam_transcripts`
```python
class ScamTranscript(BaseModel):
    transcript_id: str
    case_id: str
    raw_text: str                   # NEVER exposed via API
    redacted_text: str              # PII-stripped version for display
    evidence_hash: str              # SHA-256(raw_text + timestamp)
    hash_timestamp: datetime        # immutable chain of custody
    language_detected: str
    scam_probability: float
    matched_template_ids: List[str]
    gemini_analysis: dict           # full Gemini JSON response
    created_at: datetime
```

### Collection: `graph_nodes`
```python
class GraphNode(BaseModel):
    node_id: str
    node_type: str                  # "victim" | "suspect_phone" | "mule_account" | "ip_address" | "fraud_compound" | "imei"
    label: str                      # display label
    masked_value: str               # "+91 98*** **456" or "HDFC ***1234"
    city: str
    state: str
    pagerank_score: float           # computed by NetworkX
    centrality_score: float         # betweenness centrality
    connected_cases: List[str]      # case_ids
    total_transactions_inr: int
    risk_level: str                 # "critical" | "high" | "medium"
    is_hub: bool                    # True if PageRank > threshold
    linked_states: List[str]        # all distinct states this node's ring touches (via connected cases)
    is_cross_jurisdiction: bool     # True if linked_states has 2+ entries — surfaces inter-state coordination need
    created_at: datetime
```

### Collection: `graph_edges`
```python
class GraphEdge(BaseModel):
    edge_id: str
    source_node_id: str
    target_node_id: str
    relationship_type: str          # "CALLED" | "TRANSFERRED_TO" | "LOGGED_FROM" | "SHARES_IMEI" | "CONTROLLED_BY"
    amount_inr: int                 # 0 if not financial
    timestamp: datetime
    case_id: str
    metadata: dict
```

### Collection: `crime_locations`
```python
class CrimeLocation(BaseModel):
    location_id: str
    lat: float
    lng: float
    city: str
    state: str
    crime_type: str                 # "digital_arrest" | "mule_withdrawal" | "fraud_compound" | "victim_cluster"
    case_id: str
    h3_index: str                   # resolution 7
    severity: str                   # "critical" | "high" | "medium"
    timestamp: datetime
```

### Collection: `citizen_reports`
```python
class CitizenReport(BaseModel):
    report_id: str
    timestamp: datetime
    reporter_phone_hash: str        # SHA-256 of phone (never store raw)
    description: str                # PII-redacted
    language: str                   # "hi" | "en" | "ta" | "te" | "bn" | "kn"
    classified_scam_type: str
    scam_probability: float
    rakshak_response: str           # chatbot response
    status: str                     # "received" | "forwarded_ncrb" | "resolved"
    ncrb_ref: str                   # generated reference number
    created_at: datetime
```

### Collection: `agency_actions`
```python
class AgencyAction(BaseModel):
    action_id: str
    case_id: str
    agency: str                     # "I4C" | "Telecom_Nodal_Jio" | "Telecom_Nodal_Airtel" | "FIU_IND" | "State_Cyber_Cell"
    action_type: str                # "telecom_block" | "account_freeze" | "victim_alert_sms" | "dispatch_team" | "broadcast_alert"
    operator: str
    timestamp: datetime
    details: str
    success: bool
```

### Collection: `counterfeit_checks`
```python
class CounterfeitCheck(BaseModel):
    check_id: str
    timestamp: datetime
    denomination: int                # 10 | 20 | 50 | 100 | 200 | 500 | 2000
    verdict: str                     # "likely_genuine" | "suspicious" | "likely_counterfeit"
    confidence: float                # 0.0-1.0 heuristic confidence, NOT a trained-model probability
    checks_performed: List[str]      # e.g. ["microprint_zone_check", "serial_font_consistency", "security_thread_position", "uv_feature_simulation"]
    checks_failed: List[str]         # subset of checks_performed that failed
    image_hash: str                  # SHA-256 of uploaded image (image itself is NOT persisted — see Security section)
    location_city: str | None
    operator_type: str                # "citizen" | "bank_teller" | "field_officer"
    ground_truth_is_fake: bool        # synthetic label, used only for accuracy reporting in metrics_service
    created_at: datetime
```
> **Scope note:** This is a rules-based / heuristic proof-of-concept (region-based microprint and serial-pattern checks against public RBI note specifications), NOT a trained deep-learning classifier. See Section 11 for the full rationale and implementation.

### Collection: `detection_metrics`
```python
class DetectionMetricsSnapshot(BaseModel):
    snapshot_id: str
    computed_at: datetime
    module: str                      # "scam_detection" | "counterfeit_check"
    precision: float                 # TP / (TP + FP), computed against ground_truth labels in synthetic data
    recall: float                    # TP / (TP + FN)
    false_positive_rate: float       # FP / (FP + TN) — citizen-facing tools must stay very low
    avg_lead_time_seconds: float     # avg detected_at_seconds across scam cases — "detection before mass victimisation"
    sample_size: int
```

---

## 5. BACKEND IMPLEMENTATION

### `backend/main.py`
```python
"""
RAKSHAK AI — FastAPI Backend
Digital Public Safety Intelligence Platform
"""
# Configure FastAPI with:
# - Title: "RAKSHAK AI API"
# - Version: "1.0.0"
# - CORS: Allow origins from CORS_ORIGINS env var
# - Rate limiting via slowapi: 30 req/min per IP globally
# - Lifespan: on startup → connect MongoDB, seed if empty, init graph service
# - Include all routers with prefix /api:
#   - auth.router       → /api/auth
#   - scam_detection    → /api/scam
#   - graph_intelligence → /api/graph
#   - citizen_shield    → /api/citizen
#   - geospatial        → /api/geo
#   - dashboard         → /api/dashboard
#   - counterfeit_detection → /api/counterfeit
# - GET /api/health → return {status: "operational", version: "1.0.0", timestamp}
# - 404 handler → return JSON {detail: "Endpoint not found"}
# - Exception handler → log error, return {detail: "Internal error", error_id: uuid}
```

### `backend/services/gemini_service.py`

Implement `GeminiService` class with these methods:

#### `analyze_scam_text(text: str) -> dict`
Use this EXACT prompt (do not modify):
```
You are a cybercrime detection AI for India's Ministry of Home Affairs (MHA).
Analyze the following text for digital arrest scam indicators.

KNOWN SCAM PATTERNS:
1. Digital Arrest: Impersonating CBI/ED/Police, claiming "digital arrest" on video call
2. Customs Duty: Fake parcel interception, drug/money link, demands payment
3. TRAI Disconnection: Threatens SIM/number cancellation for illegal activity
4. Aadhaar Misuse: Claims Aadhaar linked to crime, demands verification payment
5. KYC Fraud: Bank KYC expiry, account block threat, OTP request
6. Tax Refund: Fake income tax refund, requests bank details

RED FLAG PHRASES: "digital arrest", "parcel seized", "illegal drugs", "do not disconnect",
"CBI headquarters", "ED officer", "Customs Department", "your Aadhaar", "money laundering",
"stay on video call", "do not tell anyone", "judicial custody", "pay fine immediately"

TEXT TO ANALYZE:
"{text}"

Respond ONLY with this exact JSON (no markdown, no explanation):
{{
  "scam_probability": <float 0.0-1.0>,
  "scam_type": "<digital_arrest|customs_duty|trai_disconnection|aadhaar_misuse|kyc_fraud|tax_refund|legitimate>",
  "risk_triggers": ["<phrase1>", "<phrase2>"],
  "urgency_level": "<critical|high|medium|low>",
  "authority_impersonated": "<CBI|ED|TRAI|Customs|Police|IT_Dept|null>",
  "voice_script_match_percent": <int 0-100>,
  "caller_id_spoofed": <bool — true if text/metadata implies a masked or impersonated official number>,
  "call_metadata_anomalies": ["<e.g. voip_relay_detected, recent_sim_swap, shared_imei_cluster>"],
  "recommended_action": "<string>",
  "reasoning": "<1 sentence explanation>"
}}
```
> `caller_id_spoofed` and `call_metadata_anomalies` map directly to the problem statement's "number spoofing signatures" and "video call metadata" detection features — store both on `FraudCase`.

#### `analyze_fraud_network(graph_summary: dict) -> dict`
```
You are a financial crime analyst AI for the Intelligence Bureau of India.
Analyze this fraud network graph and provide intelligence assessment.

NETWORK DATA:
- Total nodes: {graph_summary['node_count']}
- Total edges: {graph_summary['edge_count']}
- Top hub nodes: {graph_summary['top_hubs']}
- Total transactions: ₹{graph_summary['total_amount_inr']:,}
- Geographic spread: {graph_summary['cities']}
- Victim count: {graph_summary['victim_count']}
- Suspect phone count: {graph_summary['suspect_count']}

Respond ONLY with this JSON:
{{
  "ring_type": "<hierarchical|hub_spoke|peer_to_peer|hybrid>",
  "operation_name": "<auto-generate a codename like 'OPERATION PHANTOM'>",
  "primary_hub_analysis": "<2 sentences about the central hub>",
  "estimated_total_victims_india": <int>,
  "financial_exposure_inr": <int>,
  "jurisdiction_flags": ["<state1>", "<state2>"],
  "cross_border_indicators": <bool>,
  "investigation_priority": "<critical|high|medium>",
  "recommended_agencies": ["<agency1>"],
  "evidence_strength": "<strong|moderate|weak>"
}}
```

#### `citizen_chat(message: str, language: str, city: str, scam_context: dict) -> str`
```
You are RAKSHAK, a friendly AI fraud protection assistant helping Indian citizens.
You work for India's Cyber Crime Prevention initiative.

IMPORTANT FACTS TO REMEMBER:
- Real government agencies NEVER call and demand immediate payment
- "Digital arrest" is NOT a legal concept in Indian law — it does not exist
- No government officer will ask you to stay on video call for hours
- TRAI/CBI/ED/Police never call to threaten you about a parcel
- Legitimate refunds from IT department are never processed over phone
- OTPs should NEVER be shared with anyone

CURRENT CONTEXT:
- User's city: {city}
- Detected scam probability: {scam_context.get('scam_probability', 'unknown')}
- Likely scam type: {scam_context.get('scam_type', 'unknown')}

USER MESSAGE (in {language}):
{message}

RESPOND IN {language} (use simple, clear language — imagine explaining to an elderly relative):
Structure your response exactly as:

VERDICT: [SCAM ⚠️ / SUSPICIOUS 🔍 / LIKELY SAFE ✅]

[2-3 sentences explaining why in simple terms]

WHAT TO DO NOW:
1. [Action 1]
2. [Action 2]  
3. [Action 3]

EMERGENCY HELPLINES:
📞 Cyber Crime: 1930 (24/7)
📞 National Police: 100
📱 Report online: cybercrime.gov.in

[1 reassuring closing sentence]

Keep total response under 250 words. Never use technical jargon.
```

#### `generate_evidence_summary(case: dict) -> str`
Generate a court-admissible summary paragraph for a fraud case.

### `backend/services/sarvam_service.py`

Implement `SarvamService` class:

#### `translate(text: str, source_lang: str, target_lang: str) -> str`
- Call Sarvam AI translation API
- Language codes: en-IN, hi-IN, ta-IN, te-IN, bn-IN, kn-IN, mr-IN, gu-IN
- Fallback: if Sarvam fails, return original text + "(translation unavailable)"

#### `text_to_speech(text: str, language: str) -> bytes`
- Call Sarvam TTS API
- Return audio bytes (MP3)
- Speaker: "meera" for female, "arjun" for male
- Fallback: return None gracefully

### `backend/services/pii_redactor.py`

Implement `PIIRedactor` class:

```python
"""
PII Redaction Engine — MANDATORY before any data storage or API exposure
Strips: Aadhaar numbers, PAN, phone numbers, bank accounts, names, addresses
"""

PATTERNS = {
    "aadhaar": r'\b\d{4}\s?\d{4}\s?\d{4}\b',
    "pan": r'\b[A-Z]{5}[0-9]{4}[A-Z]\b',
    "phone": r'\b(\+91|0)?[6-9]\d{9}\b',
    "bank_account": r'\b\d{9,18}\b',
    "ifsc": r'\b[A-Z]{4}0[A-Z0-9]{6}\b',
    "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    "name_prefix": r'\b(Mr\.|Mrs\.|Dr\.|Ms\.)\s[A-Z][a-z]+\b',
}

# Methods:
# redact(text: str) -> str — applies all patterns, replaces with [REDACTED_TYPE]
# mask_phone(phone: str) -> str — "+91 98765 43210" → "+91 98*** **210"
# mask_account(account: str) -> str — last 4 digits visible
# is_safe_to_store(text: str) -> bool — True if no PII detected
```

### `backend/services/evidence_hasher.py`

```python
"""
Evidence Hashing — Cryptographic chain of custody for legal admissibility
Every piece of evidence gets SHA-256 hash + timestamp on ingestion
"""

import hashlib
import json
from datetime import datetime, timezone

class EvidenceHasher:
    @staticmethod
    def hash_content(content: str, timestamp: datetime = None) -> tuple[str, datetime]:
        """
        Returns (sha256_hex_string, hash_timestamp)
        timestamp is UTC, immutable once set
        Combine content + timestamp for hash to prevent pre-image attacks
        """
        if not timestamp:
            timestamp = datetime.now(timezone.utc)
        
        payload = f"{content}|{timestamp.isoformat()}"
        hash_value = hashlib.sha256(payload.encode('utf-8')).hexdigest()
        return hash_value, timestamp
    
    @staticmethod
    def verify_integrity(content: str, stored_hash: str, stored_timestamp: datetime) -> bool:
        """Verify content hasn't been tampered with"""
        computed_hash, _ = EvidenceHasher.hash_content(content, stored_timestamp)
        return computed_hash == stored_hash
    
    @staticmethod
    def generate_evidence_package(case_id: str, content: str, metadata: dict) -> dict:
        """
        Generate court-admissible evidence package with:
        - content_hash: SHA-256 of redacted content
        - metadata_hash: SHA-256 of metadata JSON
        - chain_hash: SHA-256 of (content_hash + metadata_hash)
        - timestamp: UTC ISO format
        - case_id: for cross-reference
        """
```

### `backend/services/graph_service.py`

Implement `GraphService` class using NetworkX:

```python
"""
Fraud Network Graph Intelligence
Maintains in-memory NetworkX graph synced with MongoDB
Provides: PageRank, betweenness centrality, connected components, hub detection
"""

class GraphService:
    def __init__(self):
        self.G = nx.DiGraph()  # Directed graph
    
    # build_from_db(nodes: list, edges: list) → loads MongoDB data into NetworkX
    # add_node(node: GraphNode) → adds to both NetworkX and queues MongoDB upsert
    # add_edge(edge: GraphEdge) → adds to both
    # compute_pagerank() → returns {node_id: score} dict
    # compute_centrality() → betweenness centrality for all nodes
    # find_hubs(threshold: float = 0.05) → nodes above PageRank threshold
    # find_fraud_rings() → connected components with 3+ suspect nodes
    # get_subgraph(node_id: str, depth: int = 2) → ego network around node
    # to_cytoscape_format() → convert to {nodes: [], edges: []} for Cytoscape.js
    # get_summary_stats() → dict for Gemini network analysis
    # find_cross_jurisdiction_rings() → for each connected component, collect
    #   distinct victim_location states across all connected_cases; if a
    #   component touches 2+ states, mark all its nodes is_cross_jurisdiction=True
    #   and set linked_states accordingly. Directly supports the problem statement's
    #   "link across jurisdictions" requirement for court-admissible evidence packages.
```

### `backend/services/audio_service.py`

```python
"""
Audio Processing Pipeline
Transcribes audio → detects voice spoofing → analyzes for scam content
"""

class AudioService:
    def __init__(self):
        # Load Whisper 'base' model on startup (not 'large' — too slow)
        self.whisper_model = whisper.load_model("base")
    
    async def transcribe_audio(self, audio_bytes: bytes, language: str = None) -> dict:
        """
        Save bytes to temp file → run Whisper → return {text, language, segments}
        language hint: "hi" for Hindi, "en" for English, None for auto-detect
        """
    
    async def detect_voice_spoofing(self, audio_bytes: bytes) -> dict:
        """
        Simple heuristic voice spoofing detection:
        - Extract audio features: pitch variance, speaking rate, silence patterns
        - Deepfake AI voices tend to have: unusual flatness in pitch, 
          too-perfect timing, minimal background noise
        - Use librosa for feature extraction
        - Return: {spoof_probability: float, confidence: str, indicators: list}
        """
    
    async def analyze_audio_file(self, audio_bytes: bytes) -> dict:
        """
        Full pipeline: transcribe → detect spoofing → analyze text for scam
        Returns combined analysis dict
        """
```

### `backend/services/counterfeit_service.py`

```python
"""
Counterfeit Currency Check — heuristic, rules-based proof-of-concept.
NOT a trained deep-learning classifier (no restricted training image dataset
required — see Section 11 for scope rationale).

Uses OpenCV + Pillow to run structural checks against public RBI note
specifications (security thread position, microprint zone presence,
serial number font/spacing consistency, latent image region contrast).
"""

class CounterfeitService:
    def __init__(self):
        # Load backend/data/note_security_features.json:
        # per-denomination reference regions (as % of image width/height)
        # for security thread, microprint zone, serial number band, latent image
        self.reference_features = self._load_reference_features()

    async def analyze_note_image(self, image_bytes: bytes, denomination: int) -> dict:
        """
        Pipeline:
        1. Load image via Pillow, convert to OpenCV array, normalize size/orientation
        2. check_security_thread_position(img, denomination) -> bool
        3. check_microprint_zone_sharpness(img, denomination) -> bool
           (Laplacian variance in expected zone; blurry/absent microprint = fail)
        4. check_serial_number_consistency(img, denomination) -> bool
           (font height/spacing variance across serial characters via contour detection)
        5. simulate_uv_feature_region(img, denomination) -> bool
           (checks presence/contrast of the expected latent-image band; labeled
           clearly in the UI as a SIMULATED check — no real UV sensor input)
        6. Aggregate: checks_failed = [failed check names]
           - 0 failed -> "likely_genuine"
           - 1 failed -> "suspicious"
           - 2+ failed -> "likely_counterfeit"
        7. confidence = 1 - (checks_failed_count / total_checks), heuristic only
        Returns: {verdict, confidence, checks_performed, checks_failed}

        IMPORTANT: Do NOT persist the uploaded image — hash it (SHA-256) for the
        audit record and discard the bytes immediately after analysis (see Section 12).
        """
```

### `backend/services/metrics_service.py`

```python
"""
Detection Metrics — computes the evaluation-relevant stats judges will look for:
precision, recall, false positive rate, and average detection lead time.
Runs against the synthetic dataset's ground_truth_* labels (never against
real user data, since ground truth doesn't exist for real cases).
"""

class MetricsService:
    async def compute_scam_detection_metrics(self) -> dict:
        """
        Pull all FraudCase + CitizenReport records with ground_truth_is_scam set.
        predicted_positive = scam_probability > 0.5
        TP = predicted_positive AND ground_truth_is_scam
        FP = predicted_positive AND NOT ground_truth_is_scam
        FN = NOT predicted_positive AND ground_truth_is_scam
        TN = NOT predicted_positive AND NOT ground_truth_is_scam
        precision = TP / (TP + FP)
        recall = TP / (TP + FN)
        false_positive_rate = FP / (FP + TN)
        avg_lead_time_seconds = mean(detected_at_seconds) across TP cases
        Save a DetectionMetricsSnapshot(module="scam_detection", ...) and return it.
        """

    async def compute_counterfeit_metrics(self) -> dict:
        """
        Same TP/FP/FN/TN logic against CounterfeitCheck.ground_truth_is_fake
        and verdict != "likely_genuine" as the positive prediction.
        Save a DetectionMetricsSnapshot(module="counterfeit_check", ...) and return it.
        """
```

---

## 6. API ROUTES SPECIFICATION

### `backend/routers/auth.py`

```
POST /api/auth/login
  Body: {username: str, password: str}
  Returns: {access_token: str, token_type: "bearer", expires_in: 86400}
  Logic: verify bcrypt hash, issue JWT with sub=username, exp=24h
  
GET /api/auth/me
  Header: Authorization: Bearer <token>
  Returns: {username: str, role: "operator"}
```

### `backend/routers/scam_detection.py`

```
POST /api/scam/analyze-text
  Body: {text: str, language: str = "en", case_id: str = None}
  Auth: Optional (higher rate limit with auth)
  Process:
    1. Validate text length (10-5000 chars)
    2. PIIRedactor.redact(text) → redacted_text
    3. GeminiService.analyze_scam_text(redacted_text) → analysis
    4. EvidenceHasher.hash_content(text) → (hash, timestamp)
    5. If analysis.scam_probability > 0.5: save to fraud_cases collection
    6. Return full analysis + case_id if saved
  Returns: {
    case_id, scam_probability, scam_type, risk_triggers, 
    urgency_level, authority_impersonated, script_match_percent,
    recommended_action, evidence_hash, is_scam: bool
  }

POST /api/scam/analyze-audio
  Body: multipart/form-data with audio file (mp3/wav/ogg, max 10MB)
  Process:
    1. Validate file type and size
    2. AudioService.analyze_audio_file(bytes) → {transcript, spoof_score, scam_analysis}
    3. PIIRedactor.redact(transcript)
    4. Save ScamTranscript to DB
    5. Return combined result
  Returns: {transcript, spoof_probability, scam_analysis, case_id, evidence_hash}

GET /api/scam/threats/live
  Auth: Required
  Query params: limit=20, urgency_level=all
  Returns: List of most recent FraudCase objects sorted by timestamp desc
  Add X-Total-Count header with total count

GET /api/scam/templates
  Returns: contents of scam_templates.json — list of known scam script patterns
  
POST /api/scam/action/block
  Auth: Required
  Body: {case_id: str, reason: str}
  Process: Update case status → "blocked", add AgencyAction record (type: telecom_block)
  Returns: {success: bool, action_id: str}

POST /api/scam/action/alert-victim
  Auth: Required
  Body: {case_id: str, channel: "sms"|"whatsapp"}
  Process: Add AgencyAction record (type: victim_alert_sms), simulate send
  Returns: {success: bool, action_id: str, simulated: true}
```

### `backend/routers/counterfeit_detection.py`

```
POST /api/counterfeit/analyze-note
  Body: multipart/form-data with note image (jpg/png, max 8MB) + denomination: int
  Rate limit: 10 req/min per IP
  Process:
    1. Validate file type/size and denomination (10|20|50|100|200|500|2000)
    2. CounterfeitService.analyze_note_image(bytes, denomination) → {verdict, confidence, checks_performed, checks_failed}
    3. hash image bytes (SHA-256) for audit trail — DISCARD the image bytes, never persist them
    4. Save CounterfeitCheck record (image NOT stored, only image_hash)
  Returns: {
    check_id, verdict, confidence, checks_performed, checks_failed,
    denomination, disclaimer: "Heuristic proof-of-concept — not a substitute for RBI-certified verification"
  }

GET /api/counterfeit/denominations
  Returns: [10, 20, 50, 100, 200, 500, 2000] with reference feature descriptions per denomination

GET /api/counterfeit/checks/recent
  Auth: Required
  Returns: Last 20 CounterfeitCheck records (for command center visibility)
```

### `backend/routers/graph_intelligence.py`

```
GET /api/graph/network
  Auth: Required
  Returns: Full graph in Cytoscape format {nodes: [...], edges: [...]}
  Also includes: {stats: {node_count, edge_count, hub_count, total_transactions_inr}}

GET /api/graph/case/{case_id}
  Auth: Required
  Returns: Ego network around case (depth=2), Cytoscape format

POST /api/graph/analyze
  Auth: Required
  Process:
    1. GraphService.compute_pagerank() — update all node scores in DB
    2. GraphService.compute_centrality() — update centrality scores
    3. GraphService.find_hubs() — mark hub nodes
    4. GeminiService.analyze_fraud_network(graph_summary) → intelligence report
  Returns: {hubs: [...], rings: [...], gemini_intelligence: dict, computed_at: datetime}

GET /api/graph/top-hubs
  Returns: Top 10 nodes by PageRank score with full node details, including
    linked_states and is_cross_jurisdiction for each node

GET /api/graph/cross-jurisdiction-rings
  Auth: Required
  Returns: Fraud rings where is_cross_jurisdiction=True, grouped by ring with
    linked_states list — directly supports inter-state/inter-agency coordination

POST /api/graph/add-report
  Body: {caller_number: str, victim_city: str, scam_type: str, amount_inr: int}
  Process: Create/update graph nodes and edges for this report
  Returns: {nodes_added: int, edges_added: int, connected_to_existing_ring: bool}
```

### `backend/routers/citizen_shield.py`

```
POST /api/citizen/chat
  Body: {
    message: str,         # user input (max 500 chars)
    language: str,        # "hi"|"en"|"ta"|"te"|"bn"|"kn"
    city: str,
    session_id: str       # client-generated, for conversation context
  }
  Rate limit: 5 req/min per IP (prevent abuse)
  Process:
    1. Validate input
    2. GeminiService.analyze_scam_text(message) → quick scam check
    3. GeminiService.citizen_chat(message, language, city, scam_context) → response
    4. Optionally: SarvamService.text_to_speech(response, language) → audio
    5. PIIRedactor — never store raw user message
    6. Save CitizenReport with hashed phone
  Returns: {
    response_text: str,
    audio_url: str|null,
    verdict: "SCAM"|"SUSPICIOUS"|"LIKELY_SAFE",
    scam_probability: float,
    emergency_contacts: dict,
    ncrb_ref: str
  }

POST /api/citizen/report
  Body: {description: str, phone_hash: str, language: str, city: str}
  Returns: {report_id: str, ncrb_ref: str, status: "received"}

GET /api/citizen/emergency-contacts
  Returns: {
    cyber_crime: "1930",
    national_police: "100",
    women_helpline: "181",
    ncrb_portal: "cybercrime.gov.in",
    i4c_email: "cybercrime@hq.crpf.gov.in",
    state_contacts: {Delhi: "...", Mumbai: "...", ...}
  }

GET /api/citizen/verify-caller
  Query: caller_number=+919876543210
  Returns: {
    is_government_number: bool,
    is_known_scam_number: bool,
    match_count: int,
    warning_level: str,
    known_scam_type: str|null
  }

POST /api/citizen/ivr-webhook
  Body: {caller_number: str, dtmf_input: str, call_sid: str}
  Status: STUB — accepts and logs the payload, runs it through the same
    GeminiService.analyze_scam_text() pipeline as /api/citizen/chat, returns a
    verdict string suitable for IVR text-to-speech playback.
  NOTE (roadmap): full IVR requires a telephony provider (e.g. Twilio, Exotel)
    to originate/receive calls — out of scope for hackathon build, but this
    endpoint proves the integration point exists. Mention in README as
    "IVR channel: integration-ready, pending telephony provider account."
```

### `backend/routers/geospatial.py`

```
GET /api/geo/heatmap
  Returns: GeoJSON FeatureCollection of all crime locations
  Each feature: {type: "Feature", geometry: {type: "Point", coordinates: [lng, lat]},
    properties: {crime_type, severity, city, timestamp, case_id}}

GET /api/geo/hotspots
  Query: limit=20, crime_type=all
  Returns: Top N locations by crime density, with H3 hex indices

GET /api/geo/clusters
  Returns: H3 hexagonal aggregation at resolution 7
  Each hex: {h3_index, center_lat, center_lng, crime_count, dominant_type, severity}

GET /api/geo/mule-locations
  Auth: Required
  Returns: Money mule withdrawal location cluster GeoJSON

GET /api/geo/city-stats
  Returns: Per-city crime statistics for all tracked cities

GET /api/geo/patrol-priority
  Auth: Required
  Query: limit=5
  Process: Rank H3 hexagons by a weighted score = (incident_count × recency_weight),
    recency_weight decays over the last 7 days so fresh clusters outrank old resolved ones
  Returns: Top N hexagons: [{h3_index, center_lat, center_lng, priority_score,
    incident_count, dominant_crime_type, recommended_action: str}]
  Directly supports "enabling patrol prioritisation, resource deployment" from
  the problem statement's Geospatial Crime Pattern Intelligence area.
```

### `backend/routers/dashboard.py`

```
GET /api/dashboard/kpis
  Auth: Required
  Returns: {
    active_threats: int,
    victim_interventions_today: int,
    calls_blocked_today: int,
    mule_accounts_frozen: int,
    total_amount_protected_inr: int,
    vs_yesterday: {active_threats_delta: int, interventions_delta: int}
  }

GET /api/dashboard/summary
  Auth: Required
  Query: period=day|week|month
  Returns: Time-series stats for charts

GET /api/dashboard/threats/active
  Auth: Required
  Returns: Active fraud_cases sorted by urgency + timestamp, limit 50

POST /api/dashboard/broadcast
  Auth: Required
  Body: {message: str, target_agencies: list[str], case_id: str|null}
  Process: Create AgencyAction records for each agency
  Returns: {broadcast_id: str, agencies_notified: int}

GET /api/dashboard/agency-feed
  Auth: Required
  Returns: Recent AgencyAction records (last 20), formatted as coordination feed

GET /api/dashboard/metrics
  Auth: Required
  Process: MetricsService.compute_scam_detection_metrics() + compute_counterfeit_metrics()
  Returns: {
    scam_detection: {precision, recall, false_positive_rate, avg_lead_time_seconds, sample_size},
    counterfeit_check: {precision, recall, false_positive_rate, sample_size},
    computed_at: datetime
  }
  Directly answers the evaluation focus: "digital arrest scam detection precision
  and recall", "fraud network detection lead time", "false positive rate for
  citizen-facing tools (must be very low)"
```

---

## 7. SYNTHETIC DATA GENERATION

### `backend/data/scam_templates.json`

Create a JSON array of 30 scam script templates covering all scam types.
Each template: `{id, type, authority, template_text, keywords, severity}`

Example templates to include:
```json
[
  {
    "id": "DA001",
    "type": "digital_arrest",
    "authority": "CBI",
    "template_text": "This is CBI headquarters New Delhi. Your Aadhaar number has been used to send a package containing illegal substances from Mumbai to Cambodia. You are hereby under digital arrest. Do not disconnect this call or inform anyone. Stay on video call until further instruction.",
    "keywords": ["CBI headquarters", "digital arrest", "do not disconnect", "illegal substances", "Cambodia"],
    "severity": "critical"
  },
  {
    "id": "CD001",
    "type": "customs_duty",
    "authority": "Customs",
    "template_text": "This is Indian Customs Department. A parcel registered under your mobile number has been seized at Delhi airport. It contains 2 kg of narcotics and Rs 50 lakh in foreign currency. To avoid arrest, you must pay a customs fine of Rs 85,000 immediately.",
    "keywords": ["Customs Department", "parcel seized", "narcotics", "pay fine immediately"],
    "severity": "critical"
  }
  // ... 28 more covering all scam types
]
```

### `backend/data/indian_cities.json`

```json
[
  {"name": "Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090, "population_millions": 32.9},
  {"name": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777, "population_millions": 20.7},
  {"name": "Bengaluru", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946, "population_millions": 13.6},
  {"name": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867, "population_millions": 10.3},
  {"name": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707, "population_millions": 10.9},
  {"name": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639, "population_millions": 14.8},
  {"name": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567, "population_millions": 7.4},
  {"name": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714, "population_millions": 8.4},
  {"name": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873, "population_millions": 3.9},
  {"name": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462, "population_millions": 3.6},
  {"name": "Surat", "state": "Gujarat", "lat": 21.1702, "lng": 72.8311, "population_millions": 6.5},
  {"name": "Patna", "state": "Bihar", "lat": 25.5941, "lng": 85.1376, "population_millions": 2.2},
  {"name": "Bhopal", "state": "Madhya Pradesh", "lat": 23.2599, "lng": 77.4126, "population_millions": 2.4},
  {"name": "Nagpur", "state": "Maharashtra", "lat": 21.1458, "lng": 79.0882, "population_millions": 2.9},
  {"name": "Chandigarh", "state": "Punjab/Haryana", "lat": 30.7333, "lng": 76.7794, "population_millions": 1.1}
]
```

### `backend/data/note_security_features.json`

Reference regions (as % of note image width/height) per denomination, based on
publicly documented RBI note design descriptions — used by `CounterfeitService`
to know WHERE to look, not to store any proprietary/restricted material:

```json
{
  "500": {
    "security_thread_x_pct": [0.42, 0.48],
    "microprint_zone": {"x_pct": [0.15, 0.35], "y_pct": [0.55, 0.65]},
    "serial_number_band": {"x_pct": [0.60, 0.92], "y_pct": [0.08, 0.14]},
    "latent_image_region": {"x_pct": [0.80, 0.90], "y_pct": [0.30, 0.55]}
  },
  "2000": { "...": "same structure, different reference coordinates" }
}
```

### `backend/data/generate_synthetic.py`

Generate exactly these datasets:

```python
"""
Generates all synthetic data for RAKSHAK AI demo
Run: python generate_synthetic.py
Outputs: seeds MongoDB with realistic fraud data
"""

# Generate:
# 500 FraudCase records with:
#   - Weighted distribution: digital_arrest (40%), customs_duty (25%), 
#     trai_disconnection (15%), aadhaar_misuse (10%), others (10%)
#   - Urgency: critical (20%), high (35%), medium (30%), low (15%)
#   - Status: active (30%), investigating (25%), blocked (35%), resolved (10%)
#   - Timestamps: last 30 days, weighted toward recent days
#   - Realistic victim names (first letter + surname, city-appropriate)
#   - Amount at risk: ₹10k-₹25L range, lognormal distribution
#   - scam_probability: 0.75-0.99 (these are confirmed/near-confirmed cases)
#   - voice_spoof_confidence: 0.60-0.95
#   - Realistic caller numbers (masked format)
#   - caller_id_spoofed: True for ~85% of cases (realistic for these scam types)
#   - call_metadata_anomalies: 1-3 sampled from ["voip_relay_detected",
#     "recent_sim_swap", "shared_imei_cluster", "burner_device_signature"]
#   - detected_at_seconds: 30-600 range (skew toward faster detection for
#     high scam_probability cases) — feeds avg_lead_time_seconds metric
#   - ground_truth_is_scam: True for 90% of these records, False for a
#     deliberately-included 10% "hard negative" set (legitimate-sounding
#     calls with borderline scam_probability 0.4-0.6) so precision/recall/
#     false-positive-rate are computable and non-trivial, not just 100%

# 800 GraphNode records:
#   - 200 suspect_phone nodes (linked to multiple victims)
#   - 300 victim nodes
#   - 150 mule_account nodes  
#   - 100 ip_address nodes
#   - 50 fraud_compound nodes (cluster of operations)
#     - Distribute fraud_compound linked_states so ~40% span 2+ states
#       (is_cross_jurisdiction=True) — realistic since these rings recruit
#       mules/victims nationally
#   - Calculate realistic PageRank after creating edges

# 1200 GraphEdge records connecting above nodes

# 600 CrimeLocation records:
#   - 300 victim_cluster locations (spread across residential areas)
#   - 150 mule_withdrawal locations (near ATMs/bank branches)
#   - 100 fraud_compound locations (weighted toward Delhi, Mumbai, Bengaluru)
#   - 50 suspect_phone origin locations (international: Pakistan, Myanmar, Cambodia)
#   - Add slight jitter (±0.01 lat/lng) to realistic city coords

# 300 CitizenReport records with multilingual descriptions
#   - Include ground_truth_is_scam on a 10% subsample for FP-rate reporting

# 120 CounterfeitCheck records:
#   - Distributed across denominations, weighted toward ₹500 and ₹2000
#     (matches RBI's reported high-denomination FICN seizure trend)
#   - verdict distribution: likely_genuine (70%), suspicious (20%),
#     likely_counterfeit (10%)
#   - operator_type: citizen (50%), bank_teller (35%), field_officer (15%)
#   - ground_truth_is_fake: aligned with verdict for ~85% of records, with
#     a deliberate 15% mismatch (hard cases) so accuracy isn't trivially 100%
#   - image_hash: random SHA-256-shaped hex string (no real images generated/stored)

# 5 KPI Snapshot records (one per day for last 5 days)
#   - Active threats: 18-28 range
#   - Daily interventions: 120-180
#   - Calls blocked: 45-85
#   - Amount protected: ₹50L-₹2Cr

# 50 AgencyAction records with realistic coordination messages

# 2 DetectionMetricsSnapshot records (one for scam_detection, one for
#   counterfeit_check) — pre-computed once at seed time so the dashboard
#   has metrics to show immediately, then recomputed live via
#   GET /api/dashboard/metrics on demand
```

---

## 8. FRONTEND — LANDING PAGE (`src/app/page.tsx`)

**Design Reference:** Image 2 (Sentinel AI design) — Obsidian & Lime glassmorphism.
Implement EXACTLY this visual style: dark (#0a0a0a) background, #ccff00 lime accent.

### Import These Google Fonts in layout.tsx:
```
Space Grotesk: 300, 400, 500, 600, 700
JetBrains Mono: 400, 500, 700
```

### Tailwind custom config additions:
```js
colors: {
  lime: { DEFAULT: '#ccff00', dark: '#a3cc00' },
  obsidian: { DEFAULT: '#0a0a0a', surface: '#0c0c0c', card: '#111111' },
},
fontFamily: {
  grotesk: ['Space Grotesk', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

### Landing Page Sections (in order):

**1. NAVBAR**
- Fixed top, `backdrop-blur-xl`, `bg-black/20`, `border-b border-white/10`
- Left: Lime square logo (`S` initial, `bg-[#ccff00] text-black font-bold rounded-xl`) + "RAKSHAK AI" in Space Grotesk
- Center: Pill nav with links: INTELLIGENCE · NETWORKS · CITIZEN SHIELD · COUNTERFEIT CHECK · CASE STUDIES
  - `bg-white/5 backdrop-blur rounded-full px-6 py-2`
  - Links: `text-white/70 hover:text-white text-sm`
- Right: Pulsing lime dot + "LIVE SYSTEM" in JetBrains Mono (uppercase, `text-[10px]`) + "SECURE ACCESS" button (white, rounded-full)

**2. HERO SECTION**
- Full height section, grid 12 cols
- Left (7 cols):
  - Top tag: `[AGENTIC AI · SECURITY INFRASTRUCTURE]` in JetBrains Mono, `text-[#ccff00] text-xs uppercase tracking-widest`
  - Giant heading: `font-grotesk font-bold text-[7rem] leading-[0.85] tracking-[-0.04em]`
    ```
    DEFEAT THE
    INVISIBLE  ← this word: italic, gradient text from #ccff00 to white
    THREAT.
    ```
  - Subtext: "India's first AI-powered Digital Public Safety Intelligence platform. We shift the needle from reactive complaint filing to predictive threat neutralisation of digital arrest scams." — `text-white/60 text-lg max-w-lg mt-8`
  - Two CTA buttons:
    - Primary: `bg-[#ccff00] text-black font-bold rounded-full px-8 py-4 hover:scale-105 shadow-[0_0_30px_rgba(204,255,0,0.3)]` → "DEPLOY DEFENSE →"
    - Secondary: `border border-white/20 text-white rounded-full px-8 py-4 hover:border-white/50` → "VIEW LIVE DEMO"
- Right (5 cols): Glassmorphism mockup card
  - Dark glass card: `bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6`
  - Inside: "ANOMALY DETECTION" label + bar chart (5 bars, CSS-animated, varying heights, lime/red colors)
  - Floating card 1 (top-right, animated float): `bg-[#ccff00] text-black rounded-xl p-3 text-xs font-mono` — "REAL-TIME PROTECTION ACTIVE"
  - Floating card 2 (bottom-left, slower float): glass card — "CF OPERATIONS DETECTED · Fraud Compound: Region 7A"
  - Floating card 3: glass card — "VOICE FINGERPRINT · 99.4% MATCH · Ident-Red: 'Officer Khanna' Alias"

**Add these CSS keyframes:**
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes pulse-lime {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

**3. STATS STRIP**
- Black background, full width
- Horizontal strip with 4 stats separated by vertical lines:
  - "₹1,776 Cr" / "Lost to digital arrest scams in 9 months of 2024"
  - "1.14M" / "Cybercrime complaints in 2023 (+60% YoY)"
  - "< 2 min" / "RAKSHAK average threat detection time"
  - "12 languages" / "Citizen Shield multilingual coverage"
- Numbers in lime color, JetBrains Mono, large

**4. FEATURES BENTO GRID**
- `grid-cols-4 gap-4 p-8`
- All cards: `rounded-[2.5rem] border border-white/10 p-8`
- Large card (2×2): Fraud Network Map visualization — radar-style SVG animation with node connections
- Tall card (1×2): Scam Type Distribution — vertical bar chart with lime bars
- Accent card (solid `#ccff00` background): "500+ SCAM PATTERNS IDENTIFIED" with noise texture overlay
- Small cards: Voice Spoofing Detection, Geospatial Intelligence, Multi-Agency Coordination, Evidence Hashing

**5. CTA SECTION (Contrast Section)**
- Light grey background `#e5e5e5`, dark text `#000`
- Rounded top corners `rounded-t-[4rem]`
- Headline: "From complaint filing to threat neutralisation in under 2 minutes"
- 3-step process with numbered circles (01, 02, 03) in JetBrains Mono

**6. FOOTER**
- Obsidian black `#000`
- Massive watermark: "RAKSHAK" at `font-size: 10rem, opacity: 0.05` centered
- Large lime CTA button
- 3-column: links + social circles + copyright in JetBrains Mono

---

## 9. FRONTEND — COMMAND CENTER DASHBOARD (`src/app/dashboard/page.tsx`)

**Design Reference:** Image 3 + the HTML code provided in document 3.
Implement the EXACT design from that HTML but built as React components with LIVE DATA from the API.

### Layout: 3-column, full viewport height
```
[Header — full width]
[Left 400px fixed] [Center flex-1] [Right 350px fixed]
```

### `DashboardHeader.tsx`
- Background: `bg-slate-950 border-b border-slate-800`
- Left: Blue shield icon + "NATIONAL DIGITAL THREAT COMMAND" (bold uppercase) + "MHA Cyber Intelligence Unit · Node Alpha"
- Right: System Status (green pulsing dot + "Operational") + Live clock IST (updates every second) + "Counterfeit Check" link (routes to `/counterfeit`) + Operator button
- Clock: Use `useEffect` with `setInterval(1000)` to update IST time

### `KPICards.tsx`
- 2-column grid
- Active Threats card: large red number + trending indicator
- Victim Interventions card: large green number + "Today" label
- Fetch from `GET /api/dashboard/kpis` every 30 seconds

### `DetectionMetrics.tsx`
- Small stat strip, placed directly below `KPICards`
- Fetch from `GET /api/dashboard/metrics`
- 3 compact stats in a row: "Precision" · "Recall" · "Avg. Lead Time" (formatted as "Xs" or "Xm")
- Small secondary row: "False Positive Rate" (highlight in green if < 5%, amber otherwise — citizen-tool FP rate must read as low)
- Tooltip on hover: "Computed against labeled synthetic evaluation data" (transparent about methodology)
- This directly surfaces the evaluation focus criteria (precision, recall, lead time, false positive rate) for judges reviewing the live demo

### `LiveThreatStream.tsx`
- Header: pulsing red dot + "LIVE SCAM DETECTIONS" + "AI Confidence > 85%" badge
- Scrollable list of `ThreatCard` components
- Fetch from `GET /api/scam/threats/live` every 15 seconds
- Auto-scroll to top when new threats arrive

### `ThreatCard.tsx`
Props: `{case: FraudCase}`
- Urgency-based styling: critical=red, high=amber, medium=yellow
- Show: badge (CRITICAL/HIGH/MEDIUM), timestamp, title (scam type friendly name), victim (first name + city), spoofed caller (masked), script match %, confidence score
- Two action buttons for critical cases: "Block Telecom" (red) + "Alert Victim" (slate)
- `onClick`: open detail panel (or expand in-place)

### `LiveIncidentMap.tsx`
- Use **Mapbox GL JS** via `react-map-gl` (NOT react-leaflet/Leaflet)
- Map style: `mapbox://styles/mapbox/dark-v11`
- Token: `process.env.NEXT_PUBLIC_MAPBOX_TOKEN`
- Initial view: India center `[20.5937, 78.9629]`, zoom 5
- Load the Map component via dynamic import with `ssr: false` (Mapbox GL JS requires `window`)
- Plot `CrimeLocation` data from `GET /api/geo/heatmap` as a GeoJSON `Source` (backend response format is unchanged — same GeoJSON FeatureCollection either way)
- Two `Layer`s on the same source:
  - **Heatmap layer** (visible at zoom < 8): density visualization of all crime locations
  - **Circle layer** (visible at zoom >= 8): individual markers, color-coded by `crime_type`:
    - victim_cluster: `#3b82f6` (blue)
    - mule_withdrawal: `#f59e0b` (amber)
    - fraud_compound: `#ef4444` (red), larger radius, pulsing CSS animation
- Smooth zoom-driven transition between heatmap and circle layers (native Mapbox GL paint-property interpolation, no plugins needed)
- Map legend overlay (bottom-left): 3 items
- Attribution: use Mapbox's default attribution control, add "© RAKSHAK AI" alongside it
- Pulsing ring animation on fraud_compound markers using CSS

**Setup requirements:**
- `frontend/next.config.ts` — add `transpilePackages: ['mapbox-gl']`
- `frontend/src/app/globals.css` — add `@import 'mapbox-gl/dist/mapbox-gl.css';`
- Mapbox free tier: 50,000 map loads/month (ample for hackathon demo use)

### `PatrolPriority.tsx`
- Narrow sidebar card, placed directly beside/below `LiveIncidentMap`
- Header: "SUGGESTED PATROL PRIORITY" + refresh icon button
- Fetch from `GET /api/geo/patrol-priority?limit=5`
- Ranked list (1-5), each row:
  - Rank badge + dominant crime type icon
  - City/area label (reverse-derived from h3_index center coords, or just show lat/lng rounded)
  - Priority score as a small horizontal bar
  - Incident count + `recommended_action` as a one-line caption
- Clicking a row: pan/zoom the Mapbox map to that hexagon's center (lift state up or use a shared context)
- Directly implements "patrol prioritisation, resource deployment" from the problem statement

### `FraudNetworkGraph.tsx`
- Use `react-cytoscapejs` (Cytoscape.js React wrapper)
- Fetch from `GET /api/graph/network`
- Node styling by type:
  - fraud_compound: `#ef4444`, size 40
  - suspect_phone: `#f59e0b`, size 25
  - mule_account: `#3b82f6`, size 22
  - victim: `#94a3b8`, size 16
  - ip_address: `#8b5cf6`, size 18
- Edge styling: `#475569`, width by transaction amount
- Layout: cose-bilkent (force-directed)
- Label: only show on hub nodes (pagerank > 0.05)
- Cross-jurisdiction indicator: nodes with `is_cross_jurisdiction: true` get a dashed outer ring (border-dasharray) + small badge in the node details panel listing `linked_states` — surfaces the "link across jurisdictions" requirement visually
- Header: "LINK ANALYSIS: OPERATION PHANTOM" + "Open Graph DB" button
- Click node: show node details panel (include `linked_states` and `is_cross_jurisdiction` in the panel body)

### `AIThreatAnalysis.tsx`
- Shows analysis for most recent critical threat
- Voice Spoofing Confidence: progress bar (amber)
- Script Match percentage: progress bar (red)
- Transcript snippet: mono font, dark bg
- Auto-updates when threat stream updates

### `AgencyCoordination.tsx`
- Header: "RESPONSE COORDINATION" + "{n} AGENCIES ONLINE" badge
- Scrollable list of AgencyAction records from `GET /api/dashboard/agency-feed`
- Each item: agency icon + name + timestamp + message
- Footer: "Issue Broadcast Alert" button → modal with message input

**IMPORTANT: Dashboard should work with mock/cached data if API is down.**
Add a `isDemoMode` flag — when true, use hardcoded demo data matching the design.

---

## 10. FRONTEND — CITIZEN FRAUD SHIELD (`src/app/citizen/page.tsx`)

**Design:** Clean, accessible dark interface. NOT the command center style.
- Background: `#0f172a`
- Large RAKSHAK AI header with shield icon
- Tagline: "Your AI-powered protection against digital fraud"

### Layout: Split screen
- Left (40%): Info panel
  - Emergency contacts with click-to-call links
  - "Is this caller legitimate?" quick check input
  - Common scam types illustrated cards
- Right (60%): Chat interface

### `LanguageSelector.tsx`
- Horizontal pill buttons: English · हिंदी · தமிழ் · తెలుగు · বাংলা · ಕನ್ನಡ
- Active: lime background black text
- Store selection in localStorage

### `ChatInterface.tsx`
- Chat window with message history
- Welcome message from RAKSHAK: "नमस्ते! I'm RAKSHAK, your fraud protection assistant. Describe any suspicious call or message you received and I'll tell you if it's a scam."
- Input: text area + submit button + optional audio upload
- Message bubbles: User (right, slate) + RAKSHAK (left, with shield icon)
- Show verdict prominently: SCAM ⚠️ / SUSPICIOUS 🔍 / LIKELY SAFE ✅
- Audio play button if TTS available
- Quick starter prompts:
  - "Someone claiming to be from CBI called me"
  - "I got a WhatsApp message about a parcel"
  - "My bank said my KYC will expire"

### `EmergencyContacts.tsx`
- Prominent card at top
- Cyber Crime Helpline: **1930** (big lime number)
- National Police: **100**
- Online portal: cybercrime.gov.in

---

## 11. FRONTEND — COUNTERFEIT CURRENCY CHECK MODULE (`src/app/counterfeit/page.tsx`)

**Scope framing (important for judges):** this module is a **heuristic, rules-based
proof-of-concept**, not a trained computer-vision classifier. It exists so the
platform addresses the "Counterfeit Currency Identification Agent" build area and
the "counterfeit detection accuracy across denominations" evaluation criterion
from the problem statement — without requiring restricted training image datasets
(consistent with the original scope-avoidance reasoning, now resolved by scoping
the CHECKS rather than skipping the FEATURE entirely). State this framing clearly
in the UI itself, not just the README — a small badge: "Heuristic Check · Prototype"

**Design:** Same dark command-center visual language as the dashboard (`bg-slate-950`),
but simpler — this is a single-purpose tool, not a multi-panel view.

### Layout
- Centered single-column, max-width 600px
- Header: "Counterfeit Currency Check" + prototype badge
- Denomination selector (pill buttons: ₹10 ₹20 ₹50 ₹100 ₹200 ₹500 ₹2000)
- Upload/capture area below

### `NoteScanner.tsx`
- Drag-and-drop or click-to-upload image area (`accept="image/jpeg,image/png"`)
- Mobile: use `capture="environment"` on the file input to open the rear camera directly
- Preview thumbnail of uploaded image before submission
- "Analyze Note" button → `POST /api/counterfeit/analyze-note`
- Loading state: "Running microprint, serial, and security-thread checks..."
- Clear the image from client memory immediately after the request completes (matches backend's no-persistence policy)

### `CounterfeitResult.tsx`
Props: `{result: CounterfeitCheckResult}`
- Verdict banner, color-coded:
  - likely_genuine: green — "✅ Likely Genuine"
  - suspicious: amber — "🔍 Suspicious — Recommend Manual Verification"
  - likely_counterfeit: red — "⚠️ Likely Counterfeit"
- Confidence shown as a progress bar, labeled "Heuristic Confidence" (not "AI Confidence" — avoid overstating certainty)
- List of `checks_performed`, with a ✅/❌ next to each based on `checks_failed`
- Persistent small-print disclaimer: "This is a prototype heuristic check based on public RBI note specifications. It does not replace RBI-certified verification equipment."
- "Check Another Note" button resets the flow

---

## 12. SECURITY IMPLEMENTATION

Implement ALL of these — judges will check for security awareness:

### JWT Authentication
```python
# utils/security.py
# - create_access_token(data: dict) → JWT string
# - verify_token(token: str) → payload dict or raise 401
# - get_current_user dependency → use in protected routes
# - Token blacklist in MongoDB (for logout)
```

### Rate Limiting
```python
# All public endpoints: 30 req/min per IP
# /api/citizen/chat: 5 req/min per IP (prevent spam)
# /api/scam/analyze-audio: 3 req/min per IP (heavy endpoint)
# /api/counterfeit/analyze-note: 10 req/min per IP
# Dashboard endpoints: 60 req/min (auth required, trusted clients)
# Add X-RateLimit-Remaining header to all responses
```

### Input Validation
```python
# Text inputs: max length 5000 chars, strip HTML, validate encoding
# Audio files: max 10MB, validate MIME type (audio/mpeg, audio/wav, audio/ogg only)
# Phone numbers: validate Indian format (+91XXXXXXXXXX)
# Coordinates: validate lat (-90 to 90), lng (-180 to 180)
# All MongoDB queries: use parameterized queries (motor does this natively)
# Never use $where, $eval, mapReduce in queries (NoSQL injection prevention)
```

### CORS
```python
# Allow only:
# - http://localhost:3000 (development)
# - https://rakshak-ai.vercel.app (production)
# - https://*.vercel.app (Vercel preview deploys)
# Disallow credentials=True on public endpoints
# Allow credentials=True only for /api/auth/
```

### PII Policy (MANDATORY)
```python
# NEVER store: raw phone numbers, full Aadhaar, bank account numbers, full names
# ALWAYS store: SHA-256 hash of phone, masked numbers ("98*** **456"), first name only
# NEVER log: request bodies containing user messages
# ALWAYS log: request metadata only (timestamp, IP, endpoint, response code)
# NEVER expose raw transcript_text via API — only redacted_text
```

### Image Handling Policy (Counterfeit Module)
```python
# NEVER persist uploaded note images to disk or MongoDB — process in-memory, discard immediately
# ALWAYS store only: SHA-256 hash of the image bytes (for audit trail), verdict, checks metadata
# Currency note images may contain incidental background/location info — treat as sensitive by default
```

### Evidence Integrity
```python
# SHA-256 hash every transcript on ingestion
# Store hash + UTC timestamp in same atomic MongoDB write
# Verify hash on read — if mismatch, flag as tampered
# Include hash + timestamp in all API responses for legal traceability
# Generate deterministic NCRB reference: f"NCRB-{year}-{city_code}-{uuid[:8].upper()}"
```

---

## 13. DEPLOYMENT CONFIGURATION

### `backend/Dockerfile`
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m spacy download en_core_web_sm
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### `backend/render.yaml`
```yaml
services:
  - type: web
    name: rakshak-ai-backend
    env: python
    buildCommand: pip install -r requirements.txt && python -m spacy download en_core_web_sm
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: MONGODB_URI
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: SARVAM_API_KEY
        sync: false
      - key: JWT_SECRET_KEY
        sync: false
```

### `frontend/next.config.ts`
```typescript
const config = {
  transpilePackages: ['mapbox-gl'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ]
  },
}
```

### `frontend/vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://rakshak-ai-backend.onrender.com"
  }
}
```

---

## 14. README.md REQUIREMENTS

Include EXACTLY:
1. Project banner image (create a dark header with project name)
2. One-line description
3. Architecture diagram (ASCII or link to image)
4. Live Demo links (both URLs)
5. Tech Stack badges
6. Feature list with checkboxes (all checked ✅)
7. Setup instructions (< 10 steps, copy-paste ready)
8. API Documentation link
9. Data Strategy section (transparent about synthetic data + open-source datasets)
10. Evidence Chain of Custody explanation
11. Judging Criteria alignment table (Innovation/Business Impact/Technical/Scalability/UX)
12. Detection Metrics section — state precision, recall, false positive rate, and avg
    lead time from `/api/dashboard/metrics`, with a line noting these are computed
    against labeled synthetic evaluation data
13. Scope Notes section — explicitly state: (a) Counterfeit Currency Check is a
    heuristic/rules-based prototype, not a trained CV classifier; (b) IVR channel
    is integration-ready (webhook stub built) but requires a telephony provider
    account to go live; be upfront rather than silent about these two so judges
    read them as informed scoping decisions, not gaps
14. Team section
15. License: MIT

---

## 15. DEMO VIDEO SCRIPT (3.5-4.5 minutes)

**Minute 0:00-0:40 — The Hook**
- Show real MHA statistic: "₹1,776 crore lost in 9 months of 2024"
- Show RAKSHAK AI landing page (Image 2 style)
- Voice: "India's cybercrime crisis is industrialized. RAKSHAK AI shifts the response from reactive filing to predictive neutralization."

**Minute 0:40-1:20 — Scam Detection Demo**
- Open Command Center dashboard (Image 3 style)
- Show Live Scam Detections panel with active threats
- Type a scam transcript into the analyze endpoint: "This is CBI headquarters. Your Aadhaar has been used to send illegal drugs. You are under digital arrest."
- Show Gemini returning: scam_probability: 0.97, type: digital_arrest, risk_triggers highlighted, caller_id_spoofed: true
- Show the threat appearing in the live stream with CRITICAL badge

**Minute 1:20-2:00 — Fraud Network + Map + Patrol Priority**
- Click on the map: show fraud compound clusters across India, heatmap collapsing into markers on zoom
- Point out the Patrol Priority sidebar: "top 5 hotspots ranked by density and recency — this is where we tell patrols to go next"
- Show the NetworkX graph: hub node in center (fraud compound), connected to 50+ victim nodes
- Point out the dashed-ring cross-jurisdiction badge on a hub node: "this ring touches 3 states — RAKSHAK flags it for inter-state coordination automatically"
- Trigger "Run Analysis": show PageRank running, Gemini generating "OPERATION PHANTOM" intelligence report
- Show: "3 primary hubs detected, ₹2.3 Cr exposure, cross-border indicators: Myanmar"

**Minute 2:00-2:35 — Citizen Shield**
- Switch to Citizen Fraud Shield page
- Select language: हिंदी
- Type: "CBI officer called me, said my Aadhaar is involved in drug case, asking me to stay on video call"
- Show RAKSHAK responding in Hindi: SCAM ⚠️ verdict with clear explanation
- Play Sarvam TTS audio response in Hindi

**Minute 2:35-3:05 — Counterfeit Currency Check**
- Switch to Counterfeit Check page, note the "Heuristic Check · Prototype" badge on screen
- Upload/select a ₹500 note image, select denomination
- Show the verdict banner + checks_performed list rendering (e.g. security thread ✅, microprint zone ❌)
- Voice: "A lightweight, rules-based check anyone — a citizen, a bank teller, a field officer — can run today, without needing a trained model or restricted training data."

**Minute 3:05-3:30 — Detection Metrics**
- Show the Detection Metrics strip on the dashboard: precision, recall, false positive rate, avg lead time
- Voice: "These numbers are computed against our labeled evaluation set — transparency on accuracy, not just a demo that looks good."

**Minute 3:30-4:15 — Architecture + Impact**
- Show architecture diagram (slide or in-app)
- Highlight: Gemini 1.5 Flash, MongoDB Atlas, SHA-256 evidence chain, 6 Indian languages, cross-jurisdiction linking
- End card: "50,000+ citizens can be protected daily at scale · Evidence packages court-admissible · 12 regional languages"

---

## 16. SUBMISSION CHECKLIST

Before submitting on Unstop, verify EVERY item:

**Code Quality:**
- [ ] All 55+ API routes return correct responses
- [ ] No hardcoded API keys in code (all in .env)
- [ ] All MongoDB writes use PII redaction
- [ ] SHA-256 hashing on all transcript ingestion
- [ ] Rate limiting active on all public endpoints
- [ ] CORS configured correctly for production URLs
- [ ] Authentication working on all protected routes
- [ ] Synthetic data seeded (500 cases, 800 nodes, 600 locations, 120 counterfeit checks)
- [ ] Frontend loads at Vercel URL with live API data
- [ ] All 4 pages functional: landing, dashboard, citizen, counterfeit
- [ ] Mapbox map renders with India crime data (dark-v11 style, heatmap + circle layers)
- [ ] Cytoscape graph renders fraud network, cross-jurisdiction badge visible on multi-state rings
- [ ] Gemini analysis returns in < 3 seconds, includes caller_id_spoofed + call_metadata_anomalies
- [ ] Sarvam TTS generates Hindi/Tamil audio
- [ ] Counterfeit check endpoint returns verdict without persisting uploaded images
- [ ] `/api/dashboard/metrics` returns precision/recall/FP-rate/lead-time from synthetic ground truth
- [ ] `/api/geo/patrol-priority` returns ranked hotspots, sidebar renders on dashboard

**Submission Assets:**
- [ ] GitHub repo: public, complete code, clean commit history
- [ ] README.md: complete with all sections listed above, including Detection Metrics and Scope Notes sections
- [ ] Architecture diagram: clear, labeled, PNG/PDF
- [ ] Demo video: 3.5-4.5 min, MP4, uploaded to Google Drive (public link)
- [ ] Presentation PDF: problem → solution → architecture → innovation → impact → scalability
- [ ] Unstop form: PS6 selected, all links filled, all fields complete

**Judging Criteria Alignment:**
- [ ] Innovation (25%): Gemini-powered scam detection + graph intelligence + multilingual Shield + heuristic counterfeit check
- [ ] Business Impact (25%): ₹1,776 Cr problem, lives protected, court-admissible evidence, cross-jurisdiction ring detection
- [ ] Technical Excellence (20%): Multi-agent architecture, SHA-256 chain, NetworkX PageRank, OpenCV heuristic checks
- [ ] Scalability (15%): MongoDB Atlas, H3 spatial indexing, stateless FastAPI
- [ ] User Experience (15%): Command center + citizen chatbot + counterfeit check + 6 Indian languages
- [ ] Evaluation-focus metrics explicitly surfaced: counterfeit accuracy, scam detection precision/recall, fraud-network lead time, citizen-tool false positive rate, evidence auditability

---

## 17. CRITICAL DO-NOTS

1. **DO NOT** store raw phone numbers, Aadhaar, or PAN in any database collection
2. **DO NOT** expose raw transcript text via any API endpoint — only redacted_text
3. **DO NOT** build a trained deep-learning counterfeit classifier or collect/use restricted currency training image datasets — the Counterfeit Currency Check (Section 11) is a rules-based/heuristic prototype ONLY; do not scope-creep it into a CV model
4. **DO NOT** persist uploaded counterfeit-check note images anywhere — hash and discard immediately (see Section 12)
5. **DO NOT** use Kafka or Redis — overkill for hackathon, adds 0 judge value
6. **DO NOT** use Neo4j — NetworkX is sufficient and simpler to deploy
7. **DO NOT** use Llama3 local — Gemini 1.5 Flash is faster, free, and more accurate for this task
8. **DO NOT** add Whisper-large — use base model only (fits on free tier memory)
9. **DO NOT** build streaming real-time detection (no real phone infrastructure) — simulate with polling
10. **DO NOT** add Kafka/Redis/PostGIS — MongoDB Atlas handles everything
11. **DO NOT** build a live IVR telephony integration — the `/api/citizen/ivr-webhook` stub proves the integration point; wiring up an actual telephony provider (Twilio/Exotel) is out of scope for the hackathon build
12. **DO NOT** demo with empty data — seed the database BEFORE recording the demo video, including the 120 synthetic counterfeit checks and pre-computed detection metrics snapshot

---

*End of Master Build Prompt — RAKSHAK AI · ET AI Hackathon 2026 · PS6*
*Build this in order: Backend → Data → AI Services → Frontend Landing → Frontend Dashboard → Frontend Citizen → Frontend Counterfeit Check → Deployment*
