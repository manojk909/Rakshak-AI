'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, ShieldCheck, User, Banknote, Network, Fingerprint } from 'lucide-react';
import PersonaVerificationModal from '@/components/persona/PersonaVerificationModal';

export default function DashboardHeader({ isDemoMode }: { isDemoMode?: boolean }) {
  const [time, setTime] = useState('');
  const [showOperator, setShowOperator] = useState(false);
  const [showPersona, setShowPersona] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Check verification status from localStorage on mount
  useEffect(() => {
    setIsVerified(localStorage.getItem('rakshak_officer_verified') === 'true');
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata', hour12: false,
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        }) + ' IST',
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 h-14 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-[#ccff00] transition-colors mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Shield className="w-7 h-7 text-[#ccff00]" />
          <div>
            <p className="font-bold uppercase tracking-wide text-sm">Intelligence Command</p>
            <p className="text-[11px] text-white/50">MHA Cyber Intelligence Unit · Node Alpha</p>
          </div>
          {isDemoMode && (
            <span className="ml-3 font-mono text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              DEMO MODE
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-white/70">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
            Operational
          </span>
          <span className="font-mono text-sm text-white/80 tabular-nums">{time}</span>
          {/* Verification Badge / Button */}
          {isVerified ? (
            <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 border border-green-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED OFFICER
            </span>
          ) : (
            <button
              onClick={() => setShowPersona(true)}
              className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-1.5 transition-colors"
            >
              <Fingerprint className="w-4 h-4" /> Verify Identity
            </button>
          )}
          <Link
            href="/networks"
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white border border-white/20 hover:border-[#ccff00] rounded-lg px-3 py-1.5 transition-colors"
          >
            <Network className="w-4 h-4" /> Networks
          </Link>
          <Link
            href="/counterfeit"
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white border border-white/20 hover:border-[#ccff00] rounded-lg px-3 py-1.5 transition-colors"
          >
            <Banknote className="w-4 h-4" /> Counterfeit
          </Link>
          <button
            onClick={() => setShowOperator(true)}
            className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 transition-colors"
          >
            <User className="w-4 h-4" /> Operator
          </button>
        </div>
      </header>

      {/* Operator Profile Modal */}
      {showOperator && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6" onClick={() => setShowOperator(false)}>
          <div className="bg-[#0a0a0a] border border-white/20 rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#ccff00]/20 border border-[#ccff00]/40 flex items-center justify-center">
                <User className="w-8 h-8 text-[#ccff00]" />
              </div>
              <div>
                <p className="font-bold text-lg">Operator Alpha-01</p>
                <p className="text-white/50 text-sm">MHA Cyber Intelligence Unit</p>
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                  ACTIVE · LEVEL 5 CLEARANCE
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">Session Details</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/40 text-xs">Role</p>
                    <p className="font-mono">Senior Analyst</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Node</p>
                    <p className="font-mono">Alpha (Delhi NCR)</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Shift</p>
                    <p className="font-mono">Night Watch (20:00-08:00)</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Cases Assigned</p>
                    <p className="font-mono text-[#ccff00]">12 Active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {['View Threats', 'Block Telecom', 'Alert Victims', 'Broadcast', 'Graph Analysis', 'Patrol Routing'].map((p) => (
                    <span key={p} className="text-[10px] font-mono px-2 py-1 rounded bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">Today&apos;s Activity</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-[#ccff00]">7</p>
                    <p className="text-[10px] text-white/40">Threats Reviewed</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-red-400">3</p>
                    <p className="text-[10px] text-white/40">Telecoms Blocked</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-400">5</p>
                    <p className="text-[10px] text-white/40">Victims Alerted</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowOperator(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold rounded-lg py-2.5 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-red-600/80 hover:bg-red-600 text-sm font-bold rounded-lg py-2.5 transition-colors">
                End Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persona Identity Verification Modal */}
      {showPersona && (
        <PersonaVerificationModal
          referenceId="operator-alpha-01"
          onSuccess={() => {
            setShowPersona(false);
            setIsVerified(true);
          }}
          onCancel={() => setShowPersona(false)}
        />
      )}
    </>
  );
}
