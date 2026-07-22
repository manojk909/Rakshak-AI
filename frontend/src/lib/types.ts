export interface FraudCase {
  case_id: string;
  timestamp: string;
  victim_name: string;
  victim_location_city: string;
  victim_location_lat: number;
  victim_location_lng: number;
  caller_number_masked: string;
  scam_type: string;
  authority_impersonated: string | null;
  scam_probability: number;
  voice_spoof_confidence: number;
  script_match_percent: number;
  risk_triggers: string[];
  caller_id_spoofed: boolean;
  call_metadata_anomalies: string[];
  urgency_level: 'critical' | 'high' | 'medium' | 'low';
  status: string;
  transcript_snippet: string;
  evidence_hash: string;
  amount_at_risk_inr: number;
  channel: string;
  agency_assigned: string;
}

export interface KPIData {
  active_threats: number;
  victim_interventions_today: number;
  calls_blocked_today: number;
  mule_accounts_frozen: number;
  total_amount_protected_inr: number;
  vs_yesterday: { active_threats_delta: number; interventions_delta: number };
}

export interface DetectionMetrics {
  precision: number;
  recall: number;
  false_positive_rate: number;
  avg_lead_time_seconds: number;
  sample_size: number;
}

export interface MetricsResponse {
  scam_detection: DetectionMetrics;
  counterfeit_check: DetectionMetrics;
  computed_at: string;
  methodology: string;
}

export interface GraphElement {
  data: Record<string, any>;
}

export interface GraphResponse {
  nodes: GraphElement[];
  edges: GraphElement[];
  stats: { node_count: number; edge_count: number; hub_count: number; total_transactions_inr: number };
}

export interface AgencyAction {
  action_id: string;
  case_id: string;
  agency: string;
  action_type: string;
  operator: string;
  timestamp: string;
  details: string;
  success: boolean;
}

export interface PatrolPriorityItem {
  h3_index: string;
  center_lat: number;
  center_lng: number;
  priority_score: number;
  incident_count: number;
  dominant_crime_type: string;
  recommended_action: string;
}

export interface ChatResponse {
  response_text: string;
  audio_url: string | null;
  verdict: 'SCAM' | 'SUSPICIOUS' | 'LIKELY_SAFE';
  scam_probability: number;
  emergency_contacts: Record<string, any>;
  ncrb_ref: string;
}

export interface CounterfeitResult {
  check_id: string;
  verdict: 'likely_genuine' | 'suspicious' | 'likely_counterfeit';
  confidence: number;
  checks_performed: string[];
  checks_failed: string[];
  denomination: number;
  disclaimer: string;
}

export interface ChatMessage {
  role: 'user' | 'rakshak';
  text: string;
  verdict?: string;
  ncrbRef?: string;
}
