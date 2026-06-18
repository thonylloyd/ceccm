import salvation from "@/assets/resource-salvation.jpg";
import pastorLive from "@/assets/resource-pastor-live.jpg";
import library from "@/assets/resource-library.jpg";
import app from "@/assets/resource-app.jpg";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const FALLBACKS = [salvation, pastorLive, library, app];

type Card = {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  cta_label?: string | null;
  cta_url?: string | null;
};

function SalvationCard({
  c,
  fallbackImage,
  index,
}: {
  c: Card;
  fallbackImage: string;
  index: number;
}) {
  const navigate = useNavigate();
  const openSalvation = () =>
    navigate({ search: (prev: any) => ({ ...prev, salvation: "1" }) as any });

  return (
    <button onClick={openSalvation} className="group block text-left w-full">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-light shadow-card group-hover:shadow-elegant transition-all duration-500">
        <img
          src={c.image_url || fallbackImage}
          alt={c.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-white text-base sm:text-lg mb-1 leading-tight">{c.title}</h3>
          {c.description && (
            <p className="text-[11px] text-white/75 leading-snug line-clamp-2">{c.description}</p>
          )}
        </div>
        <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-gold/95 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      {c.cta_label && (
        <div className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-navy-deep group-hover:text-gold transition-colors">
          {c.cta_label}
        </div>
      )}
    </button>
  );
}

export function ResourcesSection({
  cards,
  title = "Spiritual Growth Resources",
  subtitle = "Tools, teachings, and platforms designed to strengthen your faith, deepen your understanding, and increase your effectiveness in the work of the ministry.",
}: {
  cards: Card[];
  title?: string;
  subtitle?: string;
}) {
  if (!cards.length) return null;
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">Grow & Equip</p>
          <h2 className="font-display text-4xl sm:text-5xl text-navy-deep tracking-tight">{title}</h2>
          <span className="inline-block mt-5 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mt-6 max-w-2xl mx-auto text-charcoal/65 leading-relaxed">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => {
            const isSalvation = c.cta_url?.includes("salvation=1");
            if (isSalvation) {
              return (
                <SalvationCard
                  key={c.id}
                  c={c}
                  fallbackImage={FALLBACKS[i % FALLBACKS.length]}
                  index={i}
                />
              );
            }
            return (
              <a
                key={c.id}
                href={c.cta_url ?? "#"}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-light shadow-card group-hover:shadow-elegant transition-all duration-500">
                  <img
                    src={c.image_url || FALLBACKS[i % FALLBACKS.length]}
                    alt={c.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-white text-base sm:text-lg mb-1 leading-tight">{c.title}</h3>
                    {c.description && (
                      <p className="text-[11px] text-white/75 leading-snug line-clamp-2">{c.description}</p>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-gold/95 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
                {c.cta_label && (
                  <div className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-navy-deep group-hover:text-gold transition-colors">
                    {c.cta_label}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
