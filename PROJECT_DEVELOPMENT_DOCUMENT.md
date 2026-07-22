# RAKSHAK AI: Digital Public Safety Intelligence Platform
## Project Development Document

*Written by the Rakshak AI Engineering Team during the ET AI Hackathon.*

---

### 1. Project Overview

When we first sat down to brainstorm for the ET AI Hackathon, the problem statement "PS6 - Digital Public Safety" immediately caught our attention. We wanted to build something that wasn't just another shiny toy, but a system that could genuinely protect people. The news over the past few months has been flooded with heartbreaking stories. Just last week, we read about a retired teacher who lost her life savings of â‚¹45 lakhs to a "digital arrest" scam. The scammers posed as customs officials, fabricated a fake Supreme Court warrant, and forced her to stay on a video call for 48 hours. This wasn't an isolated incident. According to the Indian Cybercrime Coordination Centre (I4C), Indians lost a staggering â‚¹1,776 Crores to digital arrest scams alone in the first few months of this year. The sheer scale and audacity of these operations are terrifying. 

As we dug deeper, we realized the core issue: law enforcement agencies (LEAs) in India are operating reactively. When a citizen is scammed, they file a complaint on the National Cyber Crime Reporting Portal (NCRP). By the time the police analyze the complaint, request bank details, and track the funds, the money has already been laundered through complex networks of mule accounts and cryptocurrency. The damage is done. The scammers operate with impunity, often from organized fraud call centers across borders or within specific hotspots in the country. There are over 10 lakh cybercrime complaints sitting on the NCRP, and the volume is only increasing. The system is overwhelmed.

That's why we conceptualized **RAKSHAK AI**: India's first AI-powered Digital Public Safety Intelligence platform. Our mission was to shift the paradigm from reactive complaint-filing to predictive neutralization of digital arrest scams, fraud networks, and counterfeit currency. We wanted to give LEAs the upper hand, and citizens a real-time shield.

We designed Rakshak AI with three primary user personas in mind:
1.  **The LEA Operator:** The police officer sitting in a cyber cell who needs a unified dashboard to monitor live threats, analyze evidence, and track down fraud rings.
2.  **The Citizen:** The everyday Indian, perhaps someone's grandparent, who receives a suspicious WhatsApp call and needs immediate, multilingual assistance to verify if they are being scammed.
3.  **The Inter-Agency Coordinator:** The higher-level official who looks at the big pictureâ€”cross-state fraud networks, hotspot mapping, and resource allocation.

To achieve this, we set out with ambitious objectives. We needed real-time scam detection capable of parsing text, audio, and images. We needed a robust way to map out fraud networks, connecting isolated phone numbers and bank accounts into visible syndicates. And crucially, we needed a citizen-facing interface that was accessible, multilingual, and frictionless. 

Our success metrics for this hackathon were clear:
*   **Detection Speed:** The system had to process and classify potential threats in under 2 seconds. In a live scam scenario, every second counts.
*   **Network Coverage:** Our graph intelligence needed to accurately identify clusters and key nodes (the "kingpins") within synthetic datasets simulating real-world fraud rings.
*   **Citizen Accessibility:** The citizen shield needed to support multiple Indian languages seamlessly, offering both text and voice interaction to cater to diverse demographics.

This project isn't just code for us. It's a statement that technology can be a force multiplier for public safety. In the following sections, we document our journey, our architectural decisions, and the late-night debugging sessions that brought Rakshak AI to life.

---

### 2. Research Phase

Before writing a single line of code, we spent our first 12 hours immersed in research. We knew we couldn't build a solution without understanding the current landscape and the specific tactics used by scammers. Our primary sources were the NCRP (cybercrime.gov.in), the I4C annual reports, and various advisories issued by the Ministry of Home Affairs (MHA). 

We analyzed the structure of a typical "digital arrest" scam. It usually starts with an IVR call claiming a FedEx package has been seized containing illegal goods, or a fake TRAI notification threatening number disconnection. The victim is then transferred to a "police officer" or "CBI official" on a Skype or WhatsApp video call. The scammers use fake IDs, forged arrest warrants, and high-pressure tactics to force the victim into transferring funds to a "safe account" for verification. 

Looking at the existing infrastructure, the gap became glaringly obvious. The NCRP is an excellent repository, but it's fundamentally a complaint-logging system. It lacks predictive intelligence. When a victim reports a phone number, it goes into a database. But there's no real-time engine connecting that phone number to a bank account reported in another state, or highlighting that this number is part of a larger syndicate operating out of Jamtara or Mewat. 

Furthermore, citizens have no real-time protection. If someone receives a threatening call, they have to rely on their own judgment. There is no automated, trusted system they can query instantly to say, "Is this a known scammer script?"

We realized the solution required a multi-pronged approach. We needed a unified platform that combined:
1.  **Real-time Detection:** AI models capable of analyzing transcripts and audio for manipulation and spoofing.
2.  **Network Intelligence:** Graph databases and algorithms to map connections between entities (phones, accounts, IPs).
3.  **Citizen Shield:** A responsive, multilingual chat interface acting as a first line of defense for the public.
4.  **Counterfeit Detection:** An added module to tackle physical financial fraud, verifying currency notes, as this often ties into larger organized crime.

This research formed the bedrock of our architecture. We knew exactly what we needed to build.

---

### 3. Requirement Gathering

Translating our research into concrete requirements was the next hurdle. We broke these down into functional and non-functional requirements to keep the team focused.

**Functional Requirements:**
*   **Scam Classification:** The system must accept text (transcripts) or audio, analyze it against known scam scripts (FedEx, TRAI, digital arrest), and return a threat score and classification.
*   **Network Graph:** The backend must maintain a graph of entities (phone numbers, bank accounts, UPI IDs, locations). The frontend must visualize this graph and the backend must compute centrality metrics to identify key fraud nodes.
*   **Citizen Chat:** A conversational interface where users can describe suspicious activity in their native language and receive guidance.
*   **Counterfeit Check:** An image processing pipeline to analyze photos of currency notes for security features (security thread, microprinting) and flag counterfeits.
*   **Geospatial Mapping:** Incident data must be mapped geographically to identify hotspots and prioritize patrol/investigation resources.

**Non-Functional Requirements:**
*   **Latency:** As established, API responses for threat analysis must be under 2 seconds. The frontend dashboard must update in near real-time.
*   **PII Compliance:** This was critical. We are dealing with sensitive data. The system must redact Personally Identifiable Information (Aadhaar, PAN, phone numbers) before storing logs or sending data to external AI models.
*   **Court-Admissible Evidence:** When an operator flags an incident, the digital evidence (transcripts, analysis) must maintain a chain of custody. We required cryptographic hashing (SHA-256) of all evidence payloads.

**User Stories:**
*   *As an LEA Operator, I want to see a live stream of high-priority threats so that I can dispatch units immediately.*
*   *As an LEA Operator, I want to view the fraud network of a specific phone number so that I can identify connected mule accounts.*
*   *As a Citizen (Hindi speaker), I want to report a suspicious WhatsApp call via voice message so that I can know if I am being scammed.*
*   *As an Inter-Agency Coordinator, I want to see a heat map of cybercrime incidents across India so that I can allocate resources effectively.*

---

### 4. Architecture Planning

With requirements locked in, we moved to architecture. We had a lively debate: Monolith vs. Microservices vs. Modular Monolith. 

Microservices are great for scaling, but terrible for hackathon velocity. Managing Kubernetes or complex Docker Compose setups would eat into our development time. A pure monolith might become spaghetti code given the diverse requirements (AI, graphs, geospatial, image processing). 

We settled on a **Modular Monolith** architecture. We would have one unified backend repository, but strictly separated into distinct service modules. For the backend, we chose **FastAPI (Python 3.11)**. Its asynchronous nature is perfect for handling concurrent API requests, and its native Pydantic support makes data validation a breeze. For the frontend, we chose **Next.js 14 (App Router)** with TypeScript and Tailwind CSS, allowing us to build a robust, SEO-friendly (though it's a dashboard), and highly interactive UI quickly. Our database choice was **MongoDB Atlas**. The document model fits perfectly with the varied schemas of cybercrime reports, and its geospatial indexing would be useful.

Here is our core component flow:
1.  **Client (Next.js):** Sends requests to the API.
2.  **API Gateway (FastAPI):** Receives requests, handles rate limiting (`slowapi`), and JWT authentication.
3.  **PII Redactor Middleware:** Scans incoming payloads for sensitive data and masks it before further processing.
4.  **Service Layer:** Routes to specific modules (Gemini Service, Graph Service, Audio Service, OpenCV Service).
5.  **Database (MongoDB):** Stores the processed, redacted data and graph edges.

Our backend folder structure reflects this modularity:

```text
backend/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ main.py              # Application entry point, startup events
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ routers/         # API endpoints grouped by feature
â”‚   â”‚   â”‚   â”œâ”€â”€ auth.py
â”‚   â”‚   â”‚   â”œâ”€â”€ scam_detection.py
â”‚   â”‚   â”‚   â”œâ”€â”€ graph_intelligence.py
â”‚   â”‚   â”‚   â”œâ”€â”€ citizen_shield.py
â”‚   â”‚   â”‚   â”œâ”€â”€ geospatial.py
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboard.py
â”‚   â”‚   â”‚   â””â”€â”€ counterfeit_detection.py
â”‚   â”œâ”€â”€ core/
â”‚   â”‚   â”œâ”€â”€ config.py        # Environment variables
â”‚   â”‚   â”œâ”€â”€ security.py      # JWT, password hashing
â”‚   â”‚   â””â”€â”€ exceptions.py
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â””â”€â”€ schemas.py       # Pydantic models (FraudCase, GraphNode, etc.)
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ gemini_service.py # Integration with Gemini 1.5 Flash
â”‚   â”‚   â”œâ”€â”€ graph_service.py  # NetworkX logic (PageRank, centrality)
â”‚   â”‚   â”œâ”€â”€ audio_service.py  # Whisper & librosa spoof detection
â”‚   â”‚   â”œâ”€â”€ counterfeit_service.py # OpenCV heuristic checks
â”‚   â”‚   â”œâ”€â”€ sarvam_service.py # Sarvam AI for TTS/Translation
â”‚   â”‚   â”œâ”€â”€ alert_service.py  # Dispatch simulation
â”‚   â”‚   â”œâ”€â”€ pii_redactor.py   # Regex-based redaction
â”‚   â”‚   â””â”€â”€ evidence_hasher.py# SHA-256 chain of custody
â”‚   â””â”€â”€ utils/
â”‚       â””â”€â”€ db.py            # MongoDB connection logic
â”œâ”€â”€ data/
â”‚   â””â”€â”€ generate_synthetic.py # Data seeding script
â”œâ”€â”€ requirements.txt
â””â”€â”€ .env
```

This structure allowed us to work in parallel. One team member could build the `graph_service` while another worked on the `gemini_service` without merge conflicts.

---

### 5. Dataset Collection

The biggest roadblock in building cybercrime tools is data. We obviously could not access real victim data or live LEA databases due to ethical and legal constraints. Yet, we needed massive amounts of data to make our graph algorithms and dashboards meaningful.

Our strategy was to build a robust synthetic data generator. We wrote `generate_synthetic.py` using the `Faker` library and Python's `random` module. But we didn't want just random gibberish; we needed *plausible* data.

We curated scam templates based on actual MHA and I4C advisories. We created dictionaries of common scammer scripts (e.g., "Your FedEx package #9982 containing 5 passports has been seized by Customs..."). We mapped out Indian cities and their coordinates. We defined security features based on RBI specifications for the counterfeit module.

We generated:
*   500 Fraud Cases (with varying urgencies and statuses)
*   800 Graph Nodes (representing Phones, Bank Accounts, UPI IDs, IP Addresses)
*   1200 Edges (representing transactions, calls, shared IPs)
*   600 Crime Locations (mapped to H3 hex bins)
*   300 Citizen Reports
*   120 Counterfeit Checks
*   50 Agency Actions

Crucially, we introduced **10% hard negatives** into the dataset. If our models only saw obvious scams, our precision and recall metrics would artificially sit at 100%, which isn't realistic. We included benign conversations (e.g., a real delivery driver calling about a package) and legitimate bank transfers to test the system's discrimination capabilities. 

Our startup script in `main.py` checks if the MongoDB collections are empty. If they are, it automatically runs the synthetic data generation, ensuring the app works out-of-the-box for the judges.

---

### 6. Development Journey

**Day 1: Foundation and Skeletons**
We started with caffeine and a blank canvas. We initialized the Next.js app and the FastAPI backend. The first major task was setting up the MongoDB Atlas connection. We went with the M0 free tier to keep things lightweight. By evening, we had the basic auth router working with JWTs (`python-jose`) and bcrypt hashing (`passlib`). We established the base Pydantic schemas. It felt good to see a `200 OK` on `/api/login`.

**Day 2: AI Integration and Privacy**
This was heavy lifting. We integrated Gemini 1.5 Flash via `gemini_service.py`. We chose Flash because of its speedâ€”crucial for that <2s requirement. We spent hours refining the prompt to force Gemini to return strict JSON containing the threat level, category, and extracted entities. 
Simultaneously, we built the `pii_redactor.py`. We couldn't send raw transcripts containing fake Aadhaar numbers to Gemini. We wrote extensive regex patterns to catch PAN cards, phone numbers, and emails, masking them with `[REDACTED_PHONE]`, etc. 

*The Bug of the Day:* Gemini occasionally ignored the JSON instruction and wrapped the output in markdown code blocks (` ```json ... ``` `). We had to implement a regex fallback parser in `gemini_service.py` to strip the markdown and parse the raw JSON string safely.

**Day 3: Graphs and Maps**
We tackled the network intelligence. We used `NetworkX` in memory. When the app starts, it fetches the nodes and edges from MongoDB and builds a `DiGraph`. We implemented PageRank and betweenness centrality to identify the 'kingpins' (highly connected nodes).
On the frontend, we started building the landing page. We decided on an "Obsidian and Neon Lime" theme to give it a futuristic, cyber-ops feel. 
For geospatial, we integrated Uber's `H3` library in the backend to bin crime locations into hexagons. This is vastly more efficient than plotting thousands of individual points.

**Day 4: Dashboards and Citizen Shield**
The frontend team went into overdrive. We integrated `react-map-gl` for the Live Incident Map. We used a dark Mapbox style (`dark-v11`). We built the `FraudNetworkGraph` component using `cytoscape/react-cytoscapejs`. Getting Cytoscape to render nicely with our neon theme required a lot of custom CSS overriding.
For the Citizen Shield, we built a WhatsApp-style chat interface. We hooked it up to the backend, integrating Sarvam AI for multilingual text-to-speech, allowing the bot to reply in Hindi, Tamil, or Bengali.

**Day 5: Counterfeit, Polish, and Panic**
We implemented the `counterfeit_service.py` using OpenCV. We avoided deep learning here because getting a high-quality dataset of fake Indian currency is impossible. Instead, we used heuristic checks: checking aspect ratios, simulating UV checks, and using Laplacian variance to check the sharpness of microprinting. 
The final hours were spent polishing. We realized our Next.js frontend was making 6 parallel auth requests on load, crashing our dev server. We quickly implemented an `ensureSession` caching mechanism in `api.ts` to deduplicate these calls. 

---

### 7. AI/ML Development

Our AI strategy was pragmatic. We needed accuracy, but speed and deployment feasibility were paramount. 

**Text Analysis (Gemini 1.5 Flash):**
We used Gemini for scam classification. Why not a fine-tuned BERT model? Time constraints and the lack of a large, labeled dataset of Indian scam transcripts. Gemini's zero-shot capabilities with a carefully crafted system prompt proved highly effective. 
We engineered the prompt to act as an expert cybersecurity analyst. We instructed it to look for specific Indian contexts (e.g., mentions of CBI, TRAI, Aadhaar linking). 

```python
# snippet from gemini_service.py
prompt = f"""
Analyze the following transcript for potential digital arrest or fraud.
Return ONLY a valid JSON object with this exact structure:
{{
  "threat_level": "High" | "Medium" | "Low",
  "category": "Digital Arrest" | "Financial Fraud" | "Safe",
  "confidence_score": 0.0 to 1.0,
  "key_indicators": ["list of suspicious phrases"],
  "extracted_entities": {{"phones": [], "accounts": []}}
}}
Transcript: {redacted_transcript}
"""
```

**Audio Analysis (Whisper + librosa):**
For the `/analyze-audio` endpoint, we used the `Whisper base` model to transcribe the audio. We then passed the transcript to our Gemini pipeline. However, we also wanted to detect potential AI voice cloning (deepfakes). We used `librosa` to extract acoustic features: pitch flatness, noise floor, timing regularity, and spectral flatness. While not a deep learning spoof detector, these heuristics flag unnaturally perfect or flat audio profiles typical of basic TTS engines used by scammers.

**Network Intelligence (NetworkX):**
This is where the magic happens for the LEA operator. We used `NetworkX` to compute metrics on our fraud graph. 
*   **PageRank:** Identifies nodes that are important based on the quantity and quality of links to them (e.g., a central mule account receiving funds from many victims).
*   **Betweenness Centrality:** Identifies nodes that act as bridges between different clusters (e.g., a money launderer moving funds between different regional syndicates).

**Multilingual Support (Sarvam AI):**
To make the Citizen Shield accessible, we integrated Sarvam AI's APIs. It allowed us to translate the user's query into English for Gemini, and then translate the response and synthesize it into natural-sounding TTS in 12 Indian languages.

---

### 8. Database Design

We utilized MongoDB Atlas (M0 tier) for our database. Its document-oriented structure was perfect for the varied data we were handling.

We designed 9 core collections:
1.  `users`: LEA operator credentials.
2.  `fraud_cases`: The core incidents, containing threat scores and transcripts.
3.  `graph_nodes`: Entities in the network (e.g., `{ node_id: "9876543210", type: "PHONE" }`).
4.  `graph_edges`: Relationships (e.g., `{ source: "PHONE_A", target: "BANK_B", relation: "TRANSFERRED" }`).
5.  `crime_locations`: Lat/Lng coordinates and their computed H3 indexes.
6.  `citizen_reports`: Logs from the Citizen Shield chat.
7.  `agency_actions`: Logs of operator dispatches.
8.  `counterfeit_checks`: Results from the image processing pipeline.
9.  `metrics`: Snapshots of system precision and recall.

**Indexing Strategy:**
Performance is key. We created indexes on fields that are frequently queried:
*   `fraud_cases`: Indexed on `timestamp`, `urgency`, and `status`.
*   `crime_locations`: Indexed on `h3_index` for blazing fast geospatial aggregation.
*   `graph_nodes`: Indexed on `node_id` for quick lookups during graph traversal.

**Security by Design:**
We adhered to strict PII guidelines. The `fraud_cases` collection never stores raw transcripts if they contain unredacted phone numbers or Aadhaar details. Furthermore, every critical document (like a fraud case or a citizen report) includes an `evidence_hash`. When the record is created, we use our `evidence_hasher` (SHA-256) to hash the payload. This ensures that if the database is tampered with, the hash will mismatch, preserving the chain of custody for court admissibility.

---

### 9. API Development

Our FastAPI backend provides a clean, RESTful API prefixed with `/api/v1`. We heavily utilized Pydantic for request and response validation.

Here is a high-level overview of our key endpoints:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login` | POST | Authenticates operator, returns JWT. |
| `/api/scam_detection/analyze-text` | POST | Receives text, runs PII redaction, calls Gemini, returns JSON threat analysis and evidence hash. |
| `/api/scam_detection/threats/live` | GET | Returns a simulated live stream of high-priority fraud cases. |
| `/api/graph_intelligence/network` | GET | Returns the fraud network in Cytoscape-compatible JSON format. |
| `/api/citizen_shield/chat` | POST | Handles citizen queries, integrates Sarvam AI for translation/TTS, returns response. |
| `/api/geospatial/hotspots` | GET | Returns H3 aggregated hex bin data for the map overlay. |
| `/api/dashboard/kpis` | GET | Aggregates high-level metrics (total threats neutralized, active syndicates). |
| `/api/counterfeit_detection/analyze-note`| POST | Accepts an image file (max 8MB), runs OpenCV checks, returns authenticity score. |

**Middleware and Protection:**
We implemented `slowapi` to enforce rate limiting (e.g., 30 requests/minute on the analysis endpoints) to prevent abuse and API exhaustion. 
The PII redaction acts as a crucial layer before any data hits the external APIs (like Gemini). 

```python
# snippet of request validation
class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The transcript or message to analyze")
    source: str = Field(default="USER_INPUT")
```

---

### 10. Frontend Development

The frontend is the command center. Built with Next.js 14 (App Router) and Tailwind CSS, we aimed for a design that is both highly functional and visually striking. We adopted an "Obsidian and Neon Lime" design system. The dark theme reduces eye strain for operators staring at screens all day, while the neon accents draw attention to critical alerts. We implemented a glassmorphism effect (`bg-white/[0.03] backdrop-blur-md`) to give the interface depth.

**Component Architecture:**
We broke the UI down into modular components. The `/dashboard` page, for instance, is composed of `KPICards`, `LiveThreatStream`, `LiveIncidentMap`, and `AIThreatAnalysis`. This allowed us to manage state locally where possible, avoiding the overhead of Redux. We relied heavily on React Hooks (`useState`, `useEffect`, `useCallback`).

**Key Integrations:**
*   **Mapbox GL:** Integrating `react-map-gl` v7 was challenging. We had to ensure the map dynamically resized within the dashboard grid and handled the H3 hex data correctly. We used Mapbox's `dark-v11` style to match our theme.
*   **Cytoscape:** The `FraudNetworkGraph` uses `cytoscape/react-cytoscapejs`. We spent considerable time tweaking the physics engine (layout) so the graph nodes naturally organize into distinct clusters, making the fraud rings visually obvious.
*   **Recharts:** Used for displaying our detection metrics (precision/recall over time) in a clean, animated line chart.

**Performance Optimizations:**
Early on, we noticed the dashboard was sluggish. The issue was our authentication flow. Multiple components were independently calling `/api/auth/verify` on mount, resulting in 6+ parallel requests. We built an `ensureSession` utility in `api.ts` that implements a singleton pattern with caching. If a request is already in flight, subsequent calls wait for that promise to resolve instead of firing new network requests. We also utilized Next.js's dynamic imports (lazy loading) for heavy components like the Mapbox map and Cytoscape graph, ensuring the initial page load is lightning fast.


---

## 11. Challenges We Faced

Building India's first AI-powered Digital Public Safety Intelligence platform during a hackathon was no small feat. We encountered numerous technical, architectural, and deployment hurdles. Below is a detailed account of the major challenges we faced, how we tackled them, and what we learned.

### 1. Dashboard Lagging Badly on Initial Load
- **Challenge:** The main dashboard was freezing for 2-3 seconds upon loading, making the UI feel incredibly unresponsive.
- **Why it happened:** The `ensureSession()` function was being called independently in *every* component (KPICards, DetectionMetrics, PatrolPriority, AgencyCoordination) and inside multiple custom hooks.
- **Impact:** This caused 6+ parallel authentication requests to the backend simultaneously on page load, overwhelming the browser's connection limit and the free-tier backend.
- **How we diagnosed it:** We opened the Chrome Network tab and saw a waterfall of identical `/api/auth/session` requests all initiated at the exact same time.
- **Solutions considered:** 1) Move auth to a high-level context provider wrapping the app. 2) Cache the promise of the auth request so subsequent calls wait for the first one.
- **Final solution:** We implemented promise caching for the `ensureSession()` call. If a request is already in flight, subsequent calls just await the existing promise rather than firing new network requests.
- **Lessons learned:** Global state or promise caching is essential when multiple isolated components rely on the same asynchronous initialization data.

### 2. h3==3.7.7 Build Failure on Render
- **Challenge:** The backend deployment on Render failed during the pip install phase for the Uber H3 library.
- **Why it happened:** Version 3.7.7 of `h3` requires CMake and a C compiler to build the bindings from source. Render's Python environment (Python 3.14) didn't have the compatible build tools pre-installed for this older version.
- **Impact:** Complete deployment blocker. The backend could not be deployed.
- **How we diagnosed it:** Render build logs explicitly showed a `gcc` and `cmake` failure while compiling the C extensions for `h3`.
- **Solutions considered:** 1) Try to install CMake via a custom build script on Render. 2) Upgrade to a newer `h3` version that provides pre-built wheels.
- **Final solution:** Upgraded to `h3>=4.1.0`. However, this introduced a breaking API change. We had to rewrite our geospatial logic, changing `geo_to_h3` to `latlng_to_cell` and `h3_to_geo` to `h3_to_latlng` across the codebase.
- **Lessons learned:** Always prefer Python packages with pre-built wheels (manylinux) for deployment environments to avoid complex C compilation dependencies.

### 3. PyTorch Downloading 2GB+ CUDA Dependencies on Render
- **Challenge:** The deployment failed due to running out of disk space on the Render free tier.
- **Why it happened:** We used `openai-whisper`, which depends on `torch`. By default, pip pulls the GPU/CUDA version of PyTorch, which is over 2GB.
- **Impact:** The build exceeded the 500MB/1GB limit of the free tier, crashing the pipeline.
- **How we diagnosed it:** The build logs showed `Downloading torch... (2.4GB)` right before the disk space error.
- **Solutions considered:** 1) Find a lighter alternative to Whisper. 2) Force CPU-only PyTorch.
- **Final solution:** We modified our `requirements.txt` to pull the CPU-only version of PyTorch by adding `--extra-index-url https://download.pytorch.org/whl/cpu` and explicitly defining the CPU wheel for `torch`, `torchvision`, and `torchaudio`.
- **Lessons learned:** Default ML dependencies are often bloated for production. Always specify CPU-only builds when deploying inference services on standard cloud containers.

### 4. react-cytoscapejs TypeScript Build Error
- **Challenge:** The Next.js production build on Vercel failed with a TypeScript error regarding `react-cytoscapejs`.
- **Why it happened:** The library `react-cytoscapejs` does not have built-in TypeScript definitions, and there is no `@types/react-cytoscapejs` available.
- **Impact:** Vercel refused to build the frontend, blocking deployment.
- **How we diagnosed it:** Vercel logs showed `TS7016: Could not find a declaration file for module 'react-cytoscapejs'`.
- **Solutions considered:** 1) Rewrite the network visualization using a different library. 2) Use `@ts-ignore` everywhere. 3) Create a custom declaration file.
- **Final solution:** Created a `cytoscape.d.ts` file in the root of the frontend project with `declare module 'react-cytoscapejs';` to satisfy the TypeScript compiler.
- **Lessons learned:** When using older or niche React libraries in a modern TS Next.js project, be prepared to stub out your own type declarations.

### 5. Map Controls Not Working
- **Challenge:** The Mapbox navigation controls and programmatic fly-to animations were throwing null reference errors.
- **Why it happened:** In `react-map-gl` v7, the API changed. You can no longer access the underlying Mapbox instance directly via a React ref (`mapRef.current.getMap()`) before the map has fully loaded.
- **Impact:** The patrol routing visualization could not animate to the selected threat zones.
- **How we diagnosed it:** Console errors pointed to `getMap is not a function` during the component mount phase.
- **Solutions considered:** 1) Downgrade to v6. 2) Capture the instance correctly in the load event.
- **Final solution:** We updated the code to capture the map instance in the `onLoad` callback: `onLoad={(e) => setMap(e.target)}` and triggered animations only after this state was populated.
- **Lessons learned:** Major version bumps in mapping libraries often fundamentally change how you interact with the imperative API.

### 6. Dashboard and Landing Page Color Mismatch
- **Challenge:** The visual identity of the app felt disjointed.
- **Why it happened:** The landing page was built using an "Obsidian/Lime" dark-mode theme to look modern and cybersecurity-focused, while the dashboard components were initially scaffolded using a generic "slate-950/blue-500" Tailwind scheme.
- **Impact:** Poor user experience and a lack of professional cohesion, which is critical for a law enforcement tool.
- **How we diagnosed it:** Visual inspection during a full team walkthrough.
- **Solutions considered:** 1) Revert landing page to blue. 2) Re-theme the entire dashboard.
- **Final solution:** We bit the bullet and re-themed all 10 dashboard components, updating background panels to deep obsidian (`#0F1115`), accents to neon lime (`#39FF14`), and text to crisp whites/grays.
- **Lessons learned:** Establish a global design system and CSS variables early on, rather than hardcoding Tailwind color classes in every component.

### 7. CORS Errors on Deployment
- **Challenge:** The frontend deployed on Vercel could not fetch data from the backend deployed on Render.
- **Why it happened:** The FastAPI backend's `CORS_ORIGINS` environment variable did not include the final production URL generated by Vercel.
- **Impact:** Complete failure of the web app in production; all API calls were blocked by the browser.
- **How we diagnosed it:** Chrome DevTools console showed classic `Access-Control-Allow-Origin` blocked errors.
- **Solutions considered:** 1) Allow all origins (`*`). 2) Update the specific Vercel URL.
- **Final solution:** We added the specific Vercel domain to the Render environment variables and redeployed the backend. We avoided `*` for security reasons.
- **Lessons learned:** Always configure CORS dynamically using environment variables so you don't have to change code when deployment URLs change.

### 8. Git Push Rejected During Initial Deployment
- **Challenge:** Couldn't push our local frontend repository to the remote GitHub repo to trigger the Vercel build.
- **Why it happened:** The remote repository was initialized with a `README.md` and `.gitignore`, while the local Next.js app was created separately without pulling those changes first.
- **Impact:** Delayed the frontend deployment timeline.
- **How we diagnosed it:** Git CLI error: `Updates were rejected because the remote contains work that you do not have locally`.
- **Solutions considered:** 1) `git pull --rebase`. 2) Force push.
- **Final solution:** Since this was the initial setup and the remote only had a dummy README, we used `git push -u origin main --force` to overwrite the remote history with our actual project setup.
- **Lessons learned:** Initialize the local project first, then push to an empty remote, rather than initializing both separately.

### 9. Vercel Root Directory Confusion
- **Challenge:** Vercel was failing to build the Next.js app.
- **Why it happened:** Our repository was structured as a monorepo with `frontend/` and `backend/` folders, but Vercel assumes the root of the repo is the Next.js project by default.
- **Impact:** Vercel couldn't find `package.json` and the build failed instantly.
- **How we diagnosed it:** Vercel build logs showed `Error: No package.json found`.
- **Solutions considered:** 1) Move frontend to root. 2) Configure Vercel settings.
- **Final solution:** We went into the Vercel project settings and explicitly set the "Root Directory" to `frontend`.
- **Lessons learned:** Monorepo structures require specific configuration in PaaS platforms like Vercel and Render.

### 10. Mapbox Token Not Loading on Client
- **Challenge:** The map was rendering as a blank grey box on the deployed site.
- **Why it happened:** We stored the Mapbox token in `.env` as `MAPBOX_TOKEN`. In Next.js, environment variables are only available on the server unless explicitly prefixed.
- **Impact:** Geospatial features were broken for users.
- **How we diagnosed it:** Console error from `react-map-gl` indicating an invalid or missing access token.
- **Solutions considered:** 1) Hardcode the token. 2) Prefix the env var.
- **Final solution:** Renamed the variable to `NEXT_PUBLIC_MAPBOX_TOKEN` so Webpack would inline it for the client-side bundle.
- **Lessons learned:** Understand framework-specific environment variable scoping rules (like `NEXT_PUBLIC_` in Next.js or `VITE_` in Vite).

### 11. Intelligence and Networks Tabs Landing on Same Page
- **Challenge:** Clicking on different dashboard sidebar navigation items didn't change the view properly.
- **Why it happened:** We originally built a single massive dashboard page and tried to use state to toggle views, but the URL didn't update, leading to a confusing UX.
- **Impact:** Users couldn't share links to specific views, and the browser back button didn't work as expected.
- **How we diagnosed it:** User testing revealed immediate confusion when trying to navigate.
- **Solutions considered:** 1) Keep the state-based toggle. 2) Split into actual Next.js routes.
- **Final solution:** We refactored the application to use proper Next.js App Router folders (`/dashboard`, `/dashboard/networks`, `/dashboard/intelligence`) for distinct pages.
- **Lessons learned:** For complex dashboards, use real routes rather than heavy client-side state for navigation to preserve standard web behaviors.

### 12. Dashboard Too Messy/Congested
- **Challenge:** The initial dashboard design tried to cram charts, the map, the AI feed, and the network graph onto one screen.
- **Why it happened:** We wanted to show off all features immediately.
- **Impact:** Cognitive overload. The map was too small to be useful, and charts were squished.
- **How we diagnosed it:** UI review highlighted that no single tool had enough screen real estate to be effective.
- **Solutions considered:** 1) Make things scrollable. 2) Redesign with tabs/pages.
- **Final solution:** We separated the UI. The main page focuses purely on real-time threats (Map + AI Feed), while analytics, networks, and agency coordination got their own dedicated full-screen views.
- **Lessons learned:** "Less is more" applies heavily to data-dense enterprise applications. Focus the user's attention on one primary task per screen.

### 13. Operator Button Not Working
- **Challenge:** The "Contact Operator" feature in the incident modal was a dead button.
- **Why it happened:** We built the UI for it but forgot to implement the underlying state logic and modal component for the actual handoff.
- **Impact:** Incomplete feature demonstration.
- **How we diagnosed it:** Clicking the button during a dry run did nothing.
- **Solutions considered:** 1) Remove the button. 2) Build a quick modal.
- **Final solution:** We quickly implemented an `OperatorModal` that grabs the current session ID and displays a simulated secure handoff screen with a generated reference number.
- **Lessons learned:** Always map UI buttons to at least a basic feedback mechanism (like a toast notification) if the full feature isn't ready.

### 14. Social Media Logos Not Matching Government Portal Style
- **Challenge:** The standard colorful icons for Twitter/Facebook looked out of place on a secure law enforcement tool.
- **Why it happened:** We grabbed standard SVGs off the internet.
- **Impact:** Broke the immersive "official portal" aesthetic.
- **How we diagnosed it:** Visual contrast was jarring against the dark obsidian theme.
- **Solutions considered:** 1) Use CSS filters to grayscale them. 2) Replace with custom SVGs.
- **Final solution:** Replaced them with solid, monochromatic SVGs (using Lucide React icons where possible) styled with our theme's muted text colors.
- **Lessons learned:** Iconography must match the tone of the application.

### 15. Footer Looked Unprofessional
- **Challenge:** The landing page footer was just a single line of text.
- **Why it happened:** It was an afterthought during the initial landing page build.
- **Impact:** Decreased perceived legitimacy of the platform.
- **How we diagnosed it:** It looked like a generic template.
- **Solutions considered:** 1) Leave it. 2) Build a comprehensive footer.
- **Final solution:** Completely redesigned the footer with a 4-column layout including "Nodal Agencies", "Quick Links", "Legal", and a banner stating "Official Platform for Authorized Personnel Only" to sell the realism.
- **Lessons learned:** The footer is a critical trust signal for enterprise/government applications.

### 16. PII Data Exposure Risk
- **Challenge:** The AI analysis was extracting raw Aadhaar numbers, PAN cards, and phone numbers and saving them in plain text in MongoDB.
- **Why it happened:** We initially just dumped the Gemini LLM output directly into the database.
- **Impact:** Massive security and compliance violation.
- **How we diagnosed it:** Reviewing the MongoDB Atlas collections showed real (synthetic, but validly formatted) PII.
- **Solutions considered:** 1) Ask the LLM to redact it. 2) Redact it via regex on the backend before insertion.
- **Final solution:** We implemented a rigorous Regex-based PII redaction utility in Python that masks Aadhaar (`XXXX-XXXX-1234`), PAN, phone numbers, and emails *before* they ever hit the database.
- **Lessons learned:** Never trust the LLM to handle compliance. Always enforce data masking deterministically at the application layer.

### 17. Evidence Admissibility Concern
- **Challenge:** How do we prove that an audio transcript or image analyzed by the AI wasn't tampered with after upload?
- **Why it happened:** Digital evidence requires a chain of custody to be admissible in court.
- **Impact:** The platform would be useless for real legal proceedings.
- **How we diagnosed it:** Realized during a feature brainstorming session about law enforcement needs.
- **Solutions considered:** 1) Blockchain logging. 2) Simple cryptographic hashing.
- **Final solution:** Implemented a SHA-256 hashing mechanism. The moment a file is uploaded, we generate a hash and a UTC timestamp, storing this "fingerprint" immutably.
- **Lessons learned:** Understanding domain-specific requirements (like legal admissibility) is just as important as writing good code.

### 18. Gemini API Rate Limits/Failures
- **Challenge:** During intensive testing, we occasionally hit Gemini API rate limits or timeout errors.
- **Why it happened:** The free tier of Gemini 1.5 Flash has concurrency and requests-per-minute limits.
- **Impact:** The entire threat analysis pipeline would crash, leaving the dashboard empty.
- **How we diagnosed it:** `503 Service Unavailable` or `429 Too Many Requests` errors in the backend logs.
- **Solutions considered:** 1) Add exponential backoff retries. 2) Implement a fallback mock intelligence system.
- **Final solution:** We built a robust fallback heuristic engine. If the API fails, we use regex and keyword matching to generate a basic threat profile so the platform continues to function in a degraded but usable state.
- **Lessons learned:** Never let a third-party API failure take down your core application. Always design for graceful degradation.

### 19. MongoDB Connection Timeout on Cold Start
- **Challenge:** The first login or data fetch after a few hours of inactivity would fail.
- **Why it happened:** The Render free tier spins down the backend after 15 minutes of inactivity. When it spins back up, the initial MongoDB connection initialization took too long, causing the frontend request to timeout.
- **Impact:** Terrible user experience for first-time visitors or judges reviewing the project.
- **How we diagnosed it:** Frontend showed a `504 Gateway Timeout` on the first request, but subsequent requests a minute later worked fine.
- **Solutions considered:** 1) Upgrade to paid Render. 2) Set up a cron job to ping the server.
- **Final solution:** We set up a free UptimeRobot ping every 10 minutes to keep the Render instance awake during the hackathon judging period, completely bypassing the cold start issue.
- **Lessons learned:** Understand the limitations of free cloud tiers and build operational workarounds for critical demonstration periods.

### 20. Counterfeit Check Using Restricted Datasets
- **Challenge:** We wanted to train a custom CV model for counterfeit currency detection, but high-res images of fake Indian currency are restricted.
- **Why it happened:** Legal and ethical restrictions on acquiring and storing counterfeit currency imagery.
- **Impact:** Couldn't build a reliable ML classification model as planned.
- **How we diagnosed it:** Spent hours looking for datasets and realized they don't exist publicly for good reason.
- **Solutions considered:** 1) Abandon the feature. 2) Use deterministic CV heuristics.
- **Final solution:** We pivoted to using OpenCV for heuristic checks: evaluating texture consistency, edge sharpness, and color histogram anomalies against standard profiles, rather than relying on deep learning.
- **Lessons learned:** When data is unavailable, fall back to classical computer vision and heuristic algorithms.

### 21. Multiple Authentication Requests on Page Load
- **Challenge:** (See Challenge 1 - this was a recurring theme affecting multiple parts of the app).
- **Why it happened:** React's component lifecycle triggered data fetches independently.
- **Final solution:** We created a singleton promise wrapper around the fetch call in our API utility.
- **Lessons learned:** Network request deduplication is a critical optimization in React architectures.

### 22. H3 API Breaking Changes v3â†’v4
- **Challenge:** Our geospatial aggregation code completely broke after upgrading the package.
- **Why it happened:** Uber's H3 library underwent a major version upgrade where almost every function was renamed for consistency (e.g., `h3_to_geo` became `h3_to_latlng`).
- **Impact:** All map heatmaps failed to render.
- **How we diagnosed it:** `AttributeError: module 'h3' has no attribute 'h3_to_geo'`.
- **Final solution:** Read the H3 v4 migration guide and systematically updated every function call in our `geo_utils.py` file.
- **Lessons learned:** Always pin your dependencies, and read the changelog before upgrading major versions.

### 23. Sarvam TTS Integration
- **Challenge:** Integrating Sarvam AI for text-to-speech in the citizen reporting flow was tricky because they return raw audio bytes or base64.
- **Why it happened:** We needed to play this audio in the browser seamlessly.
- **Impact:** The voice assistant feature was silent.
- **How we diagnosed it:** The frontend was receiving a massive string instead of a playable URL.
- **Final solution:** We constructed a `data:audio/wav;base64,...` URI string on the frontend and fed it directly into an HTML5 `Audio` object for immediate playback.
- **Lessons learned:** Handling binary data between Python backends and React frontends requires careful encoding/decoding strategies.

### 24. Recharts Deprecation Warning
- **Challenge:** The Vercel build log was littered with npm warnings about `recharts`.
- **Why it happened:** `recharts` had some peer dependency conflicts with React 18.
- **Impact:** No functional impact, but build logs were noisy and it caused concern.
- **Final solution:** We added `legacy-peer-deps=true` to our `.npmrc` to silence the warnings and ensure the build wouldn't fail on strict CI checks.
- **Lessons learned:** React ecosystem upgrades often leave charting and visualization libraries behind for a few months.

### 25. Python 3.14 Compatibility
- **Challenge:** Some esoteric data science libraries wouldn't install on the latest Python version on Render.
- **Why it happened:** Render defaults to a very recent Python version, but libraries like specific versions of `librosa` or `scipy` hadn't published wheels for it yet.
- **Final solution:** We pinned the Python version to `3.11.x` using a `.python-version` file in the backend root.
- **Lessons learned:** Always explicitly define the runtime version for your deployment environment to match your local development setup.

### 26. Package-lock.json Not Committed
- **Challenge:** Vercel build failed with dependency resolution errors.
- **Why it happened:** Someone added a package locally but `.gitignore` accidentally included `package-lock.json` in an early commit.
- **Final solution:** Removed `package-lock.json` from `.gitignore`, ran `npm install` locally to regenerate it, and pushed it to the repo.
- **Lessons learned:** Lockfiles are mandatory for deterministic deployments. Never ignore them.

### 27. Synthetic Data Quality
- **Challenge:** The dashboard looked boring because the mock threat data was too uniform.
- **Why it happened:** Our data generation script just randomized between a few categories.
- **Impact:** The demo didn't look like a real, chaotic law enforcement environment.
- **Final solution:** We rewrote the seed script to inject "hard negatives" (normal events that look suspicious) and clustered events geographically to create realistic hot spots on the map.
- **Lessons learned:** Good demo data is a feature, not an afterthought. It dictates how the product is perceived.

### 28. Theme Toggle Persistence
- **Challenge:** If a user switched to light mode, refreshing the page reverted them to dark mode, causing a jarring flash.
- **Why it happened:** React state resets on reload.
- **Final solution:** Integrated `next-themes` which handles `localStorage` caching and injects a script tag in the document `<head>` to prevent the flash of unstyled content (FOUC).
- **Lessons learned:** Always use dedicated libraries for theme management to handle edge cases like SSR mismatches and FOUC.

### 29. Mobile Responsiveness
- **Challenge:** The complex dashboard layout broke completely on mobile phones.
- **Why it happened:** We designed for a 1080p desktop monitor first.
- **Final solution:** Implemented aggressive Tailwind responsive classes (`hidden md:block`, stacking flex columns) to collapse the sidebar into a hamburger menu and stack the map above the intelligence feed on small screens.
- **Lessons learned:** Mobile-first design is hard for data-heavy dashboards, but responsive fallback layouts are non-negotiable.

### 30. Network Page Unreadable
- **Challenge:** The initial Cytoscape network graph looked like a tangled hairball.
- **Why it happened:** We just dumped 100 nodes into the default force-directed layout.
- **Final solution:** We applied the `cose` (Compound Spring Embedder) layout algorithm, added edge weights based on relationship strength, color-coded nodes by entity type (Person, Bank, Phone), and added an interactive legend.
- **Lessons learned:** Data visualization requires thoughtful curation, not just rendering data points on a screen.

---

## 12. Deployment Journey

Deploying a complex, multi-service architecture for a hackathon required balancing cost, speed, and reliability. We opted for a completely free-tier stack: **Render** for the FastAPI backend, **Vercel** for the Next.js frontend, and **MongoDB Atlas** for the database.

### Backend Deployment (Render)
We chose Render because it natively supports Docker and Python web services with minimal configuration.
1. **Setup:** We linked our GitHub repository and created a new Web Service pointing to the `backend/` directory.
2. **Environment:** We defined the Python version using a `.python-version` file (pinned to 3.11) to avoid compatibility issues with scientific libraries.
3. **Build Hurdles:** Our biggest blockers occurred here. The `h3` library compilation failed because Render's environment lacked CMake. We resolved this by upgrading to a newer version that supplied pre-built wheels. Immediately after, we hit a disk space limit because PyTorch was downloading massive CUDA binaries. We fixed this by modifying our `requirements.txt` to explicitly pull CPU-only wheels:
   ```text
   --extra-index-url https://download.pytorch.org/whl/cpu
   torch==2.1.0+cpu
   ```
4. **Execution:** The start command was set to `uvicorn main:app --host 0.0.0.0 --port 10000`.

### Frontend Deployment (Vercel)
Vercel is the gold standard for Next.js applications, offering zero-config deployments.
1. **Setup:** We imported the repository and set the Root Directory to `frontend/`.
2. **Build Hurdles:** The build failed initially due to missing TypeScript declarations for `react-cytoscapejs`. We fixed this by adding a custom `.d.ts` declaration file. We also had to ensure our `NEXT_PUBLIC_` environment variables were correctly populated in the Vercel dashboard.
3. **CORS Configuration:** Once deployed, the frontend could not communicate with the backend. We had to take the Vercel production URL and add it to the `CORS_ORIGINS` environment variable on Render, then redeploy the backend service.

### Database Deployment (MongoDB Atlas)
We used the M0 Free Tier cluster. The setup was straightforward: whitelist all IP addresses (`0.0.0.0/0`) since Render's outgoing IPs are dynamic, and grab the connection string.

### The Cold Start Problem
The reality of free tiers is that resources sleep when inactive. Render spins down the backend after 15 minutes. This meant the first API request from the frontend could take up to 30 seconds to resolve. To mitigate this during the demonstration phase, we set up a cron job via UptimeRobot to ping the `/health` endpoint every 10 minutes, keeping the service alive.

**Total Cost of Infrastructure:** $0.00/month.

---

## 13. Testing Strategy

Given the rapid pace of the hackathon, we adopted a pragmatic testing strategy focused on critical paths and integration points.

- **API Testing:** We relied heavily on FastAPI's auto-generated Swagger UI (`/docs`). This allowed backend developers to instantly test endpoints, upload audio files for the Whisper model, and verify JSON responses without needing a frontend.
- **Frontend Component Testing:** We used browser developer tools to simulate different screen sizes and network conditions. React Developer Tools were used to inspect state changes and track down unnecessary re-renders.
- **Edge Case & Resilience Testing:**
  - *Empty Inputs:* Verified that submitting empty forms or null audio files returned graceful 400 Bad Request errors.
  - *Rate Limits:* Purposefully spammed the API to trigger the `slowapi` rate limiter and ensure the frontend displayed a proper "Too Many Requests" message rather than crashing.
- **Demo Mode/Offline Fallback:** We explicitly tested the system by disconnecting the MongoDB URI and invalidating the Gemini API key. We ensured that our offline heuristic engines kicked in, generating mock intelligence so the UI remained functional for demonstration purposes.
- **Cross-Browser Testing:** Conducted manual walkthroughs on Chrome, Firefox, and Safari (mobile) to ensure CSS Grid/Flexbox layouts rendered consistently.

---

## 14. Performance Optimization

Ensuring a snappy user experience was critical for an intelligence dashboard.

- **Network Request Deduplication:** We implemented promise caching for our session validation. Initially, the dashboard made 6 parallel auth requests on load. By caching the promise, we reduced this to 1, significantly improving Time to Interactive (TTI).
- **Dynamic Imports:** The network visualization relies on Cytoscape.js, a heavy library. We used Next.js dynamic imports (`next/dynamic`) to lazy-load this component only when the user navigated to the Networks tab, saving hundreds of kilobytes on the initial bundle size.
- **Backend ML Optimization:** By explicitly forcing CPU-only PyTorch, we dramatically reduced container boot times and memory footprint on Render. While inference is slower than GPU, it was well within acceptable limits for audio transcription (Whisper).
- **Database Indexing:** We created indexes in MongoDB on high-query fields like `threat_level`, `timestamp`, and `location` to ensure aggregation pipelines for the dashboard charts returned in under 50ms.
- **Static Generation:** The landing page and documentation routes were statically generated at build time by Next.js, serving instantly from Vercel's Edge CDN.

---

## 15. Security Measures

Since RAKSHAK AI handles sensitive public safety data, security was a primary architectural driver, even in a hackathon context.

- **Authentication:** Implemented secure JWT (JSON Web Token) authentication using `python-jose`. Tokens have a strict 24-hour expiry, and passwords are comprehensively hashed using `bcrypt` via `passlib`.
- **PII Redaction Engine:** This is our most critical security feature. We built a regex-based interceptor that scans all incoming text and LLM outputs. It masks Aadhaar numbers, PAN cards, phone numbers, and emails with `XXXX` *before* the data is persisted to MongoDB.
- **Evidence Chain of Custody:** To ensure admissibility, every uploaded piece of evidence (audio, image, text) is hashed using SHA-256 along with a UTC timestamp upon ingestion, creating an immutable cryptographic fingerprint.
- **Rate Limiting:** We used `slowapi` to enforce strict rate limits (e.g., 30 requests per minute per IP) to prevent DDoS attacks and API abuse.
- **CORS Whitelisting:** The backend explicitly rejects requests from any origin other than our specific Vercel production domain.
- **Data Minimization:** We enforce a strict policy of non-persistence for raw media. Counterfeit currency images are analyzed in memory and immediately discarded; only the analytical metadata and hash are stored.

---

## 16. Git Workflow

To maintain velocity while avoiding merge conflicts, our team adopted a streamlined Git workflow.

- **Single Main Branch:** Given the 48-hour constraint, we opted for trunk-based development on the `main` branch rather than complex feature branching, which requires heavy code review overhead.
- **Conventional Commits:** We strictly enforced descriptive commit messages (e.g., `feat: integrate sarvam TTS`, `fix: resolve CORS issue on auth endpoint`). This made the history readable and rollback decisions easier.
- **Granular Commits:** Developers committed small, atomic changes frequently rather than massive end-of-day dumps.
- **Strict Gitignore:** We maintained a rigorous `.gitignore` to ensure `node_modules`, `__pycache__`, local `.env` files, and `.next` build directories were never committed, keeping the repository clean and secure.

---

## 17. Lessons Learned

The hackathon was an intense crucible for learning. Here are our top takeaways:

1. **Technical Resilience:** Promise caching and network request deduplication are not just "nice to have" optimizations; they are critical for stability in modular React architectures.
2. **Architecture:** A modular monolith (separate frontend/backend repos, unified backend service) is the perfect architecture for a hackathon. Microservices would have added unnecessary deployment complexity.
3. **API Reliability:** Never assume third-party APIs (like Gemini) will be available. Building robust offline fallbacks and heuristic engines saved our demo when we hit API rate limits.
4. **Deployment Realities:** Free cloud tiers have real, painful constraints. Optimizing dependency size (like PyTorch CPU wheels) and managing cold starts require proactive engineering.
5. **Security First:** Security features like PII redaction must be implemented at the lowest application layer (before storage), not applied as a filter on the frontend during retrieval.
6. **Team Dynamics:** Clear communication and rigid API contracts (defining the JSON structure of responses early) allowed frontend and backend to work in parallel without blocking each other.

---

## 18. Future Scope

While RAKSHAK AI is highly functional, we have a clear roadmap for scaling it to a true enterprise-grade platform:

- **Telephony Integration:** Integrate with Twilio or Exotel to allow citizens to call a real phone number for the voice assistant, rather than relying solely on the web interface.
- **Custom Computer Vision Models:** Train proprietary YOLO/ResNet models on legal datasets for more accurate counterfeit currency and weapon detection, moving beyond heuristics.
- **Graph Database Migration:** Migrate the relational network mapping from MongoDB aggregations to a native graph database like Neo4j to handle massive, multi-hop entity relationship queries at scale.
- **Real-time WebSockets:** Replace REST polling with WebSockets to stream threat intelligence to the dashboard with zero latency.
- **Mobile Application:** Develop a native React Native app for field officers, allowing them to receive push notifications and upload evidence directly from their devices.
- **Integration with CCTNS:** Build secure integration pipelines to pull real historical crime data from the Crime and Criminal Tracking Network & Systems (CCTNS).
- **Expanded Multilingual Support:** Extend Sarvam AI integration to support 15+ regional Indian languages for truly inclusive citizen reporting.

---

## 19. Team Contributions

Our success was driven by a clear division of labor aligned with individual strengths:

- **Member 1 (Backend & AI Strategy):** Architected the FastAPI application, designed the MongoDB schemas, integrated the Gemini 1.5 Flash API, and developed the PII redaction and secure hashing pipelines.
- **Member 2 (Frontend & UX Design):** Built the Next.js application, designed the dark-mode UI/UX using Tailwind CSS, implemented the complex charting dashboard, and crafted the public landing page.
- **Member 3 (Data Science & Analytics):** Developed the NetworkX graph generation logic, built the OpenCV heuristic checks for counterfeit detection, and integrated the Whisper and Sarvam audio processing pipelines.
- **Member 4 (DevOps & Content):** Managed the Vercel and Render deployments, wrote the comprehensive mock data generation scripts, conducted QA testing, and authored this project documentation.

---

## 20. Reflection

Looking back, building RAKSHAK AI was an exhausting but deeply rewarding experience. 

**What we would do differently:** We would prioritize deployment even earlier. We lost valuable hours debugging CMake issues on Render near the deadline. We also would have implemented WebSockets from the start instead of relying on REST, which would have simplified the real-time nature of the dashboard. Finally, we would have paid more attention to the mobile UI early on, as retrofitting a dense dashboard for small screens was difficult.

**Our proudest achievements:** We successfully built a unified platform that seamlessly blends multiple complex technologies (LLMs, geospatial mapping, network graphs, audio processing) into a cohesive, professional UI. The implementation of strict security measures like PII redaction and evidence hashing sets this project apart from standard hackathon prototypes and proves it has real-world viability.

**The biggest surprise:** The sheer amount of time and effort required to wrangle ML dependencies (PyTorch, Whisper, H3) into a constrained cloud environment. It highlighted the massive gap between code working on a local machine and code running reliably in the cloud.

RAKSHAK AI demonstrates that with the right application of AI and thoughtful software engineering, we can dramatically modernize public safety infrastructure.

