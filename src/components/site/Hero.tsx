import heroFallback from "@/assets/hero-cathedral.jpg";

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

export function Hero({ banner }: { banner: Banner }) {
  const bg = banner.background_image_url || heroFallback;
  const overlay = banner.overlay_opacity ?? 0.55;

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <img
          src={bg}
          alt=""
          className="h-full w-full object-cover animate-kenburns"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, color-mix(in oklab, var(--navy-deep) ${overlay * 100}%, transparent) 0%, color-mix(in oklab, var(--navy-deep) ${Math.min(overlay + 0.25, 1) * 100}%, transparent) 100%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-navy-deep" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-32 pb-24 w-full">
        <div className="max-w-3xl">
          {banner.eyebrow && (
            <div className="inline-flex items-center gap-3 mb-6 animate-[fade-up_0.7s_ease-out]">
              <span className="h-px w-12 bg-gold" />
              <span className="text-xs uppercase tracking-[0.32em] text-gold font-medium">
                {banner.eyebrow}
              </span>
            </div>
          )}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight animate-[fade-up_0.8s_ease-out_0.1s_both]">
            {banner.heading.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className="text-gold italic font-light">{line}</span> : line}
              </span>
            ))}
          </h1>
          {banner.subheading && (
            <p className="mt-8 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed animate-[fade-up_0.9s_ease-out_0.2s_both]">
              {banner.subheading}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-4 animate-[fade-up_1s_ease-out_0.3s_both]">
            {banner.primary_cta_label && (
              <a
                href={banner.primary_cta_url ?? "#"}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-soft px-9 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-navy-deep shadow-2xl shadow-gold/30 hover:shadow-gold/50 hover:-translate-y-0.5 transition-all"
              >
                {banner.primary_cta_label}
              </a>
            )}
            {banner.secondary_cta_label && (
              <a
                href={banner.secondary_cta_url ?? "#"}
                className="inline-flex items-center justify-center rounded-full border border-white/40 backdrop-blur-md bg-white/5 px-9 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-navy-deep transition-colors"
              >
                {banner.secondary_cta_label}
              </a>
            )}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
        </div>
      </div>
    </section>
  );
}
