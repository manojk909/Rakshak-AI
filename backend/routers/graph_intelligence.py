"""Fraud network graph intelligence endpoints."""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from models.database import get_db
from models.schemas import AddGraphReportRequest
from services.graph_service import graph_service
from services.gemini_service import gemini_service
from services.pii_redactor import pii_redactor
from utils.security import get_current_user

router = APIRouter()


@router.get("/network")
async def network(user: dict = Depends(get_current_user)):
    cyto = graph_service.to_cytoscape_format()
    stats = graph_service.get_summary_stats()
    hubs = graph_service.find_hubs()
    return {**cyto, "stats": {"node_count": stats["node_count"], "edge_count": stats["edge_count"],
                              "hub_count": len(hubs), "total_transactions_inr": stats["total_amount_inr"]}}


@router.get("/case/{case_id}")
async def case_network(case_id: str, user: dict = Depends(get_current_user)):
    db = get_db()
    node = await db.graph_nodes.find_one({"connected_cases": case_id}, {"_id": 0})
    if not node:
        raise HTTPException(status_code=404, detail="No graph nodes linked to this case")
    sub = graph_service.get_subgraph(node["node_id"], depth=2)
    return graph_service.to_cytoscape_format(sub)


@router.post("/analyze")
async def analyze(user: dict = Depends(get_current_user)):
    db = get_db()
    pagerank = graph_service.compute_pagerank()
    centrality = graph_service.compute_centrality()
    hubs = graph_service.find_hubs()
    rings = graph_service.find_fraud_rings()
    xj_rings = graph_service.find_cross_jurisdiction_rings()
    # Persist scores back to MongoDB
    for node_id, score in list(pagerank.items()):
        await db.graph_nodes.update_one({"node_id": node_id}, {"$set": {
            "pagerank_score": score,
            "centrality_score": centrality.get(node_id, 0),
            "is_hub": score > 0.05,
            "is_cross_jurisdiction": graph_service.G.nodes[node_id].get("is_cross_jurisdiction", False),
            "linked_states": graph_service.G.nodes[node_id].get("linked_states", []),
        }})
    summary = graph_service.get_summary_stats()
    intelligence = await gemini_service.analyze_fraud_network(summary)
    return {"hubs": [{k: v for k, v in h.items() if k not in ("_id", "created_at")} for h in hubs[:20]],
            "rings": rings[:20], "cross_jurisdiction_rings": xj_rings[:20],
            "gemini_intelligence": intelligence,
            "computed_at": datetime.now(timezone.utc).isoformat()}


@router.get("/top-hubs")
async def top_hubs():
    db = get_db()
    return await db.graph_nodes.find({}, {"_id": 0}).sort("pagerank_score", -1).to_list(10)


@router.get("/cross-jurisdiction-rings")
async def cross_jurisdiction_rings(user: dict = Depends(get_current_user)):
    rings = graph_service.find_cross_jurisdiction_rings()
    return {"rings": rings, "count": len(rings)}


@router.post("/add-report")
async def add_report(body: AddGraphReportRequest):
    db = get_db()
    now = datetime.now(timezone.utc)
    masked = pii_redactor.mask_phone(body.caller_number)
    suspect_id = f"phone-{masked.replace(' ', '').replace('*', 'x').replace('+', '')}"
    victim_id = f"victim-{uuid.uuid4().hex[:8]}"
    connected_existing = suspect_id in graph_service.G
    nodes_added = 0
    if not connected_existing:
        suspect = {"node_id": suspect_id, "node_type": "suspect_phone", "label": f"Suspect {masked}",
                   "masked_value": masked, "city": body.victim_city, "state": "",
                   "pagerank_score": 0.0, "centrality_score": 0.0, "connected_cases": [],
                   "total_transactions_inr": body.amount_inr, "risk_level": "high", "is_hub": False,
                   "linked_states": [], "is_cross_jurisdiction": False, "created_at": now}
        graph_service.add_node(suspect)
        await db.graph_nodes.update_one({"node_id": suspect_id}, {"$setOnInsert": suspect}, upsert=True)
        nodes_added += 1
    victim = {"node_id": victim_id, "node_type": "victim", "label": f"Victim ({body.victim_city})",
              "masked_value": "anonymous", "city": body.victim_city, "state": "",
              "pagerank_score": 0.0, "centrality_score": 0.0, "connected_cases": [],
              "total_transactions_inr": body.amount_inr, "risk_level": "medium", "is_hub": False,
              "linked_states": [], "is_cross_jurisdiction": False, "created_at": now}
    graph_service.add_node(victim)
    await db.graph_nodes.insert_one({**victim})
    nodes_added += 1
    edge = {"edge_id": str(uuid.uuid4()), "source_node_id": suspect_id, "target_node_id": victim_id,
            "relationship_type": "CALLED", "amount_inr": body.amount_inr, "timestamp": now,
            "case_id": "", "metadata": {"scam_type": body.scam_type}}
    graph_service.add_edge(edge)
    await db.graph_edges.insert_one({**edge})
    return {"nodes_added": nodes_added, "edges_added": 1, "connected_to_existing_ring": connected_existing}
