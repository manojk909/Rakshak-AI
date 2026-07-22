import axios from 'axios';
import type {
  ChatResponse, CounterfeitResult, FraudCase, GraphResponse, KPIData,
  MetricsResponse, AgencyAction, PatrolPriorityItem,
} from './types';

// Rewrites in next.config.ts proxy /api/* to the backend
const api = axios.create({ baseURL: '/api', timeout: 30000 });

const TOKEN_KEY = 'rakshak_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    return true;
  } catch {
    return false;
  }
}

let _sessionPromise: Promise<boolean> | null = null;
export async function ensureSession(): Promise<boolean> {
  if (_sessionPromise) return _sessionPromise;
  _sessionPromise = (async () => {
    if (getToken()) {
      try {
        await api.get('/auth/me');
        return true;
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    return login('admin', process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'rakshak2026');
  })();
  // Reset after resolution so a future call re-checks if the token expired
  _sessionPromise.finally(() => { setTimeout(() => { _sessionPromise = null; }, 5000); });
  return _sessionPromise;
}

export const getKPIs = () => api.get<KPIData>('/dashboard/kpis').then((r) => r.data);
export const getMetrics = () => api.get<MetricsResponse>('/dashboard/metrics').then((r) => r.data);
export const getLiveThreats = (limit = 20) =>
  api.get<FraudCase[]>(`/scam/threats/live?limit=${limit}`).then((r) => r.data);
export const getAgencyFeed = () => api.get<AgencyAction[]>('/dashboard/agency-feed').then((r) => r.data);
export const getNetwork = () => api.get<GraphResponse>('/graph/network').then((r) => r.data);
export const runGraphAnalysis = () => api.post('/graph/analyze').then((r) => r.data);
export const getHeatmap = () => api.get('/geo/heatmap').then((r) => r.data);
export const getPatrolPriority = (limit = 5) =>
  api.get<PatrolPriorityItem[]>(`/geo/patrol-priority?limit=${limit}`).then((r) => r.data);
export const blockCase = (case_id: string, reason: string) =>
  api.post('/scam/action/block', { case_id, reason }).then((r) => r.data);
export const alertVictim = (case_id: string, channel = 'sms') =>
  api.post('/scam/action/alert-victim', { case_id, channel }).then((r) => r.data);
export const broadcast = (message: string, target_agencies: string[], case_id: string | null = null) =>
  api.post('/dashboard/broadcast', { message, target_agencies, case_id }).then((r) => r.data);
export const analyzeText = (text: string, language = 'en') =>
  api.post('/scam/analyze-text', { text, language }).then((r) => r.data);
export const citizenChat = (message: string, language: string, city: string, session_id: string) =>
  api.post<ChatResponse>('/citizen/chat', { message, language, city, session_id }).then((r) => r.data);
export const getEmergencyContacts = () => api.get('/citizen/emergency-contacts').then((r) => r.data);
export const verifyCaller = (caller_number: string) =>
  api.get('/citizen/verify-caller', { params: { caller_number } }).then((r) => r.data);

export async function analyzeNote(file: File, denomination: number): Promise<CounterfeitResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('denomination', String(denomination));
  const { data } = await api.post<CounterfeitResult>('/counterfeit/analyze-note', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// ── Persona Identity Verification ──────────────────────────────────────────
export const createPersonaInquiry = (referenceId: string, name = 'Officer') =>
  api.post('/persona/create-inquiry', { reference_id: referenceId, name }).then((r) => r.data);
export const getPersonaStatus = (referenceId: string) =>
  api.get(`/persona/status/${referenceId}`).then((r) => r.data);

export default api;
