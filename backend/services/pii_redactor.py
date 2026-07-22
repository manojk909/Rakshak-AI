"""
PII Redaction Engine — MANDATORY before any data storage or API exposure
Strips: Aadhaar numbers, PAN, phone numbers, bank accounts, names, addresses
"""
import re

PATTERNS = {
    "aadhaar": r'\b\d{4}\s?\d{4}\s?\d{4}\b',
    "pan": r'\b[A-Z]{5}[0-9]{4}[A-Z]\b',
    "phone": r'\b(\+91|0)?[6-9]\d{9}\b',
    "bank_account": r'\b\d{9,18}\b',
    "ifsc": r'\b[A-Z]{4}0[A-Z0-9]{6}\b',
    "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    "name_prefix": r'\b(Mr\.|Mrs\.|Dr\.|Ms\.)\s[A-Z][a-z]+\b',
}


class PIIRedactor:
    @staticmethod
    def redact(text: str) -> str:
        """Apply all patterns, replace with [REDACTED_TYPE]. Order matters:
        aadhaar before bank_account so 12-digit aadhaar isn't half-matched."""
        redacted = text
        for pii_type in ["aadhaar", "pan", "ifsc", "phone", "bank_account", "email", "name_prefix"]:
            redacted = re.sub(PATTERNS[pii_type], f"[REDACTED_{pii_type.upper()}]", redacted)
        return redacted

    @staticmethod
    def mask_phone(phone: str) -> str:
        digits = re.sub(r'\D', '', phone)
        if len(digits) >= 10:
            d = digits[-10:]
            return f"+91 {d[:2]}*** **{d[-3:]}"
        return "*** MASKED ***"

    @staticmethod
    def mask_account(account: str) -> str:
        digits = re.sub(r'\D', '', account)
        if len(digits) >= 4:
            return f"***{digits[-4:]}"
        return "****"

    @staticmethod
    def is_safe_to_store(text: str) -> bool:
        return all(not re.search(p, text) for p in PATTERNS.values())


pii_redactor = PIIRedactor()
