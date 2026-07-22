'use client';
import { useState } from 'react';
import { alertVictim, blockCase } from '@/lib/api';
import { SCAM_TYPE_LABELS, URGENCY_STYLES } from '@/lib/constants';
import type { FraudCase } from '@/lib/types';

export default function ThreatCard({ threat, onAction }: { threat: FraudCase; onAction?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const style = URGENCY_STYLES[threat.urgency_level] || URGENCY_STYLES.low;

  const act = async (kind: 'block' | 'alert') => {
    setBusy(kind);
    try {
      if (kind === 'block') await blockCase(threat.case_id, 'Operator action from command center');
      else await alertVictim(threat.case_id);
      onAction?.();
    } catch { /* demo mode — no-op */ }
    setBusy(null);
  };

  return (
    <div
      className={`bg-white/[0.03] border ${style.border} rounded-lg p-3 cursor-pointer`}
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${style.badge}`}>
          {threat.urgency_level.toUpperCase()}
        </span>
        <span className="text-[10px] font-mono text-white/40">
          {new Date(threat.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <p className="font-semibold text-sm mt-1.5">{SCAM_TYPE_LABELS[threat.scam_type] || threat.scam_type}</p>
      <p className="text-xs text-white/50">
        {threat.victim_name} · {threat.victim_location_city} · {threat.caller_number_masked}
        {threat.caller_id_spoofed && <span className="text-red-400"> · SPOOFED</span>}
      </p>
      <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1.5">
        <span>SCRIPT MATCH {threat.script_match_percent}%</span>
        <span className={style.text}>CONF {(threat.scam_probability * 100).toFixed(0)}%</span>
      </div>
      {expanded && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-[11px] text-white/50 font-mono bg-black/40 rounded p-2">
            &ldquo;{threat.transcript_snippet}&rdquo;
          </p>
          <p className="text-[10px] text-white/40 mt-1.5 font-mono break-all">
            EVIDENCE SHA-256: {threat.evidence_hash.slice(0, 24)}…
          </p>
        </div>
      )}
      {threat.urgency_level === 'critical' && (
        <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => act('block')}
            disabled={busy !== null}
            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold rounded py-1.5 transition-colors"
          >
            {busy === 'block' ? 'Blocking…' : 'Block Telecom'}
          </button>
          <button
            onClick={() => act('alert')}
            disabled={busy !== null}
            className="flex-1 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white text-xs font-semibold rounded py-1.5 transition-colors"
          >
            {busy === 'alert' ? 'Alerting…' : 'Alert Victim'}
          </button>
        </div>
      )}
    </div>
  );
}
