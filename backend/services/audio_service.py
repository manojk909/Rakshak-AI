"""
Audio Processing Pipeline
Transcribes audio (Whisper base) → detects voice spoofing (librosa heuristics)
→ analyzes transcript for scam content (Gemini).
"""
import logging
import os
import tempfile

import numpy as np

logger = logging.getLogger("rakshak.audio")


class AudioService:
    def __init__(self):
        self._whisper_model = None  # lazy-loaded: free-tier memory friendly

    def _get_whisper(self):
        if self._whisper_model is None:
            import whisper
            self._whisper_model = whisper.load_model("base")  # NOT large — too slow
        return self._whisper_model

    async def transcribe_audio(self, audio_bytes: bytes, language: str = None) -> dict:
        tmp_path = None
        try:
            with tempfile.NamedTemporaryFile(suffix=".audio", delete=False) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name
            model = self._get_whisper()
            result = model.transcribe(tmp_path, language=language, fp16=False)
            return {
                "text": result.get("text", "").strip(),
                "language": result.get("language", language or "unknown"),
                "segments": [{"start": s["start"], "end": s["end"], "text": s["text"]}
                             for s in result.get("segments", [])[:50]],
            }
        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            return {"text": "", "language": "unknown", "segments": [], "error": str(e)}
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)

    async def detect_voice_spoofing(self, audio_bytes: bytes) -> dict:
        """Heuristic spoof detection: deepfake voices trend toward flat pitch,
        too-perfect timing, and minimal background noise."""
        tmp_path = None
        try:
            import librosa
            with tempfile.NamedTemporaryFile(suffix=".audio", delete=False) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name
            y, sr = librosa.load(tmp_path, sr=16000, mono=True, duration=60)
            indicators = []
            score = 0.0
            # 1. Pitch flatness
            f0 = librosa.yin(y, fmin=60, fmax=400, sr=sr)
            f0_voiced = f0[(f0 > 60) & (f0 < 400)]
            pitch_var = float(np.std(f0_voiced)) if len(f0_voiced) > 10 else 0.0
            if pitch_var < 15:
                score += 0.35
                indicators.append("unusually_flat_pitch")
            # 2. Background noise floor (too clean = studio/synthetic)
            rms = librosa.feature.rms(y=y)[0]
            noise_floor = float(np.percentile(rms, 10))
            if noise_floor < 0.002:
                score += 0.30
                indicators.append("minimal_background_noise")
            # 3. Silence pattern regularity (too-perfect timing)
            silent = rms < (0.15 * float(np.mean(rms)))
            transitions = int(np.sum(np.abs(np.diff(silent.astype(int)))))
            duration_s = len(y) / sr
            if duration_s > 5 and transitions / duration_s < 0.4:
                score += 0.20
                indicators.append("regular_speech_timing")
            # 4. Spectral flatness (synthetic voices skew flatter)
            flatness = float(np.mean(librosa.feature.spectral_flatness(y=y)))
            if flatness > 0.30:
                score += 0.15
                indicators.append("high_spectral_flatness")
            spoof_probability = round(min(score, 0.99), 2)
            confidence = "high" if len(indicators) >= 3 else "medium" if len(indicators) == 2 else "low"
            return {"spoof_probability": spoof_probability, "confidence": confidence, "indicators": indicators}
        except Exception as e:
            logger.error(f"Spoof detection failed: {e}")
            return {"spoof_probability": 0.0, "confidence": "unavailable", "indicators": [], "error": str(e)}
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.unlink(tmp_path)

    async def analyze_audio_file(self, audio_bytes: bytes) -> dict:
        """Full pipeline: transcribe → detect spoofing → analyze text for scam."""
        from services.gemini_service import gemini_service
        transcription = await self.transcribe_audio(audio_bytes)
        spoofing = await self.detect_voice_spoofing(audio_bytes)
        scam_analysis = {}
        if transcription.get("text"):
            scam_analysis = await gemini_service.analyze_scam_text(transcription["text"])
        return {"transcription": transcription, "voice_spoofing": spoofing, "scam_analysis": scam_analysis}


audio_service = AudioService()
