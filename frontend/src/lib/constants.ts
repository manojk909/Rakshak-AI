export const COLORS = {
  lime: '#ccff00',
  obsidian: '#0a0a0a',
  slate900: '#0f172a',
};

export const SCAM_TYPE_LABELS: Record<string, string> = {
  digital_arrest: 'Digital Arrest Scam',
  customs_duty: 'Customs Duty Fraud',
  trai_disconnection: 'TRAI Disconnection Threat',
  aadhaar_misuse: 'Aadhaar Misuse Scam',
  kyc_fraud: 'KYC / OTP Fraud',
  tax_refund: 'Tax Refund Scam',
  legitimate: 'Legitimate',
};

export const URGENCY_STYLES: Record<string, { border: string; badge: string; text: string }> = {
  critical: { border: 'border-red-500/60', badge: 'bg-red-500 text-white', text: 'text-red-400' },
  high: { border: 'border-amber-500/60', badge: 'bg-amber-500 text-black', text: 'text-amber-400' },
  medium: { border: 'border-yellow-500/40', badge: 'bg-yellow-500 text-black', text: 'text-yellow-400' },
  low: { border: 'border-slate-600', badge: 'bg-slate-600 text-white', text: 'text-slate-400' },
};

export const AGENCIES = ['I4C', 'Telecom_Nodal_Jio', 'Telecom_Nodal_Airtel', 'FIU_IND', 'State_Cyber_Cell'];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

export const QUICK_PROMPTS = [
  'Someone claiming to be from CBI called me',
  'I got a WhatsApp message about a parcel',
  'My bank said my KYC will expire',
];

export const DENOMINATIONS = [10, 20, 50, 100, 200, 500, 2000];

export const CHECK_LABELS: Record<string, string> = {
  security_thread_position: 'Security Thread Position',
  microprint_zone_check: 'Microprint Zone Sharpness',
  serial_font_consistency: 'Serial Number Font Consistency',
  uv_feature_simulation: 'UV Feature (Simulated)',
};
