"""
Detection Metrics — precision, recall, false positive rate, avg detection lead time.
Computed ONLY against synthetic ground_truth_* labels (real cases have no ground truth).
"""
import uuid
from datetime import datetime, timezone


def _safe_div(a: float, b: float) -> float:
    return round(a / b, 4) if b else 0.0


class MetricsService:
    async def compute_scam_detection_metrics(self, db) -> dict:
        tp = fp = fn = tn = 0
        lead_times = []
        cursor = db.fraud_cases.find({"ground_truth_is_scam": {"$ne": None}},
                                     {"scam_probability": 1, "ground_truth_is_scam": 1, "detected_at_seconds": 1})
        async for doc in cursor:
            predicted = doc.get("scam_probability", 0) > 0.5
            actual = bool(doc.get("ground_truth_is_scam"))
            if predicted and actual:
                tp += 1
                lead_times.append(doc.get("detected_at_seconds", 0))
            elif predicted and not actual:
                fp += 1
            elif not predicted and actual:
                fn += 1
            else:
                tn += 1
        cursor = db.citizen_reports.find({"ground_truth_is_scam": {"$ne": None}},
                                         {"scam_probability": 1, "ground_truth_is_scam": 1})
        async for doc in cursor:
            predicted = doc.get("scam_probability", 0) > 0.5
            actual = bool(doc.get("ground_truth_is_scam"))
            if predicted and actual:
                tp += 1
            elif predicted and not actual:
                fp += 1
            elif not predicted and actual:
                fn += 1
            else:
                tn += 1
        snapshot = {
            "snapshot_id": str(uuid.uuid4()),
            "computed_at": datetime.now(timezone.utc),
            "module": "scam_detection",
            "precision": _safe_div(tp, tp + fp),
            "recall": _safe_div(tp, tp + fn),
            "false_positive_rate": _safe_div(fp, fp + tn),
            "avg_lead_time_seconds": round(sum(lead_times) / len(lead_times), 1) if lead_times else 0.0,
            "sample_size": tp + fp + fn + tn,
        }
        await db.detection_metrics.insert_one({**snapshot})
        return snapshot

    async def compute_counterfeit_metrics(self, db) -> dict:
        tp = fp = fn = tn = 0
        cursor = db.counterfeit_checks.find({"ground_truth_is_fake": {"$ne": None}},
                                            {"verdict": 1, "ground_truth_is_fake": 1})
        async for doc in cursor:
            predicted = doc.get("verdict") != "likely_genuine"
            actual = bool(doc.get("ground_truth_is_fake"))
            if predicted and actual:
                tp += 1
            elif predicted and not actual:
                fp += 1
            elif not predicted and actual:
                fn += 1
            else:
                tn += 1
        snapshot = {
            "snapshot_id": str(uuid.uuid4()),
            "computed_at": datetime.now(timezone.utc),
            "module": "counterfeit_check",
            "precision": _safe_div(tp, tp + fp),
            "recall": _safe_div(tp, tp + fn),
            "false_positive_rate": _safe_div(fp, fp + tn),
            "avg_lead_time_seconds": 0.0,
            "sample_size": tp + fp + fn + tn,
        }
        await db.detection_metrics.insert_one({**snapshot})
        return snapshot


metrics_service = MetricsService()
