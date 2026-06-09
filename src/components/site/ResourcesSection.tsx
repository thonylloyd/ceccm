import salvation from "@/assets/resource-salvation.jpg";
import pastorLive from "@/assets/resource-pastor-live.jpg";
import library from "@/assets/resource-library.jpg";
import app from "@/assets/resource-app.jpg";

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
    <section className="bg-silver/40 py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div key={c.id} className="text-center">
              <div className="aspect-square overflow-hidden bg-white/60 mb-4">
                <img
                  src={c.image_url || FALLBACKS[i % FALLBACKS.length]}
                  alt={c.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-sm text-navy-deep mb-1">{c.title}</h3>
              {c.description && (
                <p className="text-[11px] text-charcoal/70 leading-snug mb-1 line-clamp-2 px-2">
                  {c.description}
                </p>
              )}
              {c.cta_label && (
                <a href={c.cta_url ?? "#"} className="text-[11px] font-semibold text-navy-deep underline hover:text-gold">
                  {c.cta_label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
