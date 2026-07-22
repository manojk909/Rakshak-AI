'use client';
import type { FraudCase } from '@/lib/types';

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono text-white/50 mb-1">
        <span>{label}</span>
        <span className="text-white/80">{(value * 100).toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

export default function AIThreatAnalysis({ threats }: { threats: FraudCase[] }) {
  // Most recent critical threat (falls back to top of stream)
  const threat = threats.find((t) => t.urgency_level === 'critical') || threats[0];

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-3">AI Threat Analysis</p>
      {!threat ? (
        <p className="text-xs text-white/40">Awaiting threat stream…</p>
      ) : (
        <div className="space-y-4">
          <Bar label="VOICE SPOOFING CONFIDENCE" value={threat.voice_spoof_confidence} color="bg-amber-500" />
          <Bar label="SCRIPT MATCH" value={threat.script_match_percent / 100} color="bg-red-500" />
          <div>
            <p className="text-[10px] font-mono text-white/50 mb-1">TRANSCRIPT SNIPPET (PII-REDACTED)</p>
            <p className="text-[11px] font-mono bg-black/40 border border-white/10 rounded p-2.5 text-white/70 leading-relaxed">
              &ldquo;{threat.transcript_snippet}&rdquo;
            </p>
          </div>
          {threat.call_metadata_anomalies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {threat.call_metadata_anomalies.map((a) => (
                <span key={a} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
