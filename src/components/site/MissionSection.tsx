import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Icon } from "./Icon";

type Card = { id: string; icon: string; title: string; description: string };

export function MissionSection({
  cards,
  title = "Our Mission",
  statement,
  subtitle = "Discover what drives us — the convictions and callings that shape every program, gathering and resource we build.",
}: {
  cards: Card[];
  title?: string;
  statement?: string;
  subtitle?: string;
}) {
  if (!cards.length && !statement) return null;
  return (
    <section className="relative bg-gradient-to-b from-light via-white to-light py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">What We Stand For</p>
          <h2 className="font-display text-4xl sm:text-5xl text-navy-deep tracking-tight">
            {title}
          </h2>
          <span className="inline-block mt-5 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          {subtitle && (
            <p className="mt-6 max-w-2xl mx-auto text-sm text-charcoal/65 leading-relaxed">{subtitle}</p>
          )}
          {statement && (
            <blockquote className="mt-8 max-w-3xl mx-auto relative">
              <span className="absolute -top-2 left-0 text-6xl text-gold/30 font-display leading-none">“</span>
              <p className="text-charcoal/80 italic leading-relaxed text-base sm:text-lg px-6">{statement}</p>
              <span className="absolute -bottom-8 right-0 text-6xl text-gold/30 font-display leading-none">”</span>
            </blockquote>
          )}
        </div>

        {cards.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {cards.map((c, i) => (
              <article
                key={c.id}
                className="group relative bg-white rounded-xl border border-black/5 px-7 py-10 text-center hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative mx-auto h-14 w-14 mb-6">
                  <div className="absolute inset-0 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors" />
                  <div className="absolute inset-0 rounded-full border border-gold/30 group-hover:border-gold/60 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name={c.icon} className="h-6 w-6 text-gold" />
                  </div>
                </div>
                <h3 className="font-display text-lg text-navy-deep mb-3">{c.title}</h3>
                <p className="text-sm text-charcoal/65 leading-relaxed">{c.description}</p>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-14">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy-deep text-white text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-gold transition-colors rounded-sm"
          >
            Learn More About Us <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
