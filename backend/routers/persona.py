"""
Persona Identity Verification — Isolated Router
Provides officer identity verification via Persona (withpersona.com).
Falls back to demo simulation when PERSONA_API_KEY is not configured.
"""
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from models.database import get_db
from utils.rate_limiter import limiter

logger = logging.getLogger("rakshak.persona")
router = APIRouter()

# ── Config (graceful defaults) ──────────────────────────────────────────────
PERSONA_API_KEY = os.getenv("PERSONA_API_KEY", "")
PERSONA_TEMPLATE_ID = os.getenv("PERSONA_TEMPLATE_ID", "")
PERSONA_WEBHOOK_SECRET = os.getenv("PERSONA_WEBHOOK_SECRET", "")

IS_DEMO_MODE = not PERSONA_API_KEY  # True when no real key configured


# ── Request / Response Models ───────────────────────────────────────────────
class CreateInquiryRequest(BaseModel):
    reference_id: str  # e.g. "operator-alpha-01"
    name: Optional[str] = "Officer"


class InquiryResponse(BaseModel):
    inquiry_id: str
    status: str
    mode: str  # "live" or "demo"
    redirect_url: Optional[str] = None
    message: str


class VerificationStatusResponse(BaseModel):
    reference_id: str
    is_verified: bool
    status: str  # pending | completed | failed | not_found
    provider: str
    verified_at: Optional[str] = None
    mode: str


class WebhookPayload(BaseModel):
    """Simplified Persona webhook payload."""
    event_type: Optional[str] = "inquiry.completed"
    inquiry_id: Optional[str] = None
    reference_id: Optional[str] = None
    status: Optional[str] = "completed"


class DemoVerifyRequest(BaseModel):
    """Trigger demo verification completion (used by frontend simulation)."""
    reference_id: str
    inquiry_id: str


# ── Endpoints ───────────────────────────────────────────────────────────────

@router.post("/create-inquiry", response_model=InquiryResponse)
@limiter.limit("10/minute")
async def create_inquiry(request: Request, body: CreateInquiryRequest):
    """
    Create a Persona identity verification inquiry.
    In demo mode: returns a mock inquiry ID immediately.
    In live mode: would call Persona API to create a real inquiry.
    """
    db = get_db()
    inquiry_id = f"inq_{uuid.uuid4().hex[:16]}"

    if IS_DEMO_MODE:
        # Store pending verification in MongoDB
        if db is not None:
            await db.officer_verifications.update_one(
                {"reference_id": body.reference_id},
                {"$set": {
                    "reference_id": body.reference_id,
                    "inquiry_id": inquiry_id,
                    "name": body.name,
                    "status": "pending",
                    "provider": "persona_sandbox",
                    "verified_at": None,
                    "created_at": datetime.now(timezone.utc),
                }},
                upsert=True,
            )
        logger.info(f"[DEMO] Created mock inquiry {inquiry_id} for {body.reference_id}")
        return InquiryResponse(
            inquiry_id=inquiry_id,
            status="pending",
            mode="demo",
            redirect_url=None,
            message="Demo mode — use the frontend simulation to complete verification.",
        )
    else:
        # Live mode: call Persona API
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    "https://withpersona.com/api/v1/inquiries",
                    headers={
                        "Authorization": f"Bearer {PERSONA_API_KEY}",
                        "Persona-Version": "2023-01-05",
                        "Content-Type": "application/json",
                    },
                    json={
                        "data": {
                            "attributes": {
                                "inquiry-template-id": PERSONA_TEMPLATE_ID,
                                "reference-id": body.reference_id,
                            }
                        }
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                real_inquiry_id = data.get("data", {}).get("id", inquiry_id)
                session_token = data.get("data", {}).get("attributes", {}).get("session-token", "")
                redirect_url = f"https://withpersona.com/verify?inquiry-id={real_inquiry_id}&session-token={session_token}"

                if db is not None:
                    await db.officer_verifications.update_one(
                        {"reference_id": body.reference_id},
                        {"$set": {
                            "reference_id": body.reference_id,
                            "inquiry_id": real_inquiry_id,
                            "name": body.name,
                            "status": "pending",
                            "provider": "persona_live",
                            "verified_at": None,
                            "created_at": datetime.now(timezone.utc),
                        }},
                        upsert=True,
                    )

                return InquiryResponse(
                    inquiry_id=real_inquiry_id,
                    status="pending",
                    mode="live",
                    redirect_url=redirect_url,
                    message="Persona inquiry created. Redirect user to complete verification.",
                )
        except Exception as e:
            logger.error(f"Persona API error: {e}")
            raise HTTPException(status_code=502, detail=f"Persona API error: {str(e)}")


@router.get("/status/{reference_id}", response_model=VerificationStatusResponse)
async def get_verification_status(reference_id: str):
    """Check identity verification status for an officer."""
    db = get_db()
    if db is None:
        return VerificationStatusResponse(
            reference_id=reference_id,
            is_verified=False,
            status="not_found",
            provider="none",
            mode="demo" if IS_DEMO_MODE else "live",
        )

    record = await db.officer_verifications.find_one(
        {"reference_id": reference_id}, {"_id": 0}
    )

    if not record:
        return VerificationStatusResponse(
            reference_id=reference_id,
            is_verified=False,
            status="not_found",
            provider="none",
            mode="demo" if IS_DEMO_MODE else "live",
        )

    return VerificationStatusResponse(
        reference_id=reference_id,
        is_verified=record.get("status") == "completed",
        status=record.get("status", "pending"),
        provider=record.get("provider", "persona_sandbox"),
        verified_at=record.get("verified_at", "").isoformat() if record.get("verified_at") else None,
        mode="demo" if IS_DEMO_MODE else "live",
    )


@router.post("/webhook")
async def persona_webhook(request: Request, body: WebhookPayload):
    """
    Webhook listener for Persona events.
    In production: validates HMAC signature. In demo/sandbox: accepts directly.
    """
    db = get_db()

    if body.event_type in ("inquiry.completed", "inquiry.approved", "inquiry.passed"):
        if db is not None and body.reference_id:
            await db.officer_verifications.update_one(
                {"reference_id": body.reference_id},
                {"$set": {
                    "status": "completed",
                    "verified_at": datetime.now(timezone.utc),
                }},
            )
            logger.info(f"Verification completed for {body.reference_id}")
        return {"status": "processed", "reference_id": body.reference_id}

    elif body.event_type in ("inquiry.failed", "inquiry.declined"):
        if db is not None and body.reference_id:
            await db.officer_verifications.update_one(
                {"reference_id": body.reference_id},
                {"$set": {"status": "failed"}},
            )
        return {"status": "processed", "reference_id": body.reference_id}

    return {"status": "ignored", "event_type": body.event_type}


@router.post("/demo-complete")
@limiter.limit("20/minute")
async def demo_complete_verification(request: Request, body: DemoVerifyRequest):
    """
    Demo-only endpoint: simulates successful verification.
    Called by the frontend after the simulated verification animation.
    """
    db = get_db()
    if db is not None:
        result = await db.officer_verifications.update_one(
            {"reference_id": body.reference_id},
            {"$set": {
                "status": "completed",
                "verified_at": datetime.now(timezone.utc),
            }},
        )
        if result.modified_count == 0:
            # Create new record if create-inquiry wasn't called first
            await db.officer_verifications.insert_one({
                "reference_id": body.reference_id,
                "inquiry_id": body.inquiry_id,
                "name": "Officer",
                "status": "completed",
                "provider": "persona_sandbox",
                "verified_at": datetime.now(timezone.utc),
                "created_at": datetime.now(timezone.utc),
            })

    logger.info(f"[DEMO] Verification completed for {body.reference_id}")
    return {"status": "verified", "reference_id": body.reference_id}
