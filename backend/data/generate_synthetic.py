"""
Generates all synthetic data for RAKSHAK AI demo.
Run standalone:  python generate_synthetic.py  (seeds MongoDB via pymongo)
Or import the generate_* functions (used by seed_database.py at app startup).
"""
import hashlib
import json
import math
import os
import random
import uuid
from datetime import datetime, timedelta, timezone

import h3

random.seed(42)  # reproducible demo data

DATA_DIR = os.path.dirname(__file__)
with open(os.path.join(DATA_DIR, "indian_cities.json")) as f:
    CITIES = json.load(f)
with open(os.path.join(DATA_DIR, "scam_templates.json")) as f:
    TEMPLATES = json.load(f)

SURNAMES = ["Sharma", "Verma", "Gupta", "Iyer", "Reddy", "Nair", "Das", "Bose", "Patel", "Shah",
            "Singh", "Kumar", "Mehta", "Joshi", "Kulkarni", "Rao", "Chatterjee", "Mishra", "Yadav", "Khan"]
INITIALS = "ABCDGHJKMNPRSTV"
ANOMALIES = ["voip_relay_detected", "recent_sim_swap", "shared_imei_cluster", "burner_device_signature"]
INTL_ORIGINS = [("Pakistan", 31.5204, 74.3587), ("Myanmar", 16.8409, 96.1735), ("Cambodia", 11.5564, 104.9282)]

now = lambda: datetime.now(timezone.utc)


def _weighted(choices: list, weights: list):
    return random.choices(choices, weights=weights, k=1)[0]


def _recent_ts(days: int = 30) -> datetime:
    age = days * random.betavariate(1, 2.5)  # weighted toward recent
    return now() - timedelta(days=age, minutes=random.randint(0, 1440))


def _masked_number() -> str:
    return f"+91 {random.randint(60, 99)}*** **{random.randint(100, 999)}"


def _sha() -> str:
    return hashlib.sha256(uuid.uuid4().bytes).hexdigest()


def generate_fraud_cases(n: int = 500) -> list:
    cases = []
    for _ in range(n):
        city = random.choice(CITIES)
        scam_type = _weighted(
            ["digital_arrest", "customs_duty", "trai_disconnection", "aadhaar_misuse", "kyc_fraud", "tax_refund"],
            [40, 25, 15, 10, 5, 5])
        authority = {"digital_arrest": random.choice(["CBI", "ED", "Police"]), "customs_duty": "Customs",
                     "trai_disconnection": "TRAI", "aadhaar_misuse": "Police",
                     "kyc_fraud": None, "tax_refund": None}[scam_type]
        is_hard_negative = random.random() < 0.10  # 10% hard negatives
        prob = round(random.uniform(0.40, 0.60), 2) if is_hard_negative else round(random.uniform(0.75, 0.99), 2)
        ts = _recent_ts()
        lat = city["lat"] + random.uniform(-0.05, 0.05)
        lng = city["lng"] + random.uniform(-0.05, 0.05)
        template = random.choice([t for t in TEMPLATES if t["type"] == scam_type] or TEMPLATES)
        amount = int(min(2_500_000, max(10_000, random.lognormvariate(math.log(150_000), 1.0))))
        status = _weighted(["active", "investigating", "blocked", "resolved"], [30, 25, 35, 10])
        cases.append({
            "case_id": str(uuid.uuid4()), "timestamp": ts,
            "victim_name": f"{random.choice(INITIALS)}. {random.choice(SURNAMES)}",
            "victim_location_city": city["name"], "victim_location_lat": lat, "victim_location_lng": lng,
            "victim_location_h3": h3.latlng_to_cell(lat, lng, 7),
            "caller_number_masked": _masked_number(),
            "scam_type": scam_type, "authority_impersonated": authority,
            "scam_probability": prob,
            "voice_spoof_confidence": round(random.uniform(0.60, 0.95), 2),
            "script_match_percent": random.randint(45, 60) if is_hard_negative else random.randint(70, 99),
            "risk_triggers": random.sample(template["keywords"], min(3, len(template["keywords"]))),
            "caller_id_spoofed": random.random() < 0.85,
            "call_metadata_anomalies": random.sample(ANOMALIES, random.randint(1, 3)),
            "urgency_level": _weighted(["critical", "high", "medium", "low"], [20, 35, 30, 15]),
            "status": status,
            "transcript_snippet": template["template_text"][:200],
            "evidence_hash": _sha(),
            "amount_at_risk_inr": amount,
            "amount_lost_inr": 0 if status in ("blocked", "resolved") else int(amount * random.uniform(0, 0.6)),
            "channel": _weighted(["video_call", "voice_call", "whatsapp", "sms"], [35, 40, 15, 10]),
            "agency_assigned": random.choice(["I4C", "local_cyber_cell", "state_cid"]),
            # faster detection for high-probability cases → feeds avg lead time metric
            "detected_at_seconds": int(30 + (1 - prob) * 570 * random.uniform(0.6, 1.0)),
            "ground_truth_is_scam": not is_hard_negative,
            "created_at": ts, "updated_at": ts,
        })
    return cases


def generate_graph(cases: list) -> tuple:
    nodes, edges = [], []

    def make_node(node_type, label, masked, city, state, risk, amount=0, linked_states=None):
        return {"node_id": f"{node_type}-{uuid.uuid4().hex[:10]}", "node_type": node_type,
                "label": label, "masked_value": masked, "city": city, "state": state,
                "pagerank_score": 0.0, "centrality_score": 0.0,
                "connected_cases": random.sample([c["case_id"] for c in cases], random.randint(1, 4)),
                "total_transactions_inr": amount, "risk_level": risk, "is_hub": False,
                "linked_states": linked_states or [state] if state else [],
                "is_cross_jurisdiction": bool(linked_states and len(linked_states) >= 2),
                "created_at": now()}

    all_states = sorted({c["state"] for c in CITIES})
    compounds, suspects, victims, mules, ips = [], [], [], [], []
    hub_cities = [c for c in CITIES if c["name"] in ("Delhi", "Mumbai", "Bengaluru")]
    for i in range(50):  # fraud compounds — ~40% span 2+ states
        city = random.choice(hub_cities * 3 + CITIES)
        multi = random.random() < 0.40
        linked = sorted(random.sample(all_states, random.randint(2, 4))) if multi else [city["state"]]
        compounds.append(make_node("fraud_compound", f"Compound {chr(65 + i % 26)}{i}", "CLASSIFIED",
                                   city["name"], city["state"], "critical",
                                   random.randint(2_000_000, 60_000_000), linked))
    for i in range(200):
        city = random.choice(CITIES)
        suspects.append(make_node("suspect_phone", f"Suspect {_masked_number()}", _masked_number(),
                                  city["name"], city["state"], _weighted(["critical", "high", "medium"], [25, 50, 25]),
                                  random.randint(50_000, 5_000_000)))
    for i in range(300):
        city = random.choice(CITIES)
        victims.append(make_node("victim", f"{random.choice(INITIALS)}. {random.choice(SURNAMES)}",
                                 "anonymous", city["name"], city["state"], "medium",
                                 random.randint(10_000, 2_000_000)))
    for i in range(150):
        city = random.choice(CITIES)
        bank = random.choice(["HDFC", "SBI", "ICICI", "AXIS", "PNB"])
        mules.append(make_node("mule_account", f"{bank} ***{random.randint(1000, 9999)}",
                               f"{bank} ***{random.randint(1000, 9999)}", city["name"], city["state"],
                               _weighted(["critical", "high", "medium"], [20, 50, 30]),
                               random.randint(100_000, 10_000_000)))
    for i in range(100):
        city = random.choice(CITIES)
        ips.append(make_node("ip_address", f"IP {random.randint(10, 220)}.x.x.{random.randint(2, 254)}",
                             f"{random.randint(10, 220)}.***.***.{random.randint(2, 254)}",
                             city["name"], city["state"], "high", 0))
    nodes = compounds + suspects + victims + mules + ips

    def make_edge(src, dst, rel, amount=0):
        return {"edge_id": str(uuid.uuid4()), "source_node_id": src["node_id"],
                "target_node_id": dst["node_id"], "relationship_type": rel,
                "amount_inr": amount, "timestamp": _recent_ts(), "case_id": random.choice(src["connected_cases"]),
                "metadata": {}}

    for s in suspects:  # 200: each suspect controlled by a compound
        edges.append(make_edge(s, random.choice(compounds), "CONTROLLED_BY"))
    for _ in range(500):  # suspects call victims
        edges.append(make_edge(random.choice(suspects), random.choice(victims), "CALLED"))
    for _ in range(300):  # victims transfer to mules
        edges.append(make_edge(random.choice(victims), random.choice(mules), "TRANSFERRED_TO",
                               random.randint(10_000, 1_500_000)))
    for _ in range(140):  # suspects log from IPs
        edges.append(make_edge(random.choice(suspects), random.choice(ips), "LOGGED_FROM"))
    for _ in range(60):  # shared IMEI clusters
        a, b = random.sample(suspects, 2)
        edges.append(make_edge(a, b, "SHARES_IMEI"))
    return nodes, edges  # 800 nodes, 1200 edges


def generate_crime_locations(cases: list) -> list:
    locations = []

    def loc(lat, lng, city, state, crime_type, severity):
        return {"location_id": str(uuid.uuid4()), "lat": lat, "lng": lng, "city": city, "state": state,
                "crime_type": crime_type, "case_id": random.choice(cases)["case_id"],
                "h3_index": h3.latlng_to_cell(lat, lng, 7), "severity": severity, "timestamp": _recent_ts()}

    for _ in range(300):
        c = random.choice(CITIES)
        locations.append(loc(c["lat"] + random.uniform(-0.01, 0.01) * random.randint(1, 8),
                             c["lng"] + random.uniform(-0.01, 0.01) * random.randint(1, 8),
                             c["name"], c["state"], "victim_cluster",
                             _weighted(["critical", "high", "medium"], [15, 40, 45])))
    for _ in range(150):
        c = random.choice(CITIES)
        locations.append(loc(c["lat"] + random.uniform(-0.01, 0.01) * random.randint(1, 5),
                             c["lng"] + random.uniform(-0.01, 0.01) * random.randint(1, 5),
                             c["name"], c["state"], "mule_withdrawal",
                             _weighted(["critical", "high", "medium"], [20, 50, 30])))
    hub_cities = [c for c in CITIES if c["name"] in ("Delhi", "Mumbai", "Bengaluru")]
    for _ in range(100):
        c = random.choice(hub_cities * 3 + CITIES)
        locations.append(loc(c["lat"] + random.uniform(-0.01, 0.01) * random.randint(1, 4),
                             c["lng"] + random.uniform(-0.01, 0.01) * random.randint(1, 4),
                             c["name"], c["state"], "fraud_compound", "critical"))
    for _ in range(50):
        country, lat, lng = random.choice(INTL_ORIGINS)
        locations.append(loc(lat + random.uniform(-0.3, 0.3), lng + random.uniform(-0.3, 0.3),
                             country, "International", "digital_arrest", "critical"))
    return locations  # 600


MULTILINGUAL_DESCRIPTIONS = [
    ("en", "Someone claiming to be a CBI officer said my Aadhaar is linked to a drug parcel and I must stay on video call."),
    ("hi", "CBI अधिकारी बनकर किसी ने कहा कि मेरा आधार ड्रग पार्सल से जुड़ा है और मुझे वीडियो कॉल पर रहना होगा।"),
    ("hi", "बैंक KYC खत्म होने का मैसेज आया और OTP मांगा गया।"),
    ("ta", "கஸ்டம்ஸ் அலுவலகம் என்று கூறி என் பார்சலில் போதைப் பொருள் இருப்பதாக மிரட்டினர்."),
    ("te", "TRAI నుండి అని చెప్పి నా సిమ్ రద్దు అవుతుందని బెదిరించారు."),
    ("bn", "কাস্টমস অফিসার পরিচয় দিয়ে পার্সেল আটকের কথা বলে টাকা চাইল।"),
    ("kn", "ನನ್ನ ಆಧಾರ್ ದುರ್ಬಳಕೆ ಆಗಿದೆ ಎంದು ಪೋಲೀಸ್ ಹೆಸರಿನಲ್ಲಿ ಕರೆ बंದಿತ್ತು."),
    ("en", "Got a WhatsApp message saying my electricity will be cut tonight unless I call an officer and pay."),
    ("en", "My bank actually called about a genuine loan EMI reminder, wanted to double check."),
    ("hi", "इनकम टैक्स रिफंड के नाम पर बैंक डिटेल मांगी गई।"),
]


def generate_citizen_reports(n: int = 300) -> list:
    reports = []
    scam_types = ["digital_arrest", "customs_duty", "trai_disconnection", "aadhaar_misuse", "kyc_fraud", "tax_refund"]
    for i in range(n):
        lang, desc = random.choice(MULTILINGUAL_DESCRIPTIONS)
        city = random.choice(CITIES)
        labeled = i < int(n * 0.10)  # 10% subsample carries ground truth for FP-rate reporting
        is_scam = random.random() < 0.8
        prob = round(random.uniform(0.7, 0.98), 2) if is_scam else round(random.uniform(0.05, 0.55), 2)
        ts = _recent_ts()
        reports.append({
            "report_id": str(uuid.uuid4()), "timestamp": ts,
            "reporter_phone_hash": _sha(), "description": desc, "language": lang,
            "classified_scam_type": random.choice(scam_types) if is_scam else "legitimate",
            "scam_probability": prob,
            "rakshak_response": "VERDICT: SCAM ⚠️ — known fraud pattern. Call 1930." if is_scam else
                                "VERDICT: LIKELY SAFE ✅ — no fraud indicators found.",
            "status": _weighted(["received", "forwarded_ncrb", "resolved"], [50, 35, 15]),
            "ncrb_ref": f"NCRB-{ts.year}-{random.choice(['DL','MH','KA','TN','WB'])}-{uuid.uuid4().hex[:8].upper()}",
            "ground_truth_is_scam": is_scam if labeled else None,
            "created_at": ts,
        })
    return reports


def generate_counterfeit_checks(n: int = 120) -> list:
    checks = []
    all_checks = ["security_thread_position", "microprint_zone_check", "serial_font_consistency", "uv_feature_simulation"]
    for _ in range(n):
        denom = _weighted([10, 20, 50, 100, 200, 500, 2000], [4, 4, 6, 10, 8, 40, 28])
        verdict = _weighted(["likely_genuine", "suspicious", "likely_counterfeit"], [70, 20, 10])
        failed = {"likely_genuine": 0, "suspicious": 1, "likely_counterfeit": random.randint(2, 4)}[verdict]
        checks_failed = random.sample(all_checks, failed)
        aligned = random.random() < 0.85  # 15% deliberate hard-case mismatch
        predicted_fake = verdict != "likely_genuine"
        ts = _recent_ts()
        checks.append({
            "check_id": str(uuid.uuid4()), "timestamp": ts, "denomination": denom,
            "verdict": verdict, "confidence": round(1 - failed / 4, 2),
            "checks_performed": all_checks, "checks_failed": checks_failed,
            "image_hash": _sha(),  # no real images generated or stored
            "location_city": random.choice(CITIES)["name"],
            "operator_type": _weighted(["citizen", "bank_teller", "field_officer"], [50, 35, 15]),
            "ground_truth_is_fake": predicted_fake if aligned else not predicted_fake,
            "created_at": ts,
        })
    return checks


def generate_kpi_snapshots() -> list:
    snaps = []
    for d in range(5):
        day = now() - timedelta(days=d)
        snaps.append({"snapshot_id": str(uuid.uuid4()), "date": day.strftime("%Y-%m-%d"),
                      "active_threats": random.randint(18, 28),
                      "victim_interventions": random.randint(120, 180),
                      "calls_blocked": random.randint(45, 85),
                      "amount_protected_inr": random.randint(5_000_000, 20_000_000),
                      "created_at": day})
    return snaps


def generate_agency_actions(cases: list, n: int = 50) -> list:
    agencies = ["I4C", "Telecom_Nodal_Jio", "Telecom_Nodal_Airtel", "FIU_IND", "State_Cyber_Cell"]
    details = {
        "telecom_block": "Suspect MSISDN blocked at switch level; IMEI greylisted nationally.",
        "account_freeze": "Mule account frozen under PMLA §17; FIU-IND STR filed.",
        "victim_alert_sms": "Preemptive victim warning SMS delivered; call disconnected by victim.",
        "dispatch_team": "Field unit dispatched to suspected compound; local PS informed.",
        "broadcast_alert": "Inter-state alert issued: matching script detected across 3 districts.",
    }
    actions = []
    for _ in range(n):
        action_type = _weighted(list(details.keys()), [25, 20, 30, 10, 15])
        actions.append({"action_id": str(uuid.uuid4()), "case_id": random.choice(cases)["case_id"],
                        "agency": random.choice(agencies), "action_type": action_type,
                        "operator": random.choice(["op_sharma", "op_reddy", "op_khan", "system"]),
                        "timestamp": _recent_ts(7), "details": details[action_type],
                        "success": random.random() < 0.93})
    return actions


def generate_all() -> dict:
    cases = generate_fraud_cases(500)
    nodes, edges = generate_graph(cases)
    return {
        "fraud_cases": cases,
        "graph_nodes": nodes,
        "graph_edges": edges,
        "crime_locations": generate_crime_locations(cases),
        "citizen_reports": generate_citizen_reports(300),
        "counterfeit_checks": generate_counterfeit_checks(120),
        "kpi_snapshots": generate_kpi_snapshots(),
        "agency_actions": generate_agency_actions(cases, 50),
    }


if __name__ == "__main__":
    from pymongo import MongoClient
    from dotenv import load_dotenv
    load_dotenv()
    client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
    db = client[os.getenv("DATABASE_NAME", "rakshak_ai")]
    data = generate_all()
    for collection, docs in data.items():
        db[collection].delete_many({})
        db[collection].insert_many(docs)
        print(f"Seeded {len(docs):>5} docs → {collection}")
    print("Done. Run the API and hit /api/dashboard/metrics to compute detection metrics.")
