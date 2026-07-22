"""
Counterfeit Currency Check — heuristic, rules-based proof-of-concept.
NOT a trained deep-learning classifier (no restricted training image dataset).
Structural checks against public RBI note specifications using OpenCV + Pillow.
Images are processed in-memory, hashed, and DISCARDED — never persisted.
"""
import io
import json
import logging
import os

import cv2
import numpy as np
from PIL import Image

logger = logging.getLogger("rakshak.counterfeit")

FEATURES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "note_security_features.json")


class CounterfeitService:
    def __init__(self):
        self.reference_features = self._load_reference_features()

    def _load_reference_features(self) -> dict:
        try:
            with open(FEATURES_PATH) as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Could not load note_security_features.json: {e}")
            return {}

    def _crop_region(self, img: np.ndarray, x_pct: list, y_pct: list) -> np.ndarray:
        h, w = img.shape[:2]
        x1, x2 = int(x_pct[0] * w), int(x_pct[1] * w)
        y1, y2 = int(y_pct[0] * h), int(y_pct[1] * h)
        return img[y1:y2, x1:x2]

    def check_security_thread_position(self, gray: np.ndarray, ref: dict) -> bool:
        """Expect a strong vertical dark line inside the reference thread band."""
        band = self._crop_region(gray, ref["security_thread_x_pct"], [0.1, 0.9])
        if band.size == 0:
            return False
        col_means = band.mean(axis=0)
        overall = gray.mean()
        return bool(col_means.min() < overall * 0.72)

    def check_microprint_zone_sharpness(self, gray: np.ndarray, ref: dict) -> bool:
        """Laplacian variance in expected microprint zone; blurry/absent = fail."""
        zone = ref["microprint_zone"]
        region = self._crop_region(gray, zone["x_pct"], zone["y_pct"])
        if region.size == 0:
            return False
        variance = cv2.Laplacian(region, cv2.CV_64F).var()
        return bool(variance > 120.0)

    def check_serial_number_consistency(self, gray: np.ndarray, ref: dict) -> bool:
        """Font height/spacing variance across serial characters via contours."""
        band = ref["serial_number_band"]
        region = self._crop_region(gray, band["x_pct"], band["y_pct"])
        if region.size == 0:
            return False
        _, thresh = cv2.threshold(region, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        rh = region.shape[0]
        heights = [cv2.boundingRect(c)[3] for c in contours
                   if rh * 0.25 < cv2.boundingRect(c)[3] < rh * 0.95]
        if len(heights) < 4:
            return False  # can't find a plausible serial — suspicious
        cv_ratio = float(np.std(heights)) / max(float(np.mean(heights)), 1e-6)
        return bool(cv_ratio < 0.22)  # genuine serial fonts are uniform

    def simulate_uv_feature_region(self, gray: np.ndarray, ref: dict) -> bool:
        """SIMULATED check (no real UV sensor): latent-image band contrast presence."""
        region_ref = ref["latent_image_region"]
        region = self._crop_region(gray, region_ref["x_pct"], region_ref["y_pct"])
        if region.size == 0:
            return False
        contrast = float(region.std())
        return bool(contrast > 18.0)

    async def analyze_note_image(self, image_bytes: bytes, denomination: int) -> dict:
        ref = self.reference_features.get(str(denomination))
        if not ref:
            return {"verdict": "suspicious", "confidence": 0.0,
                    "checks_performed": [], "checks_failed": [],
                    "error": f"No reference features for ₹{denomination}"}
        # 1. Load + normalize (in-memory only)
        pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
        h, w = img.shape[:2]
        if w < h:  # notes are landscape — normalize orientation
            img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        img = cv2.resize(img, (1200, int(1200 * img.shape[0] / img.shape[1])))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        checks = {
            "security_thread_position": self.check_security_thread_position(gray, ref),
            "microprint_zone_check": self.check_microprint_zone_sharpness(gray, ref),
            "serial_font_consistency": self.check_serial_number_consistency(gray, ref),
            "uv_feature_simulation": self.simulate_uv_feature_region(gray, ref),
        }
        checks_performed = list(checks.keys())
        checks_failed = [name for name, passed in checks.items() if not passed]
        failed_count = len(checks_failed)
        verdict = ("likely_genuine" if failed_count == 0
                   else "suspicious" if failed_count == 1
                   else "likely_counterfeit")
        confidence = round(1 - (failed_count / len(checks_performed)), 2)  # heuristic only
        return {"verdict": verdict, "confidence": confidence,
                "checks_performed": checks_performed, "checks_failed": checks_failed}


counterfeit_service = CounterfeitService()
