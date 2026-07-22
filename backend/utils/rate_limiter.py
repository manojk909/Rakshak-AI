"""slowapi rate limiter — 30 req/min per IP globally, endpoint overrides in routers."""
import os
from slowapi import Limiter
from slowapi.util import get_remote_address

RATE_LIMIT_PER_MINUTE = os.getenv("RATE_LIMIT_PER_MINUTE", "30")

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{RATE_LIMIT_PER_MINUTE}/minute"],
    headers_enabled=True,  # adds X-RateLimit-Remaining
)
