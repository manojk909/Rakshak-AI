"""Geospatial intelligence — heatmap, hotspots, H3 clusters, patrol priority."""
from datetime import datetime, timedelta, timezone

import h3
from fastapi import APIRouter, Depends

from models.database import get_db
from utils.security import get_current_user

router = APIRouter()


def _feature(doc: dict) -> dict:
    return {"type": "Feature",
            "geometry": {"type": "Point", "coordinates": [doc["lng"], doc["lat"]]},
            "properties": {"crime_type": doc.get("crime_type"), "severity": doc.get("severity"),
                           "city": doc.get("city"), "timestamp": str(doc.get("timestamp")),
                           "case_id": doc.get("case_id", "")}}


@router.get("/heatmap")
async def heatmap():
    db = get_db()
    docs = await db.crime_locations.find({}, {"_id": 0}).to_list(2000)
    return {"type": "FeatureCollection", "features": [_feature(d) for d in docs]}


@router.get("/hotspots")
async def hotspots(limit: int = 20, crime_type: str = "all"):
    db = get_db()
    match = {} if crime_type == "all" else {"crime_type": crime_type}
    pipeline = [{"$match": match},
                {"$group": {"_id": "$h3_index", "crime_count": {"$sum": 1},
                            "lat": {"$avg": "$lat"}, "lng": {"$avg": "$lng"},
                            "city": {"$first": "$city"},
                            "types": {"$push": "$crime_type"}}},
                {"$sort": {"crime_count": -1}}, {"$limit": min(limit, 100)}]
    results = []
    async for doc in db.crime_locations.aggregate(pipeline):
        types = doc["types"]
        results.append({"h3_index": doc["_id"], "lat": doc["lat"], "lng": doc["lng"],
                        "city": doc["city"], "crime_count": doc["crime_count"],
                        "dominant_type": max(set(types), key=types.count)})
    return results


@router.get("/clusters")
async def clusters():
    db = get_db()
    pipeline = [{"$group": {"_id": "$h3_index", "crime_count": {"$sum": 1},
                            "types": {"$push": "$crime_type"}, "severities": {"$push": "$severity"}}}]
    hexes = []
    async for doc in db.crime_locations.aggregate(pipeline):
        try:
            lat, lng = h3.h3_to_geo(doc["_id"])
        except Exception:
            continue
        types, sevs = doc["types"], doc["severities"]
        hexes.append({"h3_index": doc["_id"], "center_lat": lat, "center_lng": lng,
                      "crime_count": doc["crime_count"],
                      "dominant_type": max(set(types), key=types.count),
                      "severity": max(set(sevs), key=sevs.count)})
    return hexes


@router.get("/mule-locations")
async def mule_locations(user: dict = Depends(get_current_user)):
    db = get_db()
    docs = await db.crime_locations.find({"crime_type": "mule_withdrawal"}, {"_id": 0}).to_list(1000)
    return {"type": "FeatureCollection", "features": [_feature(d) for d in docs]}


@router.get("/city-stats")
async def city_stats():
    db = get_db()
    pipeline = [{"$group": {"_id": "$city", "total": {"$sum": 1},
                            "types": {"$push": "$crime_type"},
                            "critical": {"$sum": {"$cond": [{"$eq": ["$severity", "critical"]}, 1, 0]}}}},
                {"$sort": {"total": -1}}]
    stats = []
    async for doc in db.crime_locations.aggregate(pipeline):
        types = doc["types"]
        stats.append({"city": doc["_id"], "total_incidents": doc["total"],
                      "critical_incidents": doc["critical"],
                      "dominant_type": max(set(types), key=types.count)})
    return stats


@router.get("/patrol-priority")
async def patrol_priority(limit: int = 5, user: dict = Depends(get_current_user)):
    """Weighted score = incident_count × recency_weight (7-day linear decay).
    Directly supports 'patrol prioritisation, resource deployment'."""
    db = get_db()
    now = datetime.now(timezone.utc)
    hex_scores: dict = {}
    async for doc in db.crime_locations.find({}, {"_id": 0}):
        ts = doc.get("timestamp")
        if ts is None:
            age_days = 30
        elif ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
            age_days = (now - ts).total_seconds() / 86400
        else:
            age_days = (now - ts).total_seconds() / 86400
        recency_weight = max(0.1, 1 - (age_days / 7))
        entry = hex_scores.setdefault(doc["h3_index"], {"score": 0.0, "count": 0, "types": []})
        entry["score"] += recency_weight
        entry["count"] += 1
        entry["types"].append(doc["crime_type"])
    ranked = sorted(hex_scores.items(), key=lambda kv: kv[1]["score"], reverse=True)[:min(limit, 20)]
    results = []
    for h3_index, data in ranked:
        try:
            lat, lng = h3.h3_to_geo(h3_index)
        except Exception:
            continue
        dominant = max(set(data["types"]), key=data["types"].count)
        action = {"fraud_compound": "Deploy cyber-cell raid team with FIU coordination",
                  "mule_withdrawal": "Station plainclothes unit near ATM cluster during peak hours",
                  "victim_cluster": "Run awareness drive + door-to-door advisory in locality",
                  "digital_arrest": "Coordinate with telecom nodal officer for live interception"}.get(
            dominant, "Increase patrol frequency in this sector")
        results.append({"h3_index": h3_index, "center_lat": lat, "center_lng": lng,
                        "priority_score": round(data["score"], 2), "incident_count": data["count"],
                        "dominant_crime_type": dominant, "recommended_action": action})
    return results
