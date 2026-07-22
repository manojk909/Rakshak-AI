"""Citizen Fraud Shield — multilingual chat, reporting, caller verification, IVR stub."""
import base64
import hashlib
import re
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request
from starlette.responses import Response

from models.database import get_db
from models.schemas import CitizenChatRequest, CitizenReportRequest, IVRWebhookRequest
from services.gemini_service import gemini_service
from services.pii_redactor import pii_redactor
from services.sarvam_service import sarvam_service
from utils.rate_limiter import limiter

router = APIRouter()

CITY_CODES = {"delhi": "DL", "mumbai": "MH", "bengaluru": "KA", "hyderabad": "TG", "chennai": "TN",
              "kolkata": "WB", "pune": "MH", "ahmedabad": "GJ", "jaipur": "RJ", "lucknow": "UP"}

EMERGENCY_CONTACTS = {
    "cyber_crime": "1930",
    "national_police": "100",
    "women_helpline": "181",
    "ncrb_portal": "cybercrime.gov.in",
    "i4c_email": "cybercrime@hq.crpf.gov.in",
    "state_contacts": {"Delhi": "011-23438252", "Mumbai": "022-22630829", "Bengaluru": "080-22943050",
                       "Hyderabad": "040-27852040", "Chennai": "044-28512527", "Kolkata": "033-22143000"},
}


def _ncrb_ref(city: str) -> str:
    code = CITY_CODES.get(city.lower(), "IN")
    return f"NCRB-{datetime.now(timezone.utc).year}-{code}-{uuid.uuid4().hex[:8].upper()}"


@router.post("/chat")
@limiter.limit("5/minute")
async def chat(request: Request, body: CitizenChatRequest, response: Response):
    db = get_db()
    redacted = pii_redactor.redact(body.message)  # never store raw user message
    scam_context = await gemini_service.analyze_scam_text(redacted)
    response_text = await gemini_service.citizen_chat(redacted, body.language, body.city, scam_context)

    # Attempt Sarvam TTS for non-English responses
    audio_url = None
    if body.language != 'en':
        try:
            audio_bytes = await sarvam_service.text_to_speech(response_text[:500], body.language)
            if audio_bytes:
                audio_url = f"data:audio/wav;base64,{base64.b64encode(audio_bytes).decode()}"
        except Exception:
            pass  # graceful fallback — audio_url stays None

    prob = float(scam_context.get("scam_probability", 0))
    verdict = "SCAM" if prob > 0.7 else "SUSPICIOUS" if prob > 0.4 else "LIKELY_SAFE"
    ncrb_ref = _ncrb_ref(body.city)
    if db is not None:
        await db.citizen_reports.insert_one({
            "report_id": str(uuid.uuid4()), "timestamp": datetime.now(timezone.utc),
            "reporter_phone_hash": hashlib.sha256(body.session_id.encode()).hexdigest(),
            "description": redacted, "language": body.language,
            "classified_scam_type": scam_context.get("scam_type", "unknown"),
            "scam_probability": prob, "rakshak_response": response_text[:2000],
            "status": "received", "ncrb_ref": ncrb_ref, "ground_truth_is_scam": None,
            "created_at": datetime.now(timezone.utc),
        })
    return {"response_text": response_text, "audio_url": audio_url, "verdict": verdict,
            "scam_probability": prob, "emergency_contacts": EMERGENCY_CONTACTS, "ncrb_ref": ncrb_ref}


@router.post("/report")
@limiter.limit("10/minute")
async def report(request: Request, body: CitizenReportRequest, response: Response):
    db = get_db()
    redacted = pii_redactor.redact(body.description)
    analysis = await gemini_service.analyze_scam_text(redacted)
    report_id = str(uuid.uuid4())
    ncrb_ref = _ncrb_ref(body.city)
    if db is not None:
        await db.citizen_reports.insert_one({
            "report_id": report_id, "timestamp": datetime.now(timezone.utc),
            "reporter_phone_hash": body.phone_hash or "anonymous",
            "description": redacted, "language": body.language,
            "classified_scam_type": analysis.get("scam_type", "unknown"),
            "scam_probability": float(analysis.get("scam_probability", 0)),
            "rakshak_response": "", "status": "received", "ncrb_ref": ncrb_ref,
            "ground_truth_is_scam": None, "created_at": datetime.now(timezone.utc),
        })
    return {"report_id": report_id, "ncrb_ref": ncrb_ref, "status": "received"}


@router.get("/emergency-contacts")
async def emergency_contacts():
    return EMERGENCY_CONTACTS


@router.get("/verify-caller")
async def verify_caller(caller_number: str):
    if not re.fullmatch(r"\+?91?[6-9]\d{9}", re.sub(r"[\s-]", "", caller_number)):
        raise HTTPException(status_code=422, detail="Invalid Indian phone number format")
    db = get_db()
    masked = pii_redactor.mask_phone(caller_number)
    match_count = await db.fraud_cases.count_documents({"caller_number_masked": masked})
    known_type = None
    if match_count:
        doc = await db.fraud_cases.find_one({"caller_number_masked": masked}, {"_id": 0, "scam_type": 1})
        known_type = doc.get("scam_type") if doc else None
    warning = "high" if match_count >= 3 else "medium" if match_count >= 1 else "none"
    return {"is_government_number": False, "is_known_scam_number": match_count > 0,
            "match_count": match_count, "warning_level": warning, "known_scam_type": known_type}


@router.post("/ivr-webhook")
async def ivr_webhook(body: IVRWebhookRequest):
    """STUB — proves the IVR integration point. Full IVR needs a telephony provider
    (Twilio/Exotel); out of hackathon scope. See README 'Scope Notes'."""
    text = f"IVR caller pressed: {body.dtmf_input}" if body.dtmf_input else "IVR call received"
    analysis = await gemini_service.analyze_scam_text(text)
    prob = float(analysis.get("scam_probability", 0))
    verdict_tts = ("Warning. This call pattern matches a known scam. Disconnect now and call one nine three zero."
                   if prob > 0.5 else
                   "No scam pattern detected. Stay alert and never share your O T P.")
    db = get_db()
    if db is not None:
        await db.citizen_reports.insert_one({
            "report_id": str(uuid.uuid4()), "timestamp": datetime.now(timezone.utc),
            "reporter_phone_hash": hashlib.sha256(body.caller_number.encode()).hexdigest(),
            "description": f"[IVR] dtmf={body.dtmf_input} sid={body.call_sid}",
            "language": "en", "classified_scam_type": analysis.get("scam_type", "unknown"),
            "scam_probability": prob, "rakshak_response": verdict_tts, "status": "received",
            "ncrb_ref": "", "ground_truth_is_scam": None, "created_at": datetime.now(timezone.utc),
        })
    return {"status": "stub_processed", "verdict_tts": verdict_tts, "scam_probability": prob}
