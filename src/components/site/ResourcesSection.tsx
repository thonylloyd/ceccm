import salvation from "@/assets/resource-salvation.jpg";
import pastorLive from "@/assets/resource-pastor-live.jpg";
import library from "@/assets/resource-library.jpg";
import app from "@/assets/resource-app.jpg";
import { ArrowRight } from "lucide-react";

const FALLBACKS = [salvation, pastorLive, library, app];

type Card = {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
};

export function ResourcesSection({ cards }: { cards: Card[] }) {
  if (!cards.length) return null;
  return (
    <section className="bg-navy-deep py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_80%_20%,var(--gold)_0%,transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs uppercase tracking-[0.32em] text-gold font-semibold">Resources</span>
            <span className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            Grow with <span className="italic text-gold font-light">Spirit-Filled</span> Content
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <a
              key={c.id}
              href={c.cta_url ?? "#"}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold/40 transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={c.image_url || FALLBACKS[i % FALLBACKS.length]}
                  alt={c.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-xl text-white mb-2 leading-snug">{c.title}</h3>
                  {c.description && <p className="text-xs text-white/65 leading-relaxed line-clamp-2 mb-4">{c.description}</p>}
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.24em] text-gold font-semibold">
                    {c.cta_label ?? "Learn More"} <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
