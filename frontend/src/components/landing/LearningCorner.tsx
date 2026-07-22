import Link from 'next/link';

export default function LearningCorner() {
  const cards = [
    {
      title: 'Citizen Manual',
      emoji: '📖',
      desc: 'Complete guide on how to use the National Cybercrime Reporting Portal for filing and tracking complaints.'
    },
    {
      title: 'Cyber Safety Tips',
      emoji: '🛡️',
      desc: 'Essential practices to protect yourself and your family from online threats, phishing, and social engineering.'
    },
    {
      title: 'Cyber Awareness',
      emoji: '🧠',
      desc: 'Understand the latest cyber threats — from deepfakes to AI voice cloning — and learn to identify them.'
    },
    {
      title: 'Daily Digest',
      emoji: '📰',
      desc: 'Stay updated with the latest fraud modus operandi documented by I4C (Indian Cyber Crime Coordination Centre).'
    }
  ];

  return (
    <section className="bg-[#e5e5e5] text-black py-24 px-8 rounded-b-[4rem] relative z-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-grotesk font-bold text-4xl md:text-5xl mb-12">Learning Corner</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-md border border-black/5 p-8 rounded-3xl flex flex-col hover:bg-white/60 transition-all hover:shadow-lg">
              <span className="text-5xl mb-6 block">{card.emoji}</span>
              <h3 className="font-grotesk font-bold text-xl mb-3">{card.title}</h3>
              <p className="text-black/70 mb-6 flex-1 text-sm leading-relaxed">
                {card.desc}
              </p>
              <Link 
                href="#"
                className="text-sm font-semibold hover:opacity-70 mt-auto"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
