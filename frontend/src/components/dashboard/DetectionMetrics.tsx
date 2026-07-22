'use client';
import { useEffect, useState } from 'react';
import { ensureSession, getMetrics } from '@/lib/api';
import { DEMO_METRICS } from '@/lib/demoData';
import type { MetricsResponse } from '@/lib/types';

const fmtLead = (s: number) => (s >= 60 ? `${(s / 60).toFixed(1)}m` : `${s.toFixed(0)}s`);

export default function DetectionMetrics() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await ensureSession();
        setMetrics(await getMetrics());
      } catch {
        setMetrics(DEMO_METRICS);
      }
    })();
  }, []);

  if (!metrics) return <div className="h-16 bg-white/5 rounded-xl animate-pulse" />;
  const m = metrics.scam_detection;
  const fpLow = m.false_positive_rate < 0.05;

  return (
    <div
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-3"
      title="Computed against labeled synthetic evaluation data"
    >
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-[#ccff00] tabular-nums">{(m.precision * 100).toFixed(1)}%</p>
          <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Precision</p>
        </div>
        <div>
          <p className="text-lg font-bold text-[#ccff00] tabular-nums">{(m.recall * 100).toFixed(1)}%</p>
          <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Recall</p>
        </div>
        <div>
          <p className="text-lg font-bold text-white/80 tabular-nums">{fmtLead(m.avg_lead_time_seconds)}</p>
          <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Avg. Lead Time</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
        <span className="text-[9px] font-mono uppercase tracking-wider text-white/50">False Positive Rate</span>
        <span className={`text-xs font-bold tabular-nums ${fpLow ? 'text-green-400' : 'text-amber-400'}`}>
          {(m.false_positive_rate * 100).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
