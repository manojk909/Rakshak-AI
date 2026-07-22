'use client';
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Building2, Landmark, Users, PhoneOff } from 'lucide-react';
import { ensureSession, getPatrolPriority } from '@/lib/api';
import { DEMO_PATROL } from '@/lib/demoData';
import type { PatrolPriorityItem } from '@/lib/types';

const TYPE_ICON: Record<string, any> = {
  fraud_compound: Building2, mule_withdrawal: Landmark, victim_cluster: Users, digital_arrest: PhoneOff,
};

export default function PatrolPriority({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [items, setItems] = useState<PatrolPriorityItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await ensureSession();
      setItems(await getPatrolPriority(5));
    } catch {
      setItems(DEMO_PATROL);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const maxScore = Math.max(...items.map((i) => i.priority_score), 1);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70">
          Suggested Patrol Priority
        </p>
        <button onClick={load} className="text-white/50 hover:text-[#ccff00] transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const Icon = TYPE_ICON[item.dominant_crime_type] || Users;
          return (
            <button
              key={item.h3_index}
              onClick={() => onSelect(item.center_lat, item.center_lng)}
              className="w-full text-left bg-white/[0.03] border border-white/10 hover:border-[#ccff00]/50 rounded-lg p-2.5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#ccff00]/20 text-[#ccff00] text-[10px] font-mono font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <Icon className="w-3.5 h-3.5 text-white/50" />
                <span className="text-[11px] font-mono text-white/70">
                  {item.center_lat.toFixed(2)}, {item.center_lng.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full mt-2">
                <div
                  className="h-1.5 bg-[#ccff00] rounded-full"
                  style={{ width: `${(item.priority_score / maxScore) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-white/40 mt-1.5 leading-snug">
                {item.incident_count} incidents · {item.recommended_action}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
