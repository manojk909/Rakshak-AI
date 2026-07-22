"""Alert & agency coordination — records AgencyAction docs, simulates dispatch."""
import uuid
from datetime import datetime, timezone


class AlertService:
    async def record_action(self, db, case_id: str, agency: str, action_type: str,
                            details: str, operator: str = "system") -> dict:
        action = {
            "action_id": str(uuid.uuid4()),
            "case_id": case_id,
            "agency": agency,
            "action_type": action_type,
            "operator": operator,
            "timestamp": datetime.now(timezone.utc),
            "details": details,
            "success": True,
        }
        await db.agency_actions.insert_one({**action})
        return action

    async def block_telecom(self, db, case_id: str, reason: str, operator: str) -> dict:
        await db.fraud_cases.update_one(
            {"case_id": case_id},
            {"$set": {"status": "blocked", "updated_at": datetime.now(timezone.utc)}})
        return await self.record_action(
            db, case_id, "Telecom_Nodal_Jio", "telecom_block",
            f"Number block requested via telecom nodal officer. Reason: {reason}", operator)

    async def alert_victim(self, db, case_id: str, channel: str, operator: str) -> dict:
        return await self.record_action(
            db, case_id, "I4C", "victim_alert_sms",
            f"[SIMULATED] Victim warning dispatched via {channel}: 'This call is a known scam pattern. "
            "Disconnect immediately. Do not transfer money. Call 1930.'", operator)

    async def broadcast(self, db, message: str, agencies: list, case_id: str, operator: str) -> dict:
        broadcast_id = str(uuid.uuid4())
        for agency in agencies:
            await self.record_action(db, case_id or "", agency, "broadcast_alert",
                                     f"[BROADCAST {broadcast_id[:8]}] {message}", operator)
        return {"broadcast_id": broadcast_id, "agencies_notified": len(agencies)}


alert_service = AlertService()
