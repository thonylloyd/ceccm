import { Icon } from "./Icon";

type Card = { id: string; icon: string; title: string; description: string };

export function MissionSection({ cards }: { cards: Card[] }) {
  return (
    <section className="relative bg-navy-deep py-28 lg:py-36">
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,var(--gold)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,var(--gold)_0%,transparent_50%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs uppercase tracking-[0.32em] text-gold font-medium">Our Mission</span>
            <span className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Building the Church.<br />
            <span className="italic text-gold font-light">Reaching the World.</span>
          </h2>
          <p className="mt-6 text-white/70 text-lg leading-relaxed">
            Three sacred pillars guide every step of our global ministry — strengthening churches,
            shaping leaders, and serving communities with the unchanging gospel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <article
              key={card.id}
              className="group relative rounded-3xl border border-gold/15 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-10 hover:border-gold/40 transition-all hover:-translate-y-1 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gold/5 group-hover:bg-gold/10 blur-3xl transition-colors" />
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-gold to-gold-soft flex items-center justify-center shadow-lg shadow-gold/20 mb-7">
                  <Icon name={card.icon} className="h-8 w-8 text-navy-deep" />
                </div>
                <div className="text-xs uppercase tracking-[0.28em] text-gold/80 font-semibold mb-3">
                  0{i + 1}
                </div>
                <h3 className="font-display text-2xl text-white mb-4 leading-snug">{card.title}</h3>
                <p className="text-white/70 leading-relaxed">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
