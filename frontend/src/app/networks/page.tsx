'use client';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import FraudNetworkGraph from '@/components/dashboard/FraudNetworkGraph';

const FRAUD_RINGS = [
  { id: 1, name: 'OPERATION PHANTOM', risk: 'critical', states: ['Delhi', 'UP', 'Bihar'], exposure: 12_50_00_000, agency: 'CBI', nodes: 145, type: 'Digital Arrest Ring' },
  { id: 2, name: 'RING OMEGA', risk: 'high', states: ['Maharashtra', 'Gujarat', 'Rajasthan'], exposure: 8_30_00_000, agency: 'ED', nodes: 98, type: 'Mule Network' },
  { id: 3, name: 'SYNDICATE DELTA', risk: 'high', states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'AP'], exposure: 15_70_00_000, agency: 'State Cyber Cell', nodes: 212, type: 'Cross-Border Fraud Compound' },
  { id: 4, name: 'CLUSTER SIGMA', risk: 'medium', states: ['West Bengal', 'Jharkhand'], exposure: 3_40_00_000, agency: 'NIA', nodes: 67, type: 'SIM Swap Ring' },
];

export default function NetworksPage() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 h-14 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-[#ccff00] transition-colors mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Shield className="w-7 h-7 text-[#ccff00]" />
          <div>
            <p className="font-bold uppercase tracking-wide text-sm">Fraud Network Intelligence</p>
            <p className="text-[11px] text-white/50">PageRank · Hub Detection · Cross-Jurisdiction Ring Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs text-white/70 hover:text-white border border-white/20 hover:border-[#ccff00] rounded-lg px-3 py-1.5 transition-colors font-mono">
            ← Intelligence
          </Link>
          <Link href="/citizen" className="text-xs text-white/70 hover:text-white border border-white/20 hover:border-[#ccff00] rounded-lg px-3 py-1.5 transition-colors font-mono">
            Citizen Shield
          </Link>
          <Link href="/counterfeit" className="text-xs text-white/70 hover:text-white border border-white/20 hover:border-[#ccff00] rounded-lg px-3 py-1.5 transition-colors font-mono">
            Counterfeit Check
          </Link>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="flex bg-white/[0.03] backdrop-blur border-b border-white/10 shrink-0">
        <div className="flex-1 p-4 border-r border-white/10">
          <p className="text-[11px] text-white/50 uppercase font-mono">Fraud Rings Detected</p>
          <p className="text-2xl font-bold text-white mt-1">12</p>
        </div>
        <div className="flex-1 p-4 border-r border-white/10">
          <p className="text-[11px] text-white/50 uppercase font-mono">Total Nodes</p>
          <p className="text-2xl font-bold text-white mt-1">800</p>
        </div>
        <div className="flex-1 p-4 border-r border-white/10">
          <p className="text-[11px] text-white/50 uppercase font-mono">Financial Exposure</p>
          <p className="text-2xl font-bold text-white mt-1">₹ 47.3 Cr</p>
        </div>
        <div className="flex-1 p-4">
          <p className="text-[11px] text-white/50 uppercase font-mono">States Affected</p>
          <p className="text-2xl font-bold text-white mt-1">14</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[280px] border-r border-white/10 bg-black/20 flex flex-col overflow-y-auto panel-scroll p-4 space-y-4 shrink-0">
          {FRAUD_RINGS.map((ring) => (
            <button
              key={ring.id}
              onClick={() => console.log('Highlight ring', ring.name)}
              className="text-left bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-[#ccff00]/50 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-sm text-white/90 truncate mr-2">{ring.name}</p>
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                  ring.risk === 'critical' ? 'bg-red-500/20 text-red-400' :
                  ring.risk === 'high' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {ring.risk}
                </span>
              </div>
              <div className="space-y-1.5 text-[11px] text-white/60">
                <p><span className="text-white/40">Type:</span> {ring.type}</p>
                <p><span className="text-white/40">States:</span> {ring.states.join(', ')}</p>
                <p><span className="text-white/40">Exposure:</span> ₹{(ring.exposure / 10000000).toFixed(2)} Cr</p>
                <p><span className="text-white/40">Nodes:</span> {ring.nodes}</p>
                <p><span className="text-white/40">Agency:</span> <span className="text-[#ccff00]">{ring.agency}</span></p>
              </div>
            </button>
          ))}
        </div>

        {/* Center: FraudNetworkGraph */}
        <div className="flex-1 relative min-w-0">
          <FraudNetworkGraph />
        </div>
      </div>
    </div>
  );
}
