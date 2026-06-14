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
  const overlay = b.overlay_opacity ?? 0.6;

  return (
    <section className="relative bg-light">
      <div className="relative overflow-hidden min-h-[600px] lg:min-h-[720px] flex items-center">
        <img key={b.id} src={bg} alt="" className="absolute inset-0 h-full w-full object-cover animate-kenburns" />
        {/* premium navy overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(115deg, oklch(0.12 0.05 263 / ${Math.min(overlay + 0.3, 0.95)}) 0%, oklch(0.16 0.06 263 / ${overlay * 0.7}) 55%, oklch(0.10 0.05 263 / ${overlay * 0.45}) 100%)`,
          }}
        />
        {/* gold edge gradient */}
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-gold/60 to-transparent" />

        <div className="relative w-full mx-auto max-w-7xl px-6 sm:px-10 lg:px-12 py-20">
          <div key={b.id} className="animate-fade-up max-w-3xl">
            {b.eyebrow && (
              <p className="inline-flex items-center gap-3 text-gold-soft text-[11px] uppercase tracking-[0.32em] font-semibold mb-6">
                <span className="h-px w-8 bg-gold" />
                {b.eyebrow}
              </p>
            )}
            <h1 className="font-display text-white font-bold leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-7xl xl:text-[80px]">
              {b.heading}
            </h1>
            <span className="inline-block mt-7 h-1 w-24 bg-gradient-to-r from-gold to-gold-soft rounded-full shadow-gold" />
            {b.subheading && (
              <p className="mt-7 text-white/90 text-base sm:text-lg max-w-xl leading-relaxed font-light">{b.subheading}</p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              {b.primary_cta_label && (
                <a
                  href={b.primary_cta_url ?? "#"}
                  className="group relative inline-flex items-center gap-2 rounded-sm px-9 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-navy-deep overflow-hidden shadow-gold"
                  style={{ background: "linear-gradient(135deg, oklch(0.78 0.11 78), oklch(0.66 0.13 75))" }}
                >
                  <span className="relative z-10">{b.primary_cta_label}</span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-25 transition-opacity" />
                </a>
              )}
              {b.secondary_cta_label && (
                <a
                  href={b.secondary_cta_url ?? "#"}
                  className="inline-flex items-center rounded-sm border-2 border-white/80 px-9 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white hover:bg-white hover:text-navy-deep transition-all"
                >
                  {b.secondary_cta_label}
                </a>
              )}
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-gold" : "w-2 bg-white/40 hover:bg-white/70"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
