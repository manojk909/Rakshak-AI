const STATS = [
  { value: '₹1,776 Cr', label: 'Lost to digital arrest scams in 9 months of 2024' },
  { value: '1.14M', label: 'Cybercrime complaints in 2023 (+60% YoY)' },
  { value: '< 2 min', label: 'RAKSHAK average threat detection time' },
  { value: '12 languages', label: 'Citizen Shield multilingual coverage' },
];

export default function StatsSection() {
  return (
    <section className="bg-black w-full border-y border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
        {STATS.map((s) => (
          <div key={s.value} className="px-8 py-12">
            <p className="font-mono text-[#ccff00] text-3xl md:text-4xl font-bold">{s.value}</p>
            <p className="text-white/50 text-sm mt-3 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
