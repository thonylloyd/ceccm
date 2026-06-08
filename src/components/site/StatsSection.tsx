type Stat = { id: string; value: string; label: string };

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="relative bg-gradient-to-r from-navy via-navy-deep to-navy py-20 border-y border-gold/15">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.id} className="text-center group">
              <div className="font-display text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-b from-gold to-gold-soft bg-clip-text text-transparent font-bold leading-none group-hover:scale-105 transition-transform">
                {s.value}
              </div>
              <div className="mt-4 text-xs sm:text-sm uppercase tracking-[0.24em] text-white/70 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
