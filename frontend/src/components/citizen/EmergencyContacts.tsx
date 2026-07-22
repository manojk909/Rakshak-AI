'use client';
import { useState } from 'react';
import { Phone, Globe, Search } from 'lucide-react';
import { verifyCaller } from '@/lib/api';

export default function EmergencyContacts() {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    if (!number.trim()) return;
    setChecking(true);
    try {
      setResult(await verifyCaller(number.trim()));
    } catch {
      setResult({ error: 'Could not verify — check the number format (+91XXXXXXXXXX)' });
    }
    setChecking(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="font-semibold text-sm mb-4">Emergency contacts</p>
      <div className="space-y-3">
        <a href="tel:1930" className="flex items-center gap-3 group">
          <Phone className="w-5 h-5 text-[#ccff00]" />
          <span className="text-white/70 text-sm">Cyber Crime Helpline</span>
          <span className="ml-auto font-mono font-bold text-2xl text-[#ccff00] group-hover:scale-105 transition-transform">1930</span>
        </a>
        <a href="tel:100" className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-white/50" />
          <span className="text-white/70 text-sm">National Police</span>
          <span className="ml-auto font-mono font-bold text-xl">100</span>
        </a>
        <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-white/50" />
          <span className="text-white/70 text-sm">Online portal</span>
          <span className="ml-auto font-mono text-sm text-blue-400">cybercrime.gov.in</span>
        </a>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10">
        <p className="text-sm font-semibold mb-2">Is this caller legitimate?</p>
        <div className="flex gap-2">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="+91 98765 43210"
            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ccff00]"
          />
          <button
            onClick={check}
            disabled={checking}
            className="bg-[#ccff00] text-black rounded-lg px-3 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        {result && (
          <p className={`text-xs mt-2 ${result.error ? 'text-amber-400' : result.is_known_scam_number ? 'text-red-400' : 'text-green-400'}`}>
            {result.error
              ? result.error
              : result.is_known_scam_number
                ? `⚠️ Reported ${result.match_count} time(s) — likely ${result.known_scam_type || 'scam'}. Do not engage.`
                : '✅ No scam reports found for this number. Stay alert anyway.'}
          </p>
        )}
      </div>
    </div>
  );
}
