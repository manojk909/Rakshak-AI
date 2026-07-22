'use client';
import { useEffect, useRef } from 'react';
import ThreatCard from './ThreatCard';
import type { FraudCase } from '@/lib/types';

export default function LiveThreatStream({ threats, onAction }: { threats: FraudCase[]; onAction?: () => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const prevTop = useRef<string | null>(null);

  // Auto-scroll to top when a new threat arrives
  useEffect(() => {
    const topId = threats[0]?.case_id ?? null;
    if (topId && prevTop.current && topId !== prevTop.current) {
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevTop.current = topId;
  }, [threats]);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live Scam Detections
        </span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
          AI Confidence &gt; 85%
        </span>
      </div>
      <div ref={listRef} className="max-h-[52vh] overflow-y-auto panel-scroll p-3 space-y-3">
        {threats.length === 0 && <p className="text-xs text-white/40 text-center py-6">No active threats</p>}
        {threats.map((t) => (
          <ThreatCard key={t.case_id} threat={t} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}
