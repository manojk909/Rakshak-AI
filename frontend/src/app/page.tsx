import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import StatsSection from '@/components/landing/StatsSection';
import FeaturesBento from '@/components/landing/FeaturesBento';
import ReportCategories from '@/components/landing/ReportCategories';
import LearningCorner from '@/components/landing/LearningCorner';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="bg-obsidian min-h-screen text-white">
      <Navbar />
      <Hero />
      <StatsSection />
      <FeaturesBento />
      {/* CTA — contrast section */}
      <section className="bg-[#e5e5e5] text-black px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-grotesk font-bold text-4xl md:text-6xl tracking-tight max-w-3xl">
            From complaint filing to threat neutralisation in under 2 minutes
          </h2>
          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {[
              { n: '01', t: 'Detect', d: 'Gemini-powered classifier flags digital arrest scripts, spoofed caller IDs and AI voices in real time — before money moves.' },
              { n: '02', t: 'Map', d: 'NetworkX graph intelligence links victims, mule accounts and fraud compounds into cross-jurisdiction rings with court-ready evidence hashes.' },
              { n: '03', t: 'Neutralise', d: 'One-click telecom blocks, victim alerts and multi-agency broadcasts from a single command center — patrols routed to live hotspots.' },
            ].map((s) => (
              <div key={s.n}>
                <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center font-mono font-bold text-lg">
                  {s.n}
                </div>
                <h3 className="font-grotesk font-bold text-2xl mt-6">{s.t}</h3>
                <p className="text-black/70 mt-3 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReportCategories />

      <section className="bg-[#ccff00] text-black py-8 px-4 text-center z-20 relative shadow-[0_0_40px_rgba(204,255,0,0.2)]">
        <h3 className="font-grotesk font-bold text-2xl md:text-3xl mb-4">
          📞 National Cybercrime Helpline: 1930
        </h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-mono text-sm">
          <span>🚨 Emergency: 112</span>
          <span>🏦 RBI: 14448</span>
          <span>👩 Women Helpline: 181</span>
        </div>
      </section>

      <LearningCorner />

      <Footer />
    </main>
  );
}
