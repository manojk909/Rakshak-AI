'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, ExternalLink, Copy, CheckCheck } from 'lucide-react';

const PLATFORMS = [
  {
    name: 'X (Twitter)',
    icon: '𝕏',
    color: '#000000',
    borderColor: 'border-white/30',
    reportUrl: 'https://help.twitter.com/en/safety-and-security/report-a-tweet',
    handle: '@cybaborjya',
    description: 'Report fake accounts, phishing links, impersonation of government officials, and scam tweets.',
    steps: ['Go to the tweet/profile', 'Click ⋯ (More)', 'Select "Report"', 'Choose reason: Scam/Spam'],
  },
  {
    name: 'Facebook',
    icon: 'f',
    color: '#1877F2',
    borderColor: 'border-blue-500/40',
    reportUrl: 'https://www.facebook.com/help/reportlinks',
    handle: '@CyberDost',
    description: 'Report fraud pages, fake marketplaces, phishing messages, and impersonation profiles.',
    steps: ['Click ⋯ on the post/profile', 'Select "Find Support or Report"', 'Choose "Scam or Fraud"', 'Submit report'],
  },
  {
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    borderColor: 'border-pink-500/40',
    reportUrl: 'https://help.instagram.com/192435014247952',
    handle: '@cyberdaborjya',
    description: 'Report fake investment schemes, impersonation reels, crypto scam stories, and phishing DMs.',
    steps: ['Tap ⋯ on post/profile', 'Select "Report"', 'Choose "Fraud or Scam"', 'Follow prompts'],
  },
  {
    name: 'WhatsApp',
    icon: '💬',
    color: '#25D366',
    borderColor: 'border-green-500/40',
    reportUrl: 'https://faq.whatsapp.com/1142481766359498',
    handle: '+91 9490208090',
    description: 'Report scam groups, fake loan offers, OTP theft attempts, and digital arrest messages.',
    steps: ['Open the chat', 'Tap contact name at top', 'Scroll down → "Report"', 'Forward evidence to 9490208090'],
  },
  {
    name: 'YouTube',
    icon: '▶',
    color: '#FF0000',
    borderColor: 'border-red-500/40',
    reportUrl: 'https://support.google.com/youtube/answer/2802027',
    handle: '@CyberDost',
    description: 'Report fake investment tutorials, deepfake videos, scam livestreams, and phishing links in descriptions.',
    steps: ['Click ⋯ below the video', 'Select "Report"', 'Choose "Spam or misleading"', 'Select "Scams or fraud"'],
  },
  {
    name: 'Telegram',
    icon: '✈',
    color: '#0088CC',
    borderColor: 'border-cyan-500/40',
    reportUrl: 'https://telegram.org/faq#q-how-do-i-report-spam',
    handle: '@CyberDost_I4C',
    description: 'Report fraud channels, fake crypto signals, impersonation bots, and phishing groups.',
    steps: ['Open the chat/channel', 'Tap the name at top', 'Select "Report"', 'Choose "Fraud"'],
  },
  {
    name: 'LinkedIn',
    icon: 'in',
    color: '#0A66C2',
    borderColor: 'border-blue-600/40',
    reportUrl: 'https://www.linkedin.com/help/linkedin/answer/146',
    handle: 'CyberDost',
    description: 'Report fake job offers, recruitment scams, impersonation of HR officials, and advance fee fraud.',
    steps: ['Click ⋯ on the post/profile', 'Select "Report"', 'Choose "Scam or fraud"', 'Add details'],
  },
];

const GOVT_CHANNELS = [
  { label: 'National Cybercrime Portal', url: 'https://cybercrime.gov.in', icon: '🏛️' },
  { label: 'CyberDost (X/Twitter)', url: 'https://twitter.com/Aborjya', icon: '𝕏' },
  { label: 'Helpline 1930', url: 'tel:1930', icon: '📞' },
  { label: 'WhatsApp Bot', url: 'https://wa.me/919490208090', icon: '💬' },
];

export default function ReportFraudPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-[#ccff00] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="w-12 h-12 rounded-2xl bg-[#ccff00] flex items-center justify-center">
            <Shield className="w-7 h-7 text-black" />
          </span>
          <div>
            <h1 className="font-grotesk font-bold text-2xl">Report Social Media Fraud</h1>
            <p className="text-white/50 text-sm">Report scams directly on social media platforms + official government channels</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Government channels banner */}
        <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl p-6 mb-10">
          <h2 className="font-grotesk font-bold text-lg mb-1">🏛️ Official Government Reporting Channels</h2>
          <p className="text-white/50 text-sm mb-4">Always file an official complaint alongside social media reports</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GOVT_CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/40 border border-white/10 hover:border-[#ccff00]/50 rounded-xl p-4 text-center transition-colors group"
              >
                <p className="text-2xl mb-2">{c.icon}</p>
                <p className="text-sm font-semibold group-hover:text-[#ccff00] transition-colors">{c.label}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Platform cards */}
        <h2 className="font-grotesk font-bold text-xl mb-6">Report on Social Media Platforms</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className={`bg-white/[0.03] backdrop-blur border ${p.borderColor} rounded-2xl p-6 hover:bg-white/[0.05] transition-colors`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: p.color }}
                >
                  {p.icon}
                </span>
                <div>
                  <p className="font-bold text-lg">{p.name}</p>
                  <button
                    onClick={() => copyText(p.handle)}
                    className="flex items-center gap-1 text-[#ccff00] text-sm font-mono hover:underline"
                  >
                    {p.handle}
                    {copied === p.handle ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">{p.description}</p>

              {/* How to report steps */}
              <div className="bg-black/30 border border-white/5 rounded-xl p-4 mb-4">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">How to Report</p>
                <div className="space-y-1.5">
                  {p.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 shrink-0 rounded-full bg-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-white/70">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={p.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/15 border border-white/10 hover:border-[#ccff00]/50 rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                Report on {p.name} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Tips section */}
        <div className="mt-12 bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <h3 className="font-grotesk font-bold text-lg mb-4">💡 Tips for Effective Reporting</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-white/60">
            <div className="flex items-start gap-3">
              <span className="text-[#ccff00] text-lg">📸</span>
              <p><strong className="text-white/80">Take screenshots</strong> of the scam content before reporting — the account may be deleted.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#ccff00] text-lg">🔗</span>
              <p><strong className="text-white/80">Save URLs</strong> of the scam profiles/posts/messages as evidence.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#ccff00] text-lg">📋</span>
              <p><strong className="text-white/80">File an official FIR</strong> at cybercrime.gov.in or call 1930 in addition to platform reports.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#ccff00] text-lg">⚠️</span>
              <p><strong className="text-white/80">Never engage</strong> with the scammer — block immediately after taking evidence.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
