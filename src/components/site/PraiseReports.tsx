import { useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

type Report = { id: string; quote: string; author?: string | null; role?: string | null };

export function PraiseReports({ reports, title = "Praise Reports", intro }: { reports: Report[]; title?: string; intro?: string }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reports.length <= 1 || paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % reports.length), 10000);
    return () => clearInterval(t);
  }, [reports.length, paused]);

  if (!reports.length) return null;
  const r = reports[idx];

  const go = (delta: number) => setIdx((i) => (i + delta + reports.length) % reports.length);

  return (
    <section className="relative bg-[oklch(0.97_0.008_263)] py-24 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 50% 0%, var(--navy) 0%, transparent 50%)",
      }} />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">Testimonies</p>
          <h2 className="font-display text-4xl sm:text-5xl text-navy-deep tracking-tight">{title}</h2>
          <span className="inline-block mt-5 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          {intro && <p className="mt-6 max-w-2xl mx-auto text-charcoal/65 leading-relaxed">{intro}</p>}
        </div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <article
            key={r.id}
            className="relative bg-white rounded-2xl p-8 sm:p-12 lg:p-14 shadow-elegant hover:shadow-2xl transition-shadow duration-500 border border-black/[0.04] overflow-hidden min-h-[280px] sm:min-h-[260px] flex flex-col justify-between text-center"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold via-gold-soft to-gold" />

            <div className="flex flex-col items-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-gold to-gold-soft flex items-center justify-center shadow-gold mb-5">
                <Quote className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="flex gap-0.5 mb-5 text-gold justify-center">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-gold" />)}
              </div>
              <p className="text-charcoal/85 leading-relaxed italic text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto">
                "{r.quote}"
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gold/15 flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-navy-deep text-white font-display flex items-center justify-center text-base">
                {(r.author || "?").charAt(0).toUpperCase()}
              </div>
              {r.author && <div className="font-semibold text-navy-deep">{r.author}</div>}
              {r.role && <div className="text-xs text-charcoal/55">{r.role}</div>}
              <div className="text-xs text-charcoal/45 tabular-nums mt-1">{idx + 1} / {reports.length}</div>
            </div>
          </article>

          {reports.length > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label="Previous testimony"
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white border border-black/10 shadow-card flex items-center justify-center text-navy-deep hover:bg-navy-deep hover:text-white hover:border-navy-deep transition">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => go(1)} aria-label="Next testimony"
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white border border-black/10 shadow-card flex items-center justify-center text-navy-deep hover:bg-navy-deep hover:text-white hover:border-navy-deep transition">
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {reports.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Show testimony ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-1.5 bg-charcoal/20 hover:bg-charcoal/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
