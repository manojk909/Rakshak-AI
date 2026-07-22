'use client';
import Link from 'next/link';

const BARS = [
  { h: 'h-16', c: 'bg-[#ccff00]' },
  { h: 'h-24', c: 'bg-[#ccff00]' },
  { h: 'h-12', c: 'bg-red-500' },
  { h: 'h-28', c: 'bg-[#ccff00]' },
  { h: 'h-20', c: 'bg-[#ccff00]/60' },
];

export default function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-16 px-6 max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
      {/* Left — 7 cols */}
      <div className="col-span-12 lg:col-span-7">
        <p className="font-mono text-[#ccff00] text-xs uppercase tracking-widest">
          [AGENTIC AI · SECURITY INFRASTRUCTURE]
        </p>
        <h1 className="font-grotesk font-bold text-[3.5rem] md:text-[5.5rem] xl:text-[7rem] leading-[0.85] tracking-[-0.04em] mt-6">
          DEFEAT THE
          <br />
          <span className="italic bg-gradient-to-r from-[#ccff00] to-white bg-clip-text text-transparent">
            INVISIBLE
          </span>
          <br />
          THREAT.
        </h1>
        <p className="text-white/60 text-lg max-w-lg mt-8">
          India&apos;s first AI-powered Digital Public Safety Intelligence platform. We shift the needle
          from reactive complaint filing to predictive threat neutralisation of digital arrest scams.
        </p>
        <div className="flex flex-wrap gap-4 mt-10">
          <Link
            href="/dashboard"
            className="bg-[#ccff00] text-black font-bold rounded-full px-8 py-4 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.3)]"
          >
            DEPLOY DEFENSE →
          </Link>
          <Link
            href="/citizen"
            className="border border-white/20 text-white rounded-full px-8 py-4 hover:border-white/50 transition-colors"
          >
            VIEW LIVE DEMO
          </Link>
        </div>
      </div>

      {/* Right — 5 cols: glassmorphism mockup */}
      <div className="col-span-12 lg:col-span-5 relative">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-6">
          <p className="font-mono text-xs text-white/50 uppercase tracking-widest">Anomaly Detection</p>
          <div className="flex items-end gap-3 h-32 mt-6">
            {BARS.map((b, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-lg origin-bottom ${b.h} ${b.c}`}
                style={{ animation: `bar-grow ${2 + i * 0.4}s ease-in-out infinite` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 font-mono text-[10px] text-white/40">
            <span>00:00</span><span>SESSION TIMELINE</span><span>02:00</span>
          </div>
        </div>

        <div className="absolute -top-6 -right-2 bg-[#ccff00] text-black rounded-xl p-3 text-xs font-mono font-bold animate-float">
          REAL-TIME PROTECTION ACTIVE
        </div>
        <div className="absolute -bottom-8 -left-4 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-xl p-3 text-xs font-mono animate-float-delayed">
          <span className="text-red-400">CF OPERATIONS DETECTED</span>
          <br />
          <span className="text-white/60">Fraud Compound: Region 7A</span>
        </div>
        <div className="absolute top-1/2 -right-6 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-xl p-3 text-xs font-mono animate-float">
          <span className="text-white/80">VOICE FINGERPRINT · 99.4% MATCH</span>
          <br />
          <span className="text-red-400">Ident-Red: &apos;Officer Khanna&apos; Alias</span>
        </div>
      </div>
    </section>
  );
}
