'use client';
import { useCallback, useEffect, useState } from 'react';
import { Radio, Send, X } from 'lucide-react';
import { broadcast, ensureSession, getAgencyFeed } from '@/lib/api';
import { DEMO_AGENCY_FEED } from '@/lib/demoData';
import { AGENCIES } from '@/lib/constants';
import type { AgencyAction } from '@/lib/types';

export default function AgencyCoordination() {
  const [feed, setFeed] = useState<AgencyAction[]>([]);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      await ensureSession();
      setFeed(await getAgencyFeed());
    } catch {
      setFeed(DEMO_AGENCY_FEED);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  const send = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await broadcast(message.trim(), AGENCIES);
      await load();
      setModal(false);
      setMessage('');
    } catch { /* demo mode */ }
    setSending(false);
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider">Response Coordination</span>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          {AGENCIES.length} AGENCIES ONLINE
        </span>
      </div>
      <div className="max-h-[40vh] overflow-y-auto panel-scroll p-3 space-y-3">
        {feed.map((a) => (
          <div key={a.action_id} className="flex gap-2.5">
            <span className="w-7 h-7 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
              <Radio className="w-3.5 h-3.5 text-[#ccff00]" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-white/80">
                {a.agency.replace(/_/g, ' ')}
                <span className="font-mono text-[9px] text-white/40 ml-2">
                  {new Date(a.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
                </span>
              </p>
              <p className="text-[11px] text-white/50 leading-snug">{a.details}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#ccff00] hover:bg-[#ccff00]/90 text-black text-xs font-bold rounded-lg py-2 transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Issue Broadcast Alert
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-white/20 rounded-xl p-5 w-full max-w-md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold">Broadcast to {AGENCIES.length} agencies</p>
              <button onClick={() => setModal(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Inter-agency alert message…"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white/80 focus:outline-none focus:border-[#ccff00]"
            />
            <p className="font-mono text-[10px] text-white/40 mt-2">{AGENCIES.join(' · ')}</p>
            <button
              onClick={send}
              disabled={sending || !message.trim()}
              className="mt-3 w-full bg-[#ccff00] hover:bg-[#ccff00]/90 disabled:opacity-50 text-black text-sm font-bold rounded-lg py-2 transition-colors"
            >
              {sending ? 'Broadcasting…' : 'Send Broadcast'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
