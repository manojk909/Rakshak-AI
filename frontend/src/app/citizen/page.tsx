'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import ChatInterface from '@/components/citizen/ChatInterface';
import EmergencyContacts from '@/components/citizen/EmergencyContacts';
import ReportForm from '@/components/citizen/ReportForm';

const SCAM_CARDS = [
  { emoji: '👮', title: 'Digital Arrest', desc: '“CBI/ED officer” keeps you on video call and demands money. Digital arrest does NOT exist in Indian law.' },
  { emoji: '📦', title: 'Parcel Scam', desc: '“Customs seized your parcel with drugs” — pay a fine to avoid arrest. Always fake.' },
  { emoji: '📱', title: 'SIM / KYC Threat', desc: '“Your number/KYC will be blocked today” — asks for OTP. Never share OTPs with anyone.' },
];

export default function CitizenPage() {
  const [showReport, setShowReport] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-[#ccff00] transition-colors mr-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="w-12 h-12 rounded-2xl bg-[#ccff00] flex items-center justify-center">
            <Shield className="w-7 h-7 text-black" />
          </span>
          <div>
            <h1 className="font-grotesk font-bold text-2xl">RAKSHAK AI — Citizen Fraud Shield</h1>
            <p className="text-white/50 text-sm">Your AI-powered protection against digital fraud</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-6 p-6">
        {/* Left — 40% info panel */}
        <div className="lg:col-span-2 space-y-5">
          <EmergencyContacts />

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <p className="font-semibold text-sm">Common scam types</p>
            {SCAM_CARDS.map((c) => (
              <div key={c.title} className="flex gap-3">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{c.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowReport((s) => !s)}
            className="w-full border border-white/20 hover:border-[#ccff00] rounded-2xl py-3 text-sm font-semibold transition-colors"
          >
            {showReport ? 'Hide report form' : 'File a detailed fraud report →'}
          </button>
          {showReport && <ReportForm />}
        </div>

        {/* Right — 60% chat */}
        <div className="lg:col-span-3">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
