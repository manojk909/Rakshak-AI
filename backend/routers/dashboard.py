"""Command center dashboard — KPIs, summaries, broadcasts, agency feed, metrics."""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends

from models.database import get_db
from models.schemas import BroadcastRequest
from services.alert_service import alert_service
from services.metrics_service import metrics_service
from utils.security import get_current_user

router = APIRouter()

PUBLIC_EXCLUDE = {"_id": 0, "ground_truth_is_scam": 0}


@router.get("/kpis")
async def kpis(user: dict = Depends(get_current_user)):
    db = get_db()
    now = datetime.now(timezone.utc)
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday = today - timedelta(days=1)
    active = await db.fraud_cases.count_documents({"status": "active"})
    interventions_today = await db.agency_actions.count_documents(
        {"action_type": "victim_alert_sms", "timestamp": {"$gte": today}})
    blocked_today = await db.fraud_cases.count_documents(
        {"status": "blocked", "updated_at": {"$gte": today}})
    mule_frozen = await db.agency_actions.count_documents({"action_type": "account_freeze"})
    pipeline = [{"$match": {"status": {"$in": ["blocked", "resolved"]}}},
                {"$group": {"_id": None, "total": {"$sum": "$amount_at_risk_inr"}}}]
    protected = 0
    async for doc in db.fraud_cases.aggregate(pipeline):
        protected = doc["total"]
    active_yesterday = await db.fraud_cases.count_documents(
        {"status": "active", "created_at": {"$gte": yesterday, "$lt": today}})
    interventions_yesterday = await db.agency_actions.count_documents(
        {"action_type": "victim_alert_sms", "timestamp": {"$gte": yesterday, "$lt": today}})
    return {"active_threats": active, "victim_interventions_today": interventions_today,
            "calls_blocked_today": blocked_today, "mule_accounts_frozen": mule_frozen,
            "total_amount_protected_inr": protected,
            "vs_yesterday": {"active_threats_delta": active - active_yesterday,
                             "interventions_delta": interventions_today - interventions_yesterday}}


@router.get("/summary")
async def summary(period: str = "week", user: dict = Depends(get_current_user)):
    db = get_db()
    days = {"day": 1, "week": 7, "month": 30}.get(period, 7)
    since = datetime.now(timezone.utc) - timedelta(days=days)
    fmt = "%Y-%m-%dT%H:00" if period == "day" else "%Y-%m-%d"
    pipeline = [{"$match": {"timestamp": {"$gte": since}}},
                {"$group": {"_id": {"$dateToString": {"format": fmt, "date": "$timestamp"}},
                            "cases": {"$sum": 1},
                            "amount_at_risk": {"$sum": "$amount_at_risk_inr"},
                            "critical": {"$sum": {"$cond": [{"$eq": ["$urgency_level", "critical"]}, 1, 0]}}}},
                {"$sort": {"_id": 1}}]
    series = []
    async for doc in db.fraud_cases.aggregate(pipeline):
        series.append({"bucket": doc["_id"], "cases": doc["cases"],
                       "amount_at_risk_inr": doc["amount_at_risk"], "critical": doc["critical"]})
    return {"period": period, "series": series}


@router.get("/threats/active")
async def active_threats(user: dict = Depends(get_current_user)):
    db = get_db()
    order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    docs = await db.fraud_cases.find({"status": "active"}, PUBLIC_EXCLUDE).sort("timestamp", -1).to_list(200)
    docs.sort(key=lambda d: (order.get(d.get("urgency_level", "low"), 4)))
    return docs[:50]


@router.post("/broadcast")
async def broadcast(body: BroadcastRequest, user: dict = Depends(get_current_user)):
    db = get_db()
    result = await alert_service.broadcast(db, body.message, body.target_agencies,
                                           body.case_id, user["username"])
    return result


@router.get("/agency-feed")
async def agency_feed(user: dict = Depends(get_current_user)):
    db = get_db()
    return await db.agency_actions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(20)


@router.get("/metrics")
async def metrics(user: dict = Depends(get_current_user)):
    """Directly answers the evaluation focus: precision/recall, lead time, FP rate."""
    db = get_db()
    scam = await metrics_service.compute_scam_detection_metrics(db)
    counterfeit = await metrics_service.compute_counterfeit_metrics(db)
    _strip_meta = lambda d: {k: v for k, v in d.items() if k not in ("_id", "snapshot_id", "module", "computed_at")}
    return {"scam_detection": _strip_meta(scam), "counterfeit_check": _strip_meta(counterfeit),
            "computed_at": datetime.now(timezone.utc).isoformat(),
            "methodology": "Computed against labeled synthetic evaluation data"}
