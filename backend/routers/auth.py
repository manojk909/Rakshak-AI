"""Auth — JWT login for command-center operators."""
import os
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.responses import Response

from models.schemas import LoginRequest
from utils.security import create_access_token, verify_password, hash_password, get_current_user
from utils.rate_limiter import limiter

router = APIRouter()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
# Dev fallback: if no bcrypt hash configured, allow 'rakshak2026' (documented in README)
_DEV_HASH = hash_password("rakshak2026")


@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, body: LoginRequest, response: Response):
    stored_hash = ADMIN_PASSWORD_HASH or _DEV_HASH
    if body.username != ADMIN_USERNAME or not verify_password(body.password, stored_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": body.username, "role": "operator"})
    return {"access_token": token, "token_type": "bearer", "expires_in": 86400}


@router.get("/me")
async def me(user: dict = Depends(get_current_user)):
    return {"username": user["username"], "role": "operator"}
