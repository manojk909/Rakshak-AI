"""Sarvam AI — Indian language translation + TTS, with graceful fallbacks."""
import os
import base64
import logging
import httpx

logger = logging.getLogger("rakshak.sarvam")

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")
TRANSLATE_URL = "https://api.sarvam.ai/translate"
TTS_URL = "https://api.sarvam.ai/text-to-speech"

LANG_CODES = {"en": "en-IN", "hi": "hi-IN", "ta": "ta-IN", "te": "te-IN",
              "bn": "bn-IN", "kn": "kn-IN", "mr": "mr-IN", "gu": "gu-IN"}


class SarvamService:
    def _code(self, lang: str) -> str:
        return LANG_CODES.get(lang, lang if "-" in lang else "en-IN")

    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        if not SARVAM_API_KEY:
            return text + " (translation unavailable)"
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(TRANSLATE_URL, json={
                    "input": text,
                    "source_language_code": self._code(source_lang),
                    "target_language_code": self._code(target_lang),
                    "model": "mayura:v1",
                }, headers={"api-subscription-key": SARVAM_API_KEY})
                resp.raise_for_status()
                return resp.json().get("translated_text", text)
        except Exception as e:
            logger.error(f"Sarvam translate failed: {e}")
            return text + " (translation unavailable)"

    async def text_to_speech(self, text: str, language: str, speaker: str = "meera") -> bytes | None:
        if not SARVAM_API_KEY:
            return None
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(TTS_URL, json={
                    "inputs": [text[:500]],
                    "target_language_code": self._code(language),
                    "speaker": speaker,
                    "model": "bulbul:v1",
                }, headers={"api-subscription-key": SARVAM_API_KEY})
                resp.raise_for_status()
                audios = resp.json().get("audios", [])
                if audios:
                    return base64.b64decode(audios[0])
        except Exception as e:
            logger.error(f"Sarvam TTS failed: {e}")
        return None


sarvam_service = SarvamService()
