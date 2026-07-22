"""Counterfeit currency check — heuristic rules-based prototype endpoints."""
import hashlib
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from starlette.responses import Response

from models.database import get_db
from services.counterfeit_service import counterfeit_service
from utils.security import get_current_user
from utils.rate_limiter import limiter

router = APIRouter()

VALID_DENOMINATIONS = [10, 20, 50, 100, 200, 500, 2000]
ALLOWED_IMAGE = {"image/jpeg", "image/png"}
DISCLAIMER = "Heuristic proof-of-concept — not a substitute for RBI-certified verification"


@router.post("/analyze-note")
@limiter.limit("10/minute")
async def analyze_note(request: Request, response: Response, file: UploadFile = File(...), denomination: int = Form(...),
                       location_city: str = Form(None), operator_type: str = Form("citizen")):
    if denomination not in VALID_DENOMINATIONS:
        raise HTTPException(status_code=422, detail=f"Denomination must be one of {VALID_DENOMINATIONS}")
    if file.content_type not in ALLOWED_IMAGE:
        raise HTTPException(status_code=415, detail="Only JPG/PNG images accepted")
    image_bytes = await file.read()
    if len(image_bytes) > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image exceeds 8MB limit")

    result = await counterfeit_service.analyze_note_image(image_bytes, denomination)
    image_hash = hashlib.sha256(image_bytes).hexdigest()
    del image_bytes  # image NEVER persisted — hash only, discard immediately

    check_id = str(uuid.uuid4())
    db = get_db()
    if db is not None:
        await db.counterfeit_checks.insert_one({
            "check_id": check_id, "timestamp": datetime.now(timezone.utc),
            "denomination": denomination, "verdict": result["verdict"],
            "confidence": result["confidence"],
            "checks_performed": result["checks_performed"],
            "checks_failed": result["checks_failed"],
            "image_hash": image_hash, "location_city": location_city,
            "operator_type": operator_type if operator_type in ("citizen", "bank_teller", "field_officer") else "citizen",
            "ground_truth_is_fake": None, "created_at": datetime.now(timezone.utc),
        })
    return {"check_id": check_id, "verdict": result["verdict"], "confidence": result["confidence"],
            "checks_performed": result["checks_performed"], "checks_failed": result["checks_failed"],
            "denomination": denomination, "disclaimer": DISCLAIMER}


@router.get("/denominations")
async def denominations():
    descriptions = {
        10: "Security thread, Gandhi portrait watermark, micro-lettering 'RBI भारत'",
        20: "Security thread, latent-image denomination numeral, microprint band",
        50: "Windowed security thread, see-through register, serial number panel",
        100: "Colour-shift windowed thread, latent image, raised intaglio print",
        200: "Colour-shift thread, latent numeral, bleed lines, microprint",
        500: "Colour-shift windowed thread ('भारत'/'RBI'), latent 500, ascending serial font",
        2000: "Colour-shift thread, latent 2000, motif micro-lettering, ascending serial font",
    }
    return [{"denomination": d, "reference_features": descriptions[d]} for d in VALID_DENOMINATIONS]


@router.get("/checks/recent")
async def recent_checks(user: dict = Depends(get_current_user)):
    db = get_db()
    return await db.counterfeit_checks.find(
        {}, {"_id": 0, "ground_truth_is_fake": 0}).sort("timestamp", -1).to_list(20)
