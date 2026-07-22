'use client';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const NAV_LINKS = [
  { label: 'INTELLIGENCE', href: '/dashboard' },
  { label: 'NETWORKS', href: '/networks' },
  { label: 'CITIZEN SHIELD', href: '/citizen' },
  { label: 'COUNTERFEIT', href: '/counterfeit' },
  { label: 'REPORT FRAUD', href: '/report-fraud' },
  { label: 'CONTACTS', href: '/contacts' },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-9 h-9 bg-[#ccff00] text-black font-bold rounded-xl flex items-center justify-center font-grotesk text-lg">
            R
          </span>
          <span className="font-grotesk font-bold tracking-tight">RAKSHAK AI</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 bg-white/5 backdrop-blur rounded-full px-6 py-2">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="text-white/70 hover:text-white text-sm font-mono tracking-wide transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-white/70" /> : <Moon className="w-4 h-4 text-white/70" />}
          </button>
          <span className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse-lime" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">Live System</span>
          </span>
          <Link
            href="/dashboard"
            className="bg-white text-black text-sm font-semibold rounded-full px-5 py-2 hover:bg-[#ccff00] transition-colors"
          >
            SECURE ACCESS
          </Link>
        </div>
      </div>
    </nav>
  );
}
