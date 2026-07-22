"""Pydantic v2 schemas — one class per MongoDB collection + API request models."""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------- Collection: fraud_cases ----------
class FraudCase(BaseModel):
    case_id: str
    timestamp: datetime
    victim_name: str
    victim_location_city: str
    victim_location_lat: float
    victim_location_lng: float
    victim_location_h3: str
    caller_number_masked: str
    scam_type: str
    authority_impersonated: Optional[str] = None
    scam_probability: float
    voice_spoof_confidence: float
    script_match_percent: int
    risk_triggers: List[str] = []
    caller_id_spoofed: bool = False
    call_metadata_anomalies: List[str] = []
    urgency_level: str
    status: str
    transcript_snippet: str
    evidence_hash: str
    amount_at_risk_inr: int = 0
    amount_lost_inr: int = 0
    channel: str = "voice_call"
    agency_assigned: str = "I4C"
    detected_at_seconds: int = 120
    ground_truth_is_scam: Optional[bool] = None  # NEVER exposed via public API
    created_at: datetime
    updated_at: datetime


# ---------- Collection: scam_transcripts ----------
class ScamTranscript(BaseModel):
    transcript_id: str
    case_id: str
    raw_text: str  # NEVER exposed via API
    redacted_text: str
    evidence_hash: str
    hash_timestamp: datetime
    language_detected: str = "en"
    scam_probability: float = 0.0
    matched_template_ids: List[str] = []
    gemini_analysis: dict = {}
    created_at: datetime


# ---------- Collection: graph_nodes ----------
class GraphNode(BaseModel):
    node_id: str
    node_type: str
    label: str
    masked_value: str
    city: str = ""
    state: str = ""
    pagerank_score: float = 0.0
    centrality_score: float = 0.0
    connected_cases: List[str] = []
    total_transactions_inr: int = 0
    risk_level: str = "medium"
    is_hub: bool = False
    linked_states: List[str] = []
    is_cross_jurisdiction: bool = False
    created_at: datetime


# ---------- Collection: graph_edges ----------
class GraphEdge(BaseModel):
    edge_id: str
    source_node_id: str
    target_node_id: str
    relationship_type: str
    amount_inr: int = 0
    timestamp: datetime
    case_id: str = ""
    metadata: dict = {}


# ---------- Collection: crime_locations ----------
class CrimeLocation(BaseModel):
    location_id: str
    lat: float
    lng: float
    city: str
    state: str
    crime_type: str
    case_id: str = ""
    h3_index: str
    severity: str = "medium"
    timestamp: datetime


# ---------- Collection: citizen_reports ----------
class CitizenReport(BaseModel):
    report_id: str
    timestamp: datetime
    reporter_phone_hash: str
    description: str  # PII-redacted
    language: str = "en"
    classified_scam_type: str = "unknown"
    scam_probability: float = 0.0
    rakshak_response: str = ""
    status: str = "received"
    ncrb_ref: str = ""
    ground_truth_is_scam: Optional[bool] = None
    created_at: datetime


# ---------- Collection: agency_actions ----------
class AgencyAction(BaseModel):
    action_id: str
    case_id: str
    agency: str
    action_type: str
    operator: str = "system"
    timestamp: datetime
    details: str = ""
    success: bool = True


# ---------- Collection: counterfeit_checks ----------
class CounterfeitCheck(BaseModel):
    check_id: str
    timestamp: datetime
    denomination: int
    verdict: str  # likely_genuine | suspicious | likely_counterfeit
    confidence: float  # heuristic confidence, NOT a trained-model probability
    checks_performed: List[str] = []
    checks_failed: List[str] = []
    image_hash: str  # image itself is NEVER persisted
    location_city: Optional[str] = None
    operator_type: str = "citizen"
    ground_truth_is_fake: Optional[bool] = None
    created_at: datetime


# ---------- Collection: detection_metrics ----------
class DetectionMetricsSnapshot(BaseModel):
    snapshot_id: str
    computed_at: datetime
    module: str  # scam_detection | counterfeit_check
    precision: float
    recall: float
    false_positive_rate: float
    avg_lead_time_seconds: float = 0.0
    sample_size: int = 0


# ============ API Request Models ============
class LoginRequest(BaseModel):
    username: str
    password: str


class AnalyzeTextRequest(BaseModel):
    text: str = Field(min_length=10, max_length=5000)
    language: str = "en"
    case_id: Optional[str] = None


class BlockActionRequest(BaseModel):
    case_id: str
    reason: str = ""


class AlertVictimRequest(BaseModel):
    case_id: str
    channel: str = "sms"  # sms | whatsapp


class CitizenChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    language: str = "en"
    city: str = "Delhi"
    session_id: str = "anonymous"


class CitizenReportRequest(BaseModel):
    description: str = Field(min_length=5, max_length=5000)
    phone_hash: str = ""
    language: str = "en"
    city: str = "Delhi"


class AddGraphReportRequest(BaseModel):
    caller_number: str
    victim_city: str
    scam_type: str
    amount_inr: int = 0


class BroadcastRequest(BaseModel):
    message: str = Field(min_length=3, max_length=2000)
    target_agencies: List[str]
    case_id: Optional[str] = None


class IVRWebhookRequest(BaseModel):
    caller_number: str
    dtmf_input: str = ""
    call_sid: str = ""
