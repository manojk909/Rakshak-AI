"""
Evidence Hashing — Cryptographic chain of custody for legal admissibility
Every piece of evidence gets SHA-256 hash + timestamp on ingestion
"""
import hashlib
import json
from datetime import datetime, timezone


class EvidenceHasher:
    @staticmethod
    def hash_content(content: str, timestamp: datetime = None) -> tuple:
        """Returns (sha256_hex_string, hash_timestamp). Timestamp is UTC, immutable
        once set. Content + timestamp combined to prevent pre-image attacks."""
        if not timestamp:
            timestamp = datetime.now(timezone.utc)
        payload = f"{content}|{timestamp.isoformat()}"
        hash_value = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        return hash_value, timestamp

    @staticmethod
    def verify_integrity(content: str, stored_hash: str, stored_timestamp: datetime) -> bool:
        """Verify content hasn't been tampered with."""
        computed_hash, _ = EvidenceHasher.hash_content(content, stored_timestamp)
        return computed_hash == stored_hash

    @staticmethod
    def generate_evidence_package(case_id: str, content: str, metadata: dict) -> dict:
        """Court-admissible evidence package with content/metadata/chain hashes."""
        timestamp = datetime.now(timezone.utc)
        content_hash, _ = EvidenceHasher.hash_content(content, timestamp)
        metadata_json = json.dumps(metadata, sort_keys=True, default=str)
        metadata_hash = hashlib.sha256(metadata_json.encode("utf-8")).hexdigest()
        chain_hash = hashlib.sha256(f"{content_hash}{metadata_hash}".encode("utf-8")).hexdigest()
        return {
            "case_id": case_id,
            "content_hash": content_hash,
            "metadata_hash": metadata_hash,
            "chain_hash": chain_hash,
            "timestamp": timestamp.isoformat(),
            "hash_algorithm": "SHA-256",
            "custody_note": "Hash computed at ingestion; any post-hoc modification invalidates chain_hash.",
        }


evidence_hasher = EvidenceHasher()
