"""Async seeder — called on app startup when the database is empty.
Also pre-computes PageRank/centrality and the two DetectionMetricsSnapshot
records so the dashboard has metrics immediately (per master prompt §7)."""
import logging

import networkx as nx

logger = logging.getLogger("rakshak.seed")


async def seed_all(db):
    from data.generate_synthetic import generate_all
    data = generate_all()

    # Pre-compute realistic PageRank + centrality before insert
    G = nx.DiGraph()
    for n in data["graph_nodes"]:
        G.add_node(n["node_id"])
    for e in data["graph_edges"]:
        G.add_edge(e["source_node_id"], e["target_node_id"])
    pagerank = nx.pagerank(G, alpha=0.85)
    centrality = nx.betweenness_centrality(G, k=min(150, G.number_of_nodes()), normalized=True)
    for n in data["graph_nodes"]:
        n["pagerank_score"] = round(pagerank.get(n["node_id"], 0), 6)
        n["centrality_score"] = round(centrality.get(n["node_id"], 0), 6)
        n["is_hub"] = n["pagerank_score"] > 0.005

    for collection, docs in data.items():
        if docs:
            await db[collection].delete_many({})
            await db[collection].insert_many(docs)
            logger.info(f"Seeded {len(docs)} docs → {collection}")

    # Pre-compute detection metrics snapshots (scam_detection + counterfeit_check)
    from services.metrics_service import metrics_service
    await metrics_service.compute_scam_detection_metrics(db)
    await metrics_service.compute_counterfeit_metrics(db)
    logger.info("Pre-computed detection metrics snapshots")
