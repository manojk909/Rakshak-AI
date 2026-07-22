import Link from 'next/link';

export default function ReportCategories() {
  const categories = [
    {
      title: 'Digital Arrest Scam',
      emoji: '👮',
      desc: 'Fake CBI/ED/Customs officers demanding money over video calls. Digital arrest does NOT exist in Indian law.',
      btnText: 'Report Now →',
      href: '/citizen'
    },
    {
      title: 'Financial Fraud',
      emoji: '💰',
      desc: 'UPI fraud, credit card scams, investment fraud, loan app harassment, and cryptocurrency scams.',
      btnText: 'Report Now →',
      href: '/citizen'
    },
    {
      title: 'Counterfeit Currency',
      emoji: '💵',
      desc: 'Check any Indian banknote for authenticity using AI-powered image analysis.',
      btnText: 'Check Now →',
      href: '/counterfeit'
    }
  ];

  return (
    <section className="bg-obsidian text-white py-24 px-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-grotesk font-bold text-4xl md:text-5xl mb-12">Report Cyber Crime</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col items-start hover:border-white/20 transition-all hover:-translate-y-1">
              <span className="text-6xl mb-6 block">{cat.emoji}</span>
              <h3 className="font-grotesk font-bold text-2xl mb-4">{cat.title}</h3>
              <p className="text-white/60 mb-8 flex-1 leading-relaxed">
                {cat.desc}
              </p>
              <Link 
                href={cat.href}
                className="bg-transparent border border-[#ccff00] text-[#ccff00] font-mono tracking-wide text-sm px-6 py-3 rounded-full hover:bg-[#ccff00] hover:text-black transition-colors mt-auto"
              >
                {cat.btnText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
