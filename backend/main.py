"""
RAKSHAK AI — FastAPI Backend
Digital Public Safety Intelligence Platform
"""
import logging
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from models.database import connect_to_mongo, close_mongo_connection, get_db
from utils.rate_limiter import limiter

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("rakshak")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_to_mongo()
        logger.info("MongoDB connected")
        db = get_db()
        count = await db.fraud_cases.count_documents({})
        if count == 0:
            logger.info("Empty database detected — seeding synthetic data...")
            try:
                from data.seed_database import seed_all
                await seed_all(db)
                logger.info("Synthetic data seeded")
            except Exception as e:
                logger.error(f"Seeding failed (continuing): {e}")
        # Init in-memory graph
        from services.graph_service import graph_service
        nodes = await db.graph_nodes.find({}, {"_id": 0}).to_list(5000)
        edges = await db.graph_edges.find({}, {"_id": 0}).to_list(10000)
        graph_service.build_from_db(nodes, edges)
        logger.info(f"Graph loaded: {len(nodes)} nodes, {len(edges)} edges")
    except Exception as e:
        logger.error(f"Startup error (API will run degraded): {e}")
    yield
    await close_mongo_connection()


app = FastAPI(title="RAKSHAK AI API", version="1.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
from routers import auth, scam_detection, graph_intelligence, citizen_shield, geospatial, dashboard, counterfeit_detection, persona  # noqa: E402

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(scam_detection.router, prefix="/api/scam", tags=["scam-detection"])
app.include_router(graph_intelligence.router, prefix="/api/graph", tags=["graph-intelligence"])
app.include_router(citizen_shield.router, prefix="/api/citizen", tags=["citizen-shield"])
app.include_router(geospatial.router, prefix="/api/geo", tags=["geospatial"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(counterfeit_detection.router, prefix="/api/counterfeit", tags=["counterfeit"])
app.include_router(persona.router, prefix="/api/persona", tags=["persona-idv"])


@app.get("/api/health")
async def health():
    return {"status": "operational", "version": "1.0.0", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(status_code=404, content={"detail": "Endpoint not found"})


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    error_id = str(uuid.uuid4())
    # Log metadata only — NEVER request bodies (PII policy)
    logger.error(f"error_id={error_id} path={request.url.path} type={type(exc).__name__}: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Internal error", "error_id": error_id})
