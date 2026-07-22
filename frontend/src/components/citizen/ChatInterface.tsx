'use client';
import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { citizenChat } from '@/lib/api';
import { QUICK_PROMPTS } from '@/lib/constants';
import type { ChatMessage } from '@/lib/types';
import LanguageSelector from './LanguageSelector';
import MessageBubble from './MessageBubble';

const WELCOME: ChatMessage = {
  role: 'rakshak',
  text: "नमस्ते! I'm RAKSHAK, your fraud protection assistant. Describe any suspicious call or message you received and I'll tell you if it's a scam.",
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [busy, setBusy] = useState(false);
  const [sessionId] = useState(() => `web-${Math.random().toString(36).slice(2, 10)}`);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setBusy(true);
    try {
      const res = await citizenChat(msg, language, 'Delhi', sessionId);
      setMessages((m) => [...m, { role: 'rakshak', text: res.response_text, verdict: res.verdict, ncrbRef: res.ncrb_ref }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'rakshak',
          verdict: 'SUSPICIOUS',
          text: "I couldn't reach the analysis service just now. General advice: government agencies NEVER demand payment on a call, and 'digital arrest' does not exist in Indian law. If in doubt, hang up and call 1930.",
        },
      ]);
    }
    setBusy(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-[78vh]">
      <div className="p-4 border-b border-white/10">
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll p-4 space-y-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {busy && <p className="text-white/40 text-xs font-mono animate-pulse">RAKSHAK is analyzing…</p>}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-xs bg-white/5 border border-white/10 hover:border-[#ccff00] rounded-full px-3 py-1.5 text-white/70 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-white/10 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          maxLength={500}
          placeholder="Describe the suspicious call or message…"
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#ccff00]"
        />
        <button
          onClick={() => send()}
          disabled={busy || !input.trim()}
          className="bg-[#ccff00] text-black rounded-xl px-4 disabled:opacity-40"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
