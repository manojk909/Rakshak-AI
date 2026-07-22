import Link from 'next/link';

const QUICK_LINKS = [
  { label: 'Intelligence Command', href: '/dashboard' },
  { label: 'Fraud Networks', href: '/networks' },
  { label: 'Citizen Shield', href: '/citizen' },
  { label: 'Counterfeit Check', href: '/counterfeit' },
  { label: 'Contact Directory', href: '/contacts' },
  { label: 'Report Fraud', href: '/report-fraud' },
];

const INFO_LINKS = [
  { label: 'Website Policies', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Disclaimer', href: '#' },
  { label: 'Accessibility', href: '#' },
];

/* SVG social icons — filled style matching the government portal screenshot */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);
const CyberDostIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
);

const SOCIALS = [
  { label: 'Facebook', Icon: FacebookIcon, href: 'https://facebook.com/CyberDost' },
  { label: 'X (Twitter)', Icon: XIcon, href: 'https://twitter.com/Aborjya' },
  { label: 'YouTube', Icon: YouTubeIcon, href: 'https://youtube.com/@cyberdost' },
  { label: 'LinkedIn', Icon: LinkedInIcon, href: 'https://linkedin.com' },
  { label: 'Instagram', Icon: InstagramIcon, href: 'https://instagram.com/cyberdaborjya' },
  { label: 'Telegram', Icon: TelegramIcon, href: 'https://t.me/cyberdost' },
  { label: 'WhatsApp', Icon: WhatsAppIcon, href: 'https://wa.me/919490208090' },
  { label: 'CyberDost', Icon: CyberDostIcon, href: 'https://cybercrime.gov.in' },
];

export default function Footer() {
  return (
    <footer className="bg-black relative overflow-hidden">
      {/* Top CTA */}
      <div className="text-center py-16 border-b border-white/10">
        <Link
          href="/dashboard"
          className="inline-block bg-[#ccff00] text-black font-bold rounded-full px-12 py-5 text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(204,255,0,0.35)]"
        >
          ACTIVATE NATIONAL DEFENSE GRID →
        </Link>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 bg-[#ccff00] text-black font-bold rounded-xl flex items-center justify-center font-grotesk text-xl">
                R
              </span>
              <span className="font-grotesk font-bold text-lg">RAKSHAK AI</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              India&apos;s AI-powered Digital Public Safety Intelligence Platform.
              Predictive neutralisation of digital arrest scams, fraud networks and counterfeit currency.
            </p>
            <p className="text-white/30 text-xs font-mono mt-4">
              Ministry of Home Affairs · I4C Initiative
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-grotesk font-bold text-sm uppercase tracking-wider mb-5 text-[#ccff00]">
              Quick Links
            </h4>
            <div className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group">
                  <span className="text-[#ccff00]/60 group-hover:text-[#ccff00]">›</span> {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-grotesk font-bold text-sm uppercase tracking-wider mb-5 text-[#ccff00]">
              Information
            </h4>
            <div className="space-y-3">
              {INFO_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group">
                  <span className="text-[#ccff00]/60 group-hover:text-[#ccff00]">›</span> {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="font-grotesk font-bold text-sm uppercase tracking-wider mb-5 text-[#ccff00]">
              Emergency Contacts
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3">
                <p className="text-[#ccff00] font-bold text-lg font-mono">📞 1930</p>
                <p className="text-white/50 text-xs">National Cybercrime Helpline</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex-1 text-center">
                  <p className="font-mono font-bold">112</p>
                  <p className="text-white/40 text-[10px]">Emergency</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex-1 text-center">
                  <p className="font-mono font-bold">100</p>
                  <p className="text-white/40 text-[10px]">Police</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex-1 text-center">
                  <p className="font-mono font-bold">14448</p>
                  <p className="text-white/40 text-[10px]">RBI Helpline</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex-1 text-center">
                  <p className="font-mono font-bold">181</p>
                  <p className="text-white/40 text-[10px]">Women</p>
                </div>
              </div>
              <p className="text-white/40 text-[11px]">
                ✉️ <a href="mailto:cybercrime@gov.in" className="hover:text-white transition-colors">cybercrime@gov.in</a>
              </p>
              <p className="text-white/40 text-[11px]">
                ✉️ <a href="mailto:ccops@nic.in" className="hover:text-white transition-colors">ccops@nic.in</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines banner */}
      <div className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <p className="text-[11px] text-white/30 leading-relaxed text-center">
            <strong className="text-white/50">Government Guidelines:</strong> As per MHA advisory dated 14-Mar-2024, no government agency conducts
            &quot;digital arrests&quot; over video calls. Never share OTP, Aadhaar, PAN or bank details on phone. If threatened, hang up immediately and dial 1930.
            Report all cyber fraud at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#ccff00]/60 hover:text-[#ccff00] underline">cybercrime.gov.in</a>.
            RAKSHAK AI is a prototype and does not replace official government channels.
          </p>
        </div>
      </div>

      {/* Social links + copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-sm font-mono mr-2">Follow Us</span>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-10 h-10 rounded-lg bg-[#1a3a8a] hover:bg-[#ccff00] hover:text-black flex items-center justify-center text-white transition-all duration-300"
                >
                  <s.Icon />
                </a>
              ))}
            </div>
            <p className="font-mono text-[10px] text-white/30 text-center md:text-right leading-relaxed">
              © 2026 RAKSHAK AI · DIGITAL PUBLIC SAFETY INTELLIGENCE PLATFORM
              <br />
              Developed under Indian Cyber Crime Coordination Centre (I4C) framework
            </p>
          </div>
        </div>
      </div>

      {/* Background watermark */}
      <p
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-grotesk font-bold select-none pointer-events-none"
        style={{ fontSize: '10rem', opacity: 0.03 }}
      >
        RAKSHAK
      </p>
    </footer>
  );
}
