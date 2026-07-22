'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Banknote, ArrowLeft, Phone } from 'lucide-react';
import NoteScanner from '@/components/counterfeit/NoteScanner';
import CounterfeitResultView from '@/components/counterfeit/CounterfeitResult';
import { DENOMINATIONS } from '@/lib/constants';
import type { CounterfeitResult } from '@/lib/types';

export default function CounterfeitPage() {
  const [denomination, setDenomination] = useState(500);
  const [result, setResult] = useState<CounterfeitResult | null>(null);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-10 px-4">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-[#ccff00] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Command Center
          </Link>
          <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1 outline-none focus:border-[#ccff00]">
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Banknote className="w-6 h-6 text-emerald-400" />
          </span>
          <div>
            <h1 className="font-grotesk font-bold text-2xl">Counterfeit Currency Check</h1>
            <span className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/40">
              Heuristic Check · Prototype
            </span>
          </div>
        </div>

        {/* Denomination selector */}
        <div className="flex flex-wrap gap-2 mt-8">
          {DENOMINATIONS.map((d) => (
            <button
              key={d}
              onClick={() => { setDenomination(d); setResult(null); }}
              className={`rounded-full px-4 py-2 text-sm font-mono transition-colors ${
                denomination === d
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              ₹{d}
            </button>
          ))}
        </div>

        {/* Instructions */}
        {!result && (
          <div className="mt-8 mb-6">
            <h2 className="text-sm font-bold text-white mb-3">How to Check Your Note</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔍</span>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-1">Security Thread</h3>
                    <p className="text-xs text-white/60">Hold the note against light. Look for the embedded security thread with inscriptions 'RBI' and denomination value.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-1">Watermark</h3>
                    <p className="text-xs text-white/60">Tilt the note and look for the Mahatma Gandhi watermark and electrotype denomination numeral.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔢</span>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-1">Micro-printing</h3>
                    <p className="text-xs text-white/60">Use a magnifying glass. Check for 'RBI' and denomination value in micro-letters between the vertical band and the Mahatma Gandhi portrait.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🌈</span>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-1">Color-shifting Ink</h3>
                    <p className="text-xs text-white/60">Tilt the ₹200, ₹500 or ₹2000 note. The denomination numeral changes color from green to blue.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          {result ? (
            <CounterfeitResultView result={result} onReset={() => setResult(null)} />
          ) : (
            <NoteScanner denomination={denomination} onResult={setResult} />
          )}
        </div>

        <div className="mt-6 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl p-4 flex items-center justify-center gap-3">
          <Phone className="text-[#ccff00] w-5 h-5" />
          <p className="text-sm font-medium text-[#ccff00]">Report suspected counterfeit notes at RBI Helpline: 14448</p>
        </div>

        <p className="text-[11px] text-slate-500 mt-8 leading-relaxed">
          This is a prototype heuristic check based on public RBI note specifications. It does not
          replace RBI-certified verification equipment. Uploaded images are analyzed in memory and
          never stored — only a SHA-256 hash is kept for the audit trail.
        </p>
      </div>
    </main>
  );
}
