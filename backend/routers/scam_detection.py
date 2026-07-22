"""Scam detection — text/audio analysis, live threat stream, response actions."""
import json
import os
import uuid
from datetime import datetime, timezone

import h3
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from starlette.responses import Response

from models.database import get_db
from models.schemas import AnalyzeTextRequest, BlockActionRequest, AlertVictimRequest
from services.gemini_service import gemini_service
from services.pii_redactor import pii_redactor
from services.evidence_hasher import evidence_hasher
from services.audio_service import audio_service
from services.alert_service import alert_service
from utils.security import get_current_user, get_optional_user
from utils.rate_limiter import limiter

router = APIRouter()

PUBLIC_EXCLUDE = {"_id": 0, "ground_truth_is_scam": 0}  # NEVER expose ground truth / raw text
ALLOWED_AUDIO = {"audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg"}


@router.post("/analyze-text")
@limiter.limit("30/minute")
async def analyze_text(request: Request, body: AnalyzeTextRequest, response: Response,
                       user: dict | None = Depends(get_optional_user)):
    db = get_db()
    redacted_text = pii_redactor.redact(body.text)
    analysis = await gemini_service.analyze_scam_text(redacted_text)
    evidence_hash, hash_ts = evidence_hasher.hash_content(body.text)
    scam_probability = float(analysis.get("scam_probability", 0))
    is_scam = scam_probability > 0.5
    case_id = body.case_id
    if is_scam and db is not None:
        case_id = case_id or str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        await db.fraud_cases.insert_one({
            "case_id": case_id, "timestamp": now,
            "victim_name": "Anonymous Reporter", "victim_location_city": "Delhi",
            "victim_location_lat": 28.6139, "victim_location_lng": 77.2090,
            "victim_location_h3": h3.geo_to_h3(28.6139, 77.2090, 7),
            "caller_number_masked": "+91 **** ****",
            "scam_type": analysis.get("scam_type", "unknown"),
            "authority_impersonated": analysis.get("authority_impersonated"),
            "scam_probability": scam_probability,
            "voice_spoof_confidence": 0.0,
            "script_match_percent": int(analysis.get("voice_script_match_percent", 0)),
            "risk_triggers": analysis.get("risk_triggers", []),
            "caller_id_spoofed": bool(analysis.get("caller_id_spoofed", False)),
            "call_metadata_anomalies": analysis.get("call_metadata_anomalies", []),
            "urgency_level": analysis.get("urgency_level", "medium"),
            "status": "active",
            "transcript_snippet": redacted_text[:200],
            "evidence_hash": evidence_hash,
            "amount_at_risk_inr": 0, "amount_lost_inr": 0,
            "channel": "voice_call", "agency_assigned": "I4C",
            "detected_at_seconds": 45, "ground_truth_is_scam": None,
            "created_at": now, "updated_at": now,
        })
        await db.scam_transcripts.insert_one({
            "transcript_id": str(uuid.uuid4()), "case_id": case_id,
            "raw_text": body.text, "redacted_text": redacted_text,
            "evidence_hash": evidence_hash, "hash_timestamp": hash_ts,
            "language_detected": body.language, "scam_probability": scam_probability,
            "matched_template_ids": [], "gemini_analysis": analysis,
            "created_at": datetime.now(timezone.utc),
        })
    return {
        "case_id": case_id,
        "scam_probability": scam_probability,
        "scam_type": analysis.get("scam_type"),
        "risk_triggers": analysis.get("risk_triggers", []),
        "urgency_level": analysis.get("urgency_level"),
        "authority_impersonated": analysis.get("authority_impersonated"),
        "script_match_percent": analysis.get("voice_script_match_percent", 0),
        "caller_id_spoofed": analysis.get("caller_id_spoofed", False),
        "call_metadata_anomalies": analysis.get("call_metadata_anomalies", []),
        "recommended_action": analysis.get("recommended_action"),
        "reasoning": analysis.get("reasoning"),
        "evidence_hash": evidence_hash,
        "is_scam": is_scam,
    }


@router.post("/analyze-audio")
@limiter.limit("3/minute")
async def analyze_audio(request: Request, response: Response, file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_AUDIO:
        raise HTTPException(status_code=415, detail="Only mp3/wav/ogg audio accepted")
    audio_bytes = await file.read()
    if len(audio_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio exceeds 10MB limit")
    result = await audio_service.analyze_audio_file(audio_bytes)
    transcript = result["transcription"].get("text", "")
    redacted = pii_redactor.redact(transcript)
    evidence_hash, hash_ts = evidence_hasher.hash_content(transcript)
    case_id = str(uuid.uuid4())
    db = get_db()
    if db is not None and transcript:
        await db.scam_transcripts.insert_one({
            "transcript_id": str(uuid.uuid4()), "case_id": case_id,
            "raw_text": transcript, "redacted_text": redacted,
            "evidence_hash": evidence_hash, "hash_timestamp": hash_ts,
            "language_detected": result["transcription"].get("language", "unknown"),
            "scam_probability": float(result["scam_analysis"].get("scam_probability", 0)),
            "matched_template_ids": [], "gemini_analysis": result["scam_analysis"],
            "created_at": datetime.now(timezone.utc),
        })
    return {
        "transcript": redacted,  # only redacted text is ever exposed
        "spoof_probability": result["voice_spoofing"].get("spoof_probability", 0),
        "spoof_indicators": result["voice_spoofing"].get("indicators", []),
        "scam_analysis": result["scam_analysis"],
        "case_id": case_id,
        "evidence_hash": evidence_hash,
    }


@router.get("/threats/live")
async def live_threats(response: Response, limit: int = 20, urgency_level: str = "all",
                       user: dict = Depends(get_current_user)):
    db = get_db()
    query = {} if urgency_level == "all" else {"urgency_level": urgency_level}
    total = await db.fraud_cases.count_documents(query)
    docs = await db.fraud_cases.find(query, PUBLIC_EXCLUDE).sort("timestamp", -1).to_list(min(limit, 100))
    response.headers["X-Total-Count"] = str(total)
    return docs


@router.get("/templates")
async def scam_templates():
    path = os.path.join(os.path.dirname(__file__), "..", "data", "scam_templates.json")
    with open(path) as f:
        return json.load(f)


@router.post("/action/block")
async def block_action(body: BlockActionRequest, user: dict = Depends(get_current_user)):
    db = get_db()
    action = await alert_service.block_telecom(db, body.case_id, body.reason, user["username"])
    return {"success": True, "action_id": action["action_id"]}


@router.post("/action/alert-victim")
async def alert_victim(body: AlertVictimRequest, user: dict = Depends(get_current_user)):
    if body.channel not in ("sms", "whatsapp"):
        raise HTTPException(status_code=422, detail="channel must be sms or whatsapp")
    db = get_db()
    action = await alert_service.alert_victim(db, body.case_id, body.channel, user["username"])
    return {"success": True, "action_id": action["action_id"], "simulated": True}
