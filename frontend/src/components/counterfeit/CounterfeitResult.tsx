'use client';
import { CheckCircle2, XCircle } from 'lucide-react';
import { CHECK_LABELS } from '@/lib/constants';
import type { CounterfeitResult } from '@/lib/types';

const VERDICTS: Record<string, { label: string; cls: string }> = {
  likely_genuine: { label: '✅ Likely Genuine', cls: 'bg-green-500/15 text-green-400 border-green-500/40' },
  suspicious: { label: '🔍 Suspicious — Recommend Manual Verification', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/40' },
  likely_counterfeit: { label: '⚠️ Likely Counterfeit', cls: 'bg-red-500/15 text-red-400 border-red-500/40' },
};

export default function CounterfeitResultView({
  result, onReset,
}: { result: CounterfeitResult; onReset: () => void }) {
  const v = VERDICTS[result.verdict] || VERDICTS.suspicious;

  return (
    <div className="space-y-4">
      <div className={`border rounded-2xl p-5 text-center font-bold text-lg ${v.cls}`}>{v.label}</div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
          <span>HEURISTIC CONFIDENCE</span>
          <span className="text-slate-200">{(result.confidence * 100).toFixed(0)}%</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full">
          <div
            className={`h-2.5 rounded-full ${result.confidence > 0.7 ? 'bg-green-500' : result.confidence > 0.4 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${result.confidence * 100}%` }}
          />
        </div>

        <div className="mt-5 space-y-2.5">
          {result.checks_performed.map((check) => {
            const failed = result.checks_failed.includes(check);
            return (
              <div key={check} className="flex items-center gap-2.5 text-sm">
                {failed
                  ? <XCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
                  : <CheckCircle2 className="w-4.5 h-4.5 text-green-400 shrink-0" />}
                <span className={failed ? 'text-red-300' : 'text-slate-300'}>
                  {CHECK_LABELS[check] || check}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">{result.disclaimer}</p>

      <button
        onClick={onReset}
        className="w-full border border-slate-700 hover:border-slate-500 rounded-xl py-3 text-sm font-semibold transition-colors"
      >
        Check Another Note
      </button>
    </div>
  );
}
