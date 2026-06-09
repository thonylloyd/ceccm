import { Icon } from "./Icon";

type Card = { id: string; icon: string; title: string; description: string };

export function MissionSection({ cards, title = "Our Mission" }: { cards: Card[]; title?: string }) {
  if (!cards.length) return null;
  return (
    <section className="bg-light py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-2xl sm:text-3xl text-navy-deep uppercase tracking-[0.18em] font-semibold">
            {title}
          </h2>
          <span className="inline-block mt-3 h-0.5 w-12 bg-gold" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <article
              key={c.id}
              className="bg-white border border-gold/60 px-8 py-10 text-center hover:shadow-card transition-shadow"
            >
              <div className="mx-auto h-11 w-11 rounded-full bg-gold/15 flex items-center justify-center mb-5">
                <Icon name={c.icon} className="h-5 w-5 text-gold" />
              </div>
              <h3 className="font-display text-xl text-navy-deep mb-3">{c.title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{c.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
