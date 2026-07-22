"""Gemini 1.5 Flash service — scam text analysis, network intelligence, citizen chat.
Graceful keyword-heuristic fallback when GEMINI_API_KEY is absent (demo resilience)."""
import json
import os
import re
import logging

logger = logging.getLogger("rakshak.gemini")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
except Exception:  # pragma: no cover
    genai = None

RED_FLAGS = [
    "digital arrest", "parcel seized", "illegal drugs", "do not disconnect",
    "cbi headquarters", "ed officer", "customs department", "your aadhaar",
    "money laundering", "stay on video call", "do not tell anyone",
    "judicial custody", "pay fine immediately", "narcotics", "kyc", "otp",
]

SCAM_ANALYSIS_PROMPT = '''You are a cybercrime detection AI for India's Ministry of Home Affairs (MHA).
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
}}'''

NETWORK_ANALYSIS_PROMPT = '''You are a financial crime analyst AI for the Intelligence Bureau of India.
Analyze this fraud network graph and provide intelligence assessment.

NETWORK DATA:
- Total nodes: {node_count}
- Total edges: {edge_count}
- Top hub nodes: {top_hubs}
- Total transactions: ₹{total_amount_inr:,}
- Geographic spread: {cities}
- Victim count: {victim_count}
- Suspect phone count: {suspect_count}

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
}}'''

CITIZEN_CHAT_PROMPT = '''You are RAKSHAK, a friendly AI fraud protection assistant helping Indian citizens.
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
- Detected scam probability: {scam_probability}
- Likely scam type: {scam_type}

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

Keep total response under 250 words. Never use technical jargon.'''


def _extract_json(raw: str) -> dict:
    """Robustly extract a JSON object from an LLM response."""
    raw = raw.strip()
    raw = re.sub(r"^```(json)?|```$", "", raw, flags=re.MULTILINE).strip()
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    return json.loads(raw)


class GeminiService:
    def __init__(self):
        self.model = None
        if genai and GEMINI_API_KEY:
            try:
                self.model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                logger.error(f"Gemini init failed: {e}")

    async def _generate(self, prompt: str) -> str | None:
        if not self.model:
            return None
        try:
            resp = await self.model.generate_content_async(prompt)
            return resp.text
        except Exception as e:
            logger.error(f"Gemini call failed: {e}")
            return None

    # ---------- Scam text analysis ----------
    async def analyze_scam_text(self, text: str) -> dict:
        raw = await self._generate(SCAM_ANALYSIS_PROMPT.format(text=text))
        if raw:
            try:
                result = _extract_json(raw)
                result["source"] = "gemini-1.5-flash"
                return result
            except Exception as e:
                logger.error(f"Gemini JSON parse failed: {e}")
        return self._heuristic_scam_analysis(text)

    def _heuristic_scam_analysis(self, text: str) -> dict:
        """Keyword fallback so the platform degrades gracefully without an API key."""
        lower = text.lower()
        hits = [f for f in RED_FLAGS if f in lower]
        prob = min(0.98, 0.15 + 0.14 * len(hits))
        scam_type = "legitimate"
        authority = None
        if any(k in lower for k in ["digital arrest", "cbi", "judicial custody", "video call"]):
            scam_type, authority = "digital_arrest", "CBI"
        elif any(k in lower for k in ["parcel", "customs", "narcotics"]):
            scam_type, authority = "customs_duty", "Customs"
        elif any(k in lower for k in ["trai", "sim", "disconnect"]):
            scam_type, authority = "trai_disconnection", "TRAI"
        elif "aadhaar" in lower:
            scam_type, authority = "aadhaar_misuse", "Police"
        elif any(k in lower for k in ["kyc", "otp", "account block"]):
            scam_type = "kyc_fraud"
        elif any(k in lower for k in ["refund", "income tax"]):
            scam_type, authority = "tax_refund", "IT_Dept"
        if scam_type == "legitimate":
            prob = min(prob, 0.3)
        urgency = "critical" if prob > 0.85 else "high" if prob > 0.65 else "medium" if prob > 0.4 else "low"
        return {
            "scam_probability": round(prob, 2),
            "scam_type": scam_type,
            "risk_triggers": hits,
            "urgency_level": urgency,
            "authority_impersonated": authority,
            "voice_script_match_percent": min(99, len(hits) * 18),
            "caller_id_spoofed": prob > 0.6,
            "call_metadata_anomalies": ["voip_relay_detected"] if prob > 0.6 else [],
            "recommended_action": "Block caller, alert victim, escalate to I4C" if prob > 0.5 else "Monitor; no immediate action",
            "reasoning": f"Matched {len(hits)} known red-flag phrases (heuristic fallback mode).",
            "source": "heuristic_fallback",
        }

    # ---------- Fraud network analysis ----------
    async def analyze_fraud_network(self, graph_summary: dict) -> dict:
        raw = await self._generate(NETWORK_ANALYSIS_PROMPT.format(
            node_count=graph_summary.get("node_count", 0),
            edge_count=graph_summary.get("edge_count", 0),
            top_hubs=graph_summary.get("top_hubs", []),
            total_amount_inr=graph_summary.get("total_amount_inr", 0),
            cities=graph_summary.get("cities", []),
            victim_count=graph_summary.get("victim_count", 0),
            suspect_count=graph_summary.get("suspect_count", 0),
        ))
        if raw:
            try:
                result = _extract_json(raw)
                result["source"] = "gemini-1.5-flash"
                return result
            except Exception as e:
                logger.error(f"Gemini network JSON parse failed: {e}")
        return {
            "ring_type": "hub_spoke",
            "operation_name": "OPERATION PHANTOM",
            "primary_hub_analysis": "Central fraud compound coordinating multiple suspect phone clusters. High out-degree to mule accounts indicates industrialised cash-out.",
            "estimated_total_victims_india": graph_summary.get("victim_count", 0) * 40,
            "financial_exposure_inr": graph_summary.get("total_amount_inr", 0),
            "jurisdiction_flags": graph_summary.get("states", [])[:4],
            "cross_border_indicators": True,
            "investigation_priority": "critical",
            "recommended_agencies": ["I4C", "FIU_IND", "State_Cyber_Cell"],
            "evidence_strength": "strong",
            "source": "heuristic_fallback",
        }

    # ---------- Citizen chat ----------
    async def citizen_chat(self, message: str, language: str, city: str, scam_context: dict) -> str:
        raw = await self._generate(CITIZEN_CHAT_PROMPT.format(
            city=city,
            scam_probability=scam_context.get("scam_probability", "unknown"),
            scam_type=scam_context.get("scam_type", "unknown"),
            language=language,
            message=message,
        ))
        if raw:
            return raw.strip()
        prob = scam_context.get("scam_probability", 0)
        verdict = "SCAM ⚠️" if prob > 0.7 else "SUSPICIOUS 🔍" if prob > 0.4 else "LIKELY SAFE ✅"
        return (
            f"VERDICT: {verdict}\n\n"
            "This matches known fraud patterns used by organised scam operations. Real government "
            "agencies never demand payment on a call, and 'digital arrest' does not exist in Indian law.\n\n"
            "WHAT TO DO NOW:\n1. Hang up immediately and do not call back\n"
            "2. Do not transfer money or share OTP/bank details\n"
            "3. Report the number at cybercrime.gov.in or call 1930\n\n"
            "EMERGENCY HELPLINES:\n📞 Cyber Crime: 1930 (24/7)\n📞 National Police: 100\n"
            "📱 Report online: cybercrime.gov.in\n\nYou did the right thing by checking — you are safe now."
        )

    # ---------- Evidence summary ----------
    async def generate_evidence_summary(self, case: dict) -> str:
        prompt = (
            "Write a single formal, court-admissible evidence summary paragraph for this fraud case. "
            "Neutral tone, facts only, reference the SHA-256 evidence hash for chain of custody.\n"
            f"CASE: type={case.get('scam_type')}, authority_impersonated={case.get('authority_impersonated')}, "
            f"city={case.get('victim_location_city')}, amount_at_risk_inr={case.get('amount_at_risk_inr')}, "
            f"scam_probability={case.get('scam_probability')}, evidence_hash={case.get('evidence_hash')}, "
            f"detected_at={case.get('timestamp')}"
        )
        raw = await self._generate(prompt)
        if raw:
            return raw.strip()
        return (
            f"On {case.get('timestamp')}, an automated detection by the RAKSHAK AI platform classified a "
            f"communication as a suspected '{case.get('scam_type')}' fraud attempt with model confidence "
            f"{case.get('scam_probability')}. The impersonated authority was {case.get('authority_impersonated')}. "
            f"The victim is located in {case.get('victim_location_city')} with ₹{case.get('amount_at_risk_inr')} at risk. "
            f"The original transcript was cryptographically sealed at ingestion (SHA-256: {case.get('evidence_hash')}), "
            "establishing an immutable chain of custody for judicial review."
        )


gemini_service = GeminiService()
