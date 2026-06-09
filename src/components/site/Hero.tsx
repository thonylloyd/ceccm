import heroFallback from "@/assets/hero-cathedral.jpg";
import { useState, useEffect } from "react";

type Banner = {
  id: string;
  eyebrow?: string | null;
  heading: string;
  subheading?: string | null;
  background_image_url?: string | null;
  overlay_opacity?: number | null;
  primary_cta_label?: string | null;
  primary_cta_url?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_url?: string | null;
};

export function Hero({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 7000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return null;
  const b = banners[idx];
  const bg = b.background_image_url || heroFallback;
  const overlay = b.overlay_opacity ?? 0.55;

  return (
    <section className="bg-light pt-6 pb-2">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-md min-h-[480px] lg:min-h-[560px] flex items-center">
          <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(110deg, rgba(4,30,74,${Math.min(overlay + 0.25, 0.95)}) 0%, rgba(4,30,74,${overlay * 0.4}) 75%, rgba(4,30,74,${overlay * 0.2}) 100%)`,
            }}
          />
          <div className="relative w-full px-8 sm:px-14 lg:px-20 py-16">
            {b.eyebrow && (
              <p className="text-white/85 text-sm mb-3">{b.eyebrow}</p>
            )}
            <h1 className="font-display text-white font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl uppercase max-w-2xl">
              {b.heading}
            </h1>
            {b.subheading && (
              <p className="mt-5 text-white/90 text-base sm:text-lg max-w-xl">{b.subheading}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {b.primary_cta_label && (
                <a
                  href={b.primary_cta_url ?? "#"}
                  className="inline-flex items-center rounded-sm bg-gold px-8 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white hover:bg-gold-soft transition-colors"
                >
                  {b.primary_cta_label}
                </a>
              )}
              {b.secondary_cta_label && (
                <a
                  href={b.secondary_cta_url ?? "#"}
                  className="inline-flex items-center rounded-sm border border-white px-8 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-navy-deep transition-colors"
                >
                  {b.secondary_cta_label}
                </a>
              )}
            </div>
          </div>

          {banners.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-1.5 bg-white/50"}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
