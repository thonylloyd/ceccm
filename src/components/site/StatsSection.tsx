type Stat = { id: string; value: string; label: string };

export function StatsSection({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;
  return (
    <section className="bg-navy-deep py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((s) => (
            <div key={s.id} className="text-center">
              <div className="font-display text-gold text-5xl sm:text-6xl font-medium leading-none">
                {s.value}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/75">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
