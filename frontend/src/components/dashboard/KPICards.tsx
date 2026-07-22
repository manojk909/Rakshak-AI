'use client';
import { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { ensureSession, getKPIs } from '@/lib/api';
import { DEMO_KPIS } from '@/lib/demoData';
import type { KPIData } from '@/lib/types';

export default function KPICards() {
  const [kpis, setKpis] = useState<KPIData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await ensureSession();
        setKpis(await getKPIs());
      } catch {
        setKpis(DEMO_KPIS);
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  if (!kpis) return <div className="h-24 bg-white/5 rounded-xl animate-pulse" />;
  const delta = kpis.vs_yesterday.active_threats_delta;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">Active Threats</p>
        <p className="text-4xl font-bold text-red-500 mt-1 tabular-nums">{kpis.active_threats}</p>
        <p className={`flex items-center gap-1 text-xs mt-1 ${delta >= 0 ? 'text-red-400' : 'text-green-400'}`}>
          {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {delta >= 0 ? '+' : ''}{delta} vs yesterday
        </p>
      </div>
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">Victim Interventions</p>
        <p className="text-4xl font-bold text-[#ccff00] mt-1 tabular-nums">{kpis.victim_interventions_today}</p>
        <p className="text-xs text-white/50 mt-1">Today</p>
      </div>
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl p-4 col-span-2 flex justify-between text-center">
        <div>
          <p className="text-xl font-bold tabular-nums">{kpis.calls_blocked_today}</p>
          <p className="text-[10px] text-white/50">Calls Blocked</p>
        </div>
        <div>
          <p className="text-xl font-bold tabular-nums">{kpis.mule_accounts_frozen}</p>
          <p className="text-[10px] text-white/50">Mules Frozen</p>
        </div>
        <div>
          <p className="text-xl font-bold text-[#ccff00] tabular-nums">
            ₹{(kpis.total_amount_protected_inr / 10_000_000).toFixed(1)} Cr
          </p>
          <p className="text-[10px] text-white/50">Amount Protected</p>
        </div>
      </div>
    </div>
  );
}
