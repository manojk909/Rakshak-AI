'use client';
import { useEffect } from 'react';
import { LANGUAGES } from '@/lib/constants';

export default function LanguageSelector({
  value, onChange,
}: { value: string; onChange: (code: string) => void }) {
  useEffect(() => {
    const saved = localStorage.getItem('rakshak_lang');
    if (saved && saved !== value) onChange(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (code: string) => {
    localStorage.setItem('rakshak_lang', code);
    onChange(code);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => select(l.code)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            value === l.code
              ? 'bg-[#ccff00] text-black font-semibold'
              : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
