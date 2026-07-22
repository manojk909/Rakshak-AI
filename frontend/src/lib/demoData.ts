// Hardcoded demo data — dashboard falls back to this when the API is unreachable
// (isDemoMode). Matches the design so the demo never renders empty.
import type { FraudCase, KPIData, MetricsResponse, AgencyAction, GraphResponse, PatrolPriorityItem } from './types';

export const DEMO_KPIS: KPIData = {
  active_threats: 23,
  victim_interventions_today: 147,
  calls_blocked_today: 62,
  mule_accounts_frozen: 38,
  total_amount_protected_inr: 128_500_000,
  vs_yesterday: { active_threats_delta: 4, interventions_delta: 12 },
};

export const DEMO_METRICS: MetricsResponse = {
  scam_detection: { precision: 0.936, recall: 0.951, false_positive_rate: 0.041, avg_lead_time_seconds: 84.2, sample_size: 530 },
  counterfeit_check: { precision: 0.842, recall: 0.865, false_positive_rate: 0.062, avg_lead_time_seconds: 0, sample_size: 120 },
  computed_at: new Date().toISOString(),
  methodology: 'Computed against labeled synthetic evaluation data',
};

export const DEMO_THREATS: FraudCase[] = [
  {
    case_id: 'demo-001', timestamp: new Date().toISOString(), victim_name: 'R. Sharma',
    victim_location_city: 'Delhi', victim_location_lat: 28.61, victim_location_lng: 77.21,
    caller_number_masked: '+91 98*** **456', scam_type: 'digital_arrest', authority_impersonated: 'CBI',
    scam_probability: 0.97, voice_spoof_confidence: 0.91, script_match_percent: 94,
    risk_triggers: ['digital arrest', 'CBI headquarters', 'do not disconnect'],
    caller_id_spoofed: true, call_metadata_anomalies: ['voip_relay_detected', 'recent_sim_swap'],
    urgency_level: 'critical', status: 'active',
    transcript_snippet: 'This is CBI headquarters New Delhi. Your Aadhaar number has been used…',
    evidence_hash: 'a3f1…demo', amount_at_risk_inr: 850000, channel: 'video_call', agency_assigned: 'I4C',
  },
  {
    case_id: 'demo-002', timestamp: new Date(Date.now() - 240000).toISOString(), victim_name: 'S. Iyer',
    victim_location_city: 'Mumbai', victim_location_lat: 19.07, victim_location_lng: 72.87,
    caller_number_masked: '+91 87*** **112', scam_type: 'customs_duty', authority_impersonated: 'Customs',
    scam_probability: 0.89, voice_spoof_confidence: 0.78, script_match_percent: 86,
    risk_triggers: ['parcel seized', 'pay fine immediately'],
    caller_id_spoofed: true, call_metadata_anomalies: ['burner_device_signature'],
    urgency_level: 'high', status: 'active',
    transcript_snippet: 'A parcel registered under your mobile number has been seized at Delhi airport…',
    evidence_hash: 'b7c2…demo', amount_at_risk_inr: 85000, channel: 'voice_call', agency_assigned: 'local_cyber_cell',
  },
  {
    case_id: 'demo-003', timestamp: new Date(Date.now() - 540000).toISOString(), victim_name: 'K. Reddy',
    victim_location_city: 'Hyderabad', victim_location_lat: 17.38, victim_location_lng: 78.48,
    caller_number_masked: '+91 96*** **890', scam_type: 'trai_disconnection', authority_impersonated: 'TRAI',
    scam_probability: 0.82, voice_spoof_confidence: 0.66, script_match_percent: 79,
    risk_triggers: ['disconnected in 2 hours', 'press 9'],
    caller_id_spoofed: false, call_metadata_anomalies: ['shared_imei_cluster'],
    urgency_level: 'medium', status: 'active',
    transcript_snippet: 'Your mobile number will be disconnected in 2 hours because illegal…',
    evidence_hash: 'c9d3…demo', amount_at_risk_inr: 45000, channel: 'voice_call', agency_assigned: 'state_cid',
  },
];

export const DEMO_AGENCY_FEED: AgencyAction[] = [
  { action_id: 'a1', case_id: 'demo-001', agency: 'Telecom_Nodal_Jio', action_type: 'telecom_block', operator: 'op_sharma', timestamp: new Date().toISOString(), details: 'Suspect MSISDN blocked at switch level; IMEI greylisted nationally.', success: true },
  { action_id: 'a2', case_id: 'demo-001', agency: 'I4C', action_type: 'victim_alert_sms', operator: 'system', timestamp: new Date(Date.now() - 120000).toISOString(), details: 'Preemptive victim warning SMS delivered; call disconnected by victim.', success: true },
  { action_id: 'a3', case_id: 'demo-002', agency: 'FIU_IND', action_type: 'account_freeze', operator: 'op_reddy', timestamp: new Date(Date.now() - 300000).toISOString(), details: 'Mule account frozen under PMLA §17; FIU-IND STR filed.', success: true },
];

export const DEMO_GRAPH: GraphResponse = {
  nodes: [
    { data: { id: 'compound-1', node_type: 'fraud_compound', label: 'Compound A0', pagerank_score: 0.12, is_cross_jurisdiction: true, linked_states: ['Delhi', 'Maharashtra', 'Karnataka'], city: 'Delhi' } },
    { data: { id: 'suspect-1', node_type: 'suspect_phone', label: 'Suspect +91 98*** **456', pagerank_score: 0.06, city: 'Delhi' } },
    { data: { id: 'suspect-2', node_type: 'suspect_phone', label: 'Suspect +91 87*** **112', pagerank_score: 0.04, city: 'Mumbai' } },
    { data: { id: 'victim-1', node_type: 'victim', label: 'R. Sharma', pagerank_score: 0.01, city: 'Delhi' } },
    { data: { id: 'victim-2', node_type: 'victim', label: 'S. Iyer', pagerank_score: 0.01, city: 'Mumbai' } },
    { data: { id: 'mule-1', node_type: 'mule_account', label: 'HDFC ***1234', pagerank_score: 0.03, city: 'Bengaluru' } },
    { data: { id: 'ip-1', node_type: 'ip_address', label: 'IP 103.***.***.24', pagerank_score: 0.02, city: 'Delhi' } },
  ],
  edges: [
    { data: { id: 'e1', source: 'suspect-1', target: 'compound-1', relationship_type: 'CONTROLLED_BY', amount_inr: 0 } },
    { data: { id: 'e2', source: 'suspect-2', target: 'compound-1', relationship_type: 'CONTROLLED_BY', amount_inr: 0 } },
    { data: { id: 'e3', source: 'suspect-1', target: 'victim-1', relationship_type: 'CALLED', amount_inr: 0 } },
    { data: { id: 'e4', source: 'suspect-2', target: 'victim-2', relationship_type: 'CALLED', amount_inr: 0 } },
    { data: { id: 'e5', source: 'victim-1', target: 'mule-1', relationship_type: 'TRANSFERRED_TO', amount_inr: 850000 } },
    { data: { id: 'e6', source: 'suspect-1', target: 'ip-1', relationship_type: 'LOGGED_FROM', amount_inr: 0 } },
  ],
  stats: { node_count: 7, edge_count: 6, hub_count: 1, total_transactions_inr: 850000 },
};

export const DEMO_PATROL: PatrolPriorityItem[] = [
  { h3_index: '873da1102ffffff', center_lat: 28.63, center_lng: 77.22, priority_score: 14.2, incident_count: 18, dominant_crime_type: 'fraud_compound', recommended_action: 'Deploy cyber-cell raid team with FIU coordination' },
  { h3_index: '873da1103ffffff', center_lat: 19.08, center_lng: 72.88, priority_score: 11.7, incident_count: 14, dominant_crime_type: 'mule_withdrawal', recommended_action: 'Station plainclothes unit near ATM cluster during peak hours' },
  { h3_index: '873da1104ffffff', center_lat: 12.97, center_lng: 77.59, priority_score: 9.3, incident_count: 11, dominant_crime_type: 'victim_cluster', recommended_action: 'Run awareness drive + door-to-door advisory in locality' },
];

export const DEMO_HEATMAP = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.209, 28.6139] }, properties: { crime_type: 'fraud_compound', severity: 'critical', city: 'Delhi' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [72.8777, 19.076] }, properties: { crime_type: 'mule_withdrawal', severity: 'high', city: 'Mumbai' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [77.5946, 12.9716] }, properties: { crime_type: 'victim_cluster', severity: 'medium', city: 'Bengaluru' } },
  ],
};
