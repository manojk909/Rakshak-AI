'use client';
import { Mic, Map, Radio, Fingerprint } from 'lucide-react';

const SMALL_CARDS = [
  { icon: Mic, title: 'Voice Spoofing Detection', desc: 'Librosa-based pitch, timing and noise-floor heuristics flag AI-generated caller voices.' },
  { icon: Map, title: 'Geospatial Intelligence', desc: 'H3 hex clustering of fraud hotspots drives near real-time patrol prioritisation.' },
  { icon: Radio, title: 'Multi-Agency Coordination', desc: 'One broadcast reaches I4C, telecom nodal officers and FIU-IND simultaneously.' },
  { icon: Fingerprint, title: 'Evidence Hashing', desc: 'SHA-256 chain of custody seals every transcript at ingestion for court admissibility.' },
];

const SCAM_BARS = [
  { label: 'Digital Arrest', pct: 90 },
  { label: 'Customs Duty', pct: 62 },
  { label: 'TRAI Threat', pct: 41 },
  { label: 'Aadhaar Misuse', pct: 30 },
  { label: 'KYC / OTP', pct: 22 },
];

export default function FeaturesBento() {
  return (
    <section id="features" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
      {/* Large 2×2 — fraud network radar */}
      <div className="lg:col-span-2 lg:row-span-2 rounded-[2.5rem] border border-white/10 p-8 bg-obsidian-card relative overflow-hidden">
        <p className="font-mono text-xs text-[#ccff00] uppercase tracking-widest">Fraud Network Graph Intelligence</p>
        <h3 className="font-grotesk font-bold text-3xl mt-3 max-w-sm">
          Map the ring. Freeze the mules. Link the states.
        </h3>
        <svg viewBox="0 0 400 260" className="w-full mt-6">
          <circle cx="200" cy="130" r="120" fill="none" stroke="#ccff0022" />
          <circle cx="200" cy="130" r="80" fill="none" stroke="#ccff0033" />
          <circle cx="200" cy="130" r="40" fill="none" stroke="#ccff0044" />
          {[
            [200, 130, 300, 60], [200, 130, 90, 80], [200, 130, 320, 190],
            [200, 130, 110, 210], [200, 130, 250, 30],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#47556955" strokeWidth="1" />
          ))}
          <circle cx="200" cy="130" r="10" fill="#ef4444" className="pulse-ring" />
          <circle cx="300" cy="60" r="6" fill="#f59e0b" />
          <circle cx="90" cy="80" r="6" fill="#f59e0b" />
          <circle cx="320" cy="190" r="5" fill="#3b82f6" />
          <circle cx="110" cy="210" r="5" fill="#94a3b8" />
          <circle cx="250" cy="30" r="5" fill="#8b5cf6" />
        </svg>
        <p className="font-mono text-[10px] text-white/40 mt-2">
          PAGERANK HUB DETECTION · CROSS-JURISDICTION RING FLAGS · COURT-ADMISSIBLE PACKAGES
        </p>
      </div>

      {/* Tall 1×2 — scam distribution */}
      <div className="lg:row-span-2 rounded-[2.5rem] border border-white/10 p-8 bg-obsidian-card">
        <p className="font-mono text-xs text-white/50 uppercase tracking-widest">Scam Type Distribution</p>
        <div className="mt-8 space-y-5">
          {SCAM_BARS.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between font-mono text-xs text-white/60 mb-1">
                <span>{b.label}</span>
                <span>{b.pct}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full">
                <div className="h-2 bg-[#ccff00] rounded-full" style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accent card — solid lime */}
      <div className="rounded-[2.5rem] p-8 bg-[#ccff00] text-black relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(#00000022 1px, transparent 1px)', backgroundSize: '6px 6px' }}
        />
        <p className="font-grotesk font-bold text-4xl relative">500+</p>
        <p className="font-mono text-xs uppercase tracking-widest mt-2 relative">Scam Patterns Identified</p>
        <p className="text-black/70 text-sm mt-4 relative">
          Continuously matched against live call transcripts by Gemini 1.5 Flash.
        </p>
      </div>

      {SMALL_CARDS.map((c) => (
        <div key={c.title} className="rounded-[2.5rem] border border-white/10 p-8 bg-obsidian-card">
          <c.icon className="w-8 h-8 text-[#ccff00]" />
          <h4 className="font-grotesk font-bold text-lg mt-4">{c.title}</h4>
          <p className="text-white/50 text-sm mt-2 leading-relaxed">{c.desc}</p>
        </div>
      ))}
    </section>
  );
}
