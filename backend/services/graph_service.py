"""
Fraud Network Graph Intelligence
Maintains in-memory NetworkX graph synced with MongoDB.
Provides: PageRank, betweenness centrality, connected components, hub detection,
cross-jurisdiction ring detection.
"""
import networkx as nx


class GraphService:
    def __init__(self):
        self.G = nx.DiGraph()

    def build_from_db(self, nodes: list, edges: list):
        self.G.clear()
        for n in nodes:
            self.G.add_node(n["node_id"], **{k: v for k, v in n.items() if k != "node_id"})
        for e in edges:
            if e["source_node_id"] in self.G and e["target_node_id"] in self.G:
                self.G.add_edge(e["source_node_id"], e["target_node_id"],
                                **{k: v for k, v in e.items() if k not in ("source_node_id", "target_node_id")})

    def add_node(self, node: dict):
        self.G.add_node(node["node_id"], **{k: v for k, v in node.items() if k != "node_id"})

    def add_edge(self, edge: dict):
        self.G.add_edge(edge["source_node_id"], edge["target_node_id"],
                        **{k: v for k, v in edge.items() if k not in ("source_node_id", "target_node_id")})

    def compute_pagerank(self) -> dict:
        if self.G.number_of_nodes() == 0:
            return {}
        scores = nx.pagerank(self.G, alpha=0.85)
        nx.set_node_attributes(self.G, scores, "pagerank_score")
        return scores

    def compute_centrality(self) -> dict:
        if self.G.number_of_nodes() == 0:
            return {}
        # k-sampling keeps this fast on free-tier hardware for larger graphs
        k = min(200, self.G.number_of_nodes())
        scores = nx.betweenness_centrality(self.G, k=k, normalized=True)
        nx.set_node_attributes(self.G, scores, "centrality_score")
        return scores

    def find_hubs(self, threshold: float = 0.05) -> list:
        hubs = []
        for node_id, data in self.G.nodes(data=True):
            if data.get("pagerank_score", 0) > threshold:
                self.G.nodes[node_id]["is_hub"] = True
                hubs.append({"node_id": node_id, **data})
        return hubs

    def find_fraud_rings(self) -> list:
        """Connected components (undirected view) with 3+ suspect-type nodes."""
        rings = []
        suspect_types = {"suspect_phone", "mule_account", "fraud_compound", "ip_address"}
        for i, comp in enumerate(nx.weakly_connected_components(self.G)):
            suspects = [n for n in comp if self.G.nodes[n].get("node_type") in suspect_types]
            if len(suspects) >= 3:
                rings.append({
                    "ring_id": f"RING-{i:03d}",
                    "node_count": len(comp),
                    "suspect_count": len(suspects),
                    "node_ids": list(comp)[:100],
                })
        return rings

    def find_cross_jurisdiction_rings(self) -> list:
        """For each component, collect distinct states; if a component touches 2+
        states, mark all its nodes is_cross_jurisdiction=True and set linked_states.
        Supports the 'link across jurisdictions' evidence requirement."""
        rings = []
        for i, comp in enumerate(nx.weakly_connected_components(self.G)):
            states = sorted({self.G.nodes[n].get("state", "") for n in comp} - {""})
            if len(states) >= 2:
                for n in comp:
                    self.G.nodes[n]["is_cross_jurisdiction"] = True
                    self.G.nodes[n]["linked_states"] = states
                rings.append({
                    "ring_id": f"XJ-RING-{i:03d}",
                    "linked_states": states,
                    "node_count": len(comp),
                    "node_ids": list(comp)[:100],
                })
        return rings

    def get_subgraph(self, node_id: str, depth: int = 2):
        if node_id not in self.G:
            return nx.DiGraph()
        undirected = self.G.to_undirected(as_view=True)
        nodes = nx.single_source_shortest_path_length(undirected, node_id, cutoff=depth).keys()
        return self.G.subgraph(nodes)

    def to_cytoscape_format(self, graph=None, max_nodes: int = 500) -> dict:
        g = graph if graph is not None else self.G
        node_ids = list(g.nodes())[:max_nodes]
        node_set = set(node_ids)
        nodes = [{"data": {"id": nid, **{k: v for k, v in g.nodes[nid].items()
                                         if k not in ("_id", "created_at")}}} for nid in node_ids]
        edges = [{"data": {"id": d.get("edge_id", f"{u}-{v}"), "source": u, "target": v,
                           "relationship_type": d.get("relationship_type", ""),
                           "amount_inr": d.get("amount_inr", 0)}}
                 for u, v, d in g.edges(data=True) if u in node_set and v in node_set]
        return {"nodes": nodes, "edges": edges}

    def get_summary_stats(self) -> dict:
        node_types = {}
        cities, states = set(), set()
        total_amount = 0
        for _, data in self.G.nodes(data=True):
            node_types[data.get("node_type", "unknown")] = node_types.get(data.get("node_type", "unknown"), 0) + 1
            if data.get("city"):
                cities.add(data["city"])
            if data.get("state"):
                states.add(data["state"])
            total_amount += data.get("total_transactions_inr", 0)
        top_hubs = sorted(
            [{"node_id": n, "label": d.get("label", n), "pagerank": round(d.get("pagerank_score", 0), 4)}
             for n, d in self.G.nodes(data=True)],
            key=lambda x: x["pagerank"], reverse=True)[:5]
        return {
            "node_count": self.G.number_of_nodes(),
            "edge_count": self.G.number_of_edges(),
            "top_hubs": top_hubs,
            "total_amount_inr": total_amount,
            "cities": sorted(cities)[:15],
            "states": sorted(states),
            "victim_count": node_types.get("victim", 0),
            "suspect_count": node_types.get("suspect_phone", 0),
            "node_types": node_types,
        }


graph_service = GraphService()
