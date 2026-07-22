'use client';
import { Shield } from 'lucide-react';
import type { ChatMessage } from '@/lib/types';

const VERDICT_STYLES: Record<string, string> = {
  SCAM: 'bg-red-500/20 text-red-400 border-red-500/40',
  SUSPICIOUS: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  LIKELY_SAFE: 'bg-green-500/20 text-green-400 border-green-500/40',
};

const VERDICT_LABELS: Record<string, string> = {
  SCAM: 'SCAM ⚠️', SUSPICIOUS: 'SUSPICIOUS 🔍', LIKELY_SAFE: 'LIKELY SAFE ✅',
};

export default function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-slate-700 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
          {message.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <span className="w-8 h-8 shrink-0 rounded-xl bg-[#ccff00] flex items-center justify-center">
        <Shield className="w-4.5 h-4.5 text-black" />
      </span>
      <div className="max-w-[85%]">
        {message.verdict && (
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border mb-2 ${VERDICT_STYLES[message.verdict] || ''}`}>
            {VERDICT_LABELS[message.verdict] || message.verdict}
          </span>
        )}
        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed">
          {message.text}
        </div>
        {message.ncrbRef && (
          <p className="font-mono text-[10px] text-white/40 mt-1.5">Reference: {message.ncrbRef}</p>
        )}
      </div>
    </div>
  );
}
