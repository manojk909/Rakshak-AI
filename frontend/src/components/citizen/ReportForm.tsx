'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function ReportForm() {
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Delhi');
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (description.trim().length < 5) return;
    setBusy(true);
    try {
      const { data } = await api.post('/citizen/report', {
        description: description.trim(), phone_hash: '', language: 'en', city,
      });
      setResult(data);
      setDescription('');
    } catch {
      setResult({ error: 'Could not submit right now — please call 1930 or use cybercrime.gov.in' });
    }
    setBusy(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
      <p className="font-semibold text-sm">Fraud report (forwarded to NCRB reference queue)</p>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="What happened? Include the caller's claims and any payment demands. Do NOT type your Aadhaar/OTP/account numbers — they will be auto-redacted anyway."
        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#ccff00]"
      />
      <div className="flex gap-2">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
        >
          {['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'].map((c) => (
            <option key={c} value={c} className="bg-slate-900">{c}</option>
          ))}
        </select>
        <button
          onClick={submit}
          disabled={busy || description.trim().length < 5}
          className="flex-1 bg-[#ccff00] text-black font-semibold rounded-xl py-2 text-sm disabled:opacity-40"
        >
          {busy ? 'Submitting…' : 'Submit report'}
        </button>
      </div>
      {result && (
        <p className={`text-xs ${result.error ? 'text-amber-400' : 'text-green-400'}`}>
          {result.error || `✅ Report received. Your reference: ${result.ncrb_ref}`}
        </p>
      )}
    </div>
  );
}
