import { Quote } from "lucide-react";

type Report = { id: string; quote: string; author?: string | null; role?: string | null };

export function PraiseReports({ reports, title = "Praise Reports", intro }: { reports: Report[]; title?: string; intro?: string }) {
  if (!reports.length) return null;
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-2xl sm:text-3xl text-navy-deep uppercase tracking-[0.18em] font-semibold">
            {title}
          </h2>
          <span className="inline-block mt-3 h-0.5 w-12 bg-gold" />
          {intro && <p className="mt-5 max-w-2xl mx-auto text-charcoal/70">{intro}</p>}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reports.map((r) => (
            <article
              key={r.id}
              className="relative bg-light border border-gold/30 p-8 hover:shadow-card transition-shadow"
            >
              <Quote className="absolute -top-3 left-6 h-9 w-9 text-gold bg-white p-1.5" />
              <p className="text-sm text-charcoal/80 leading-relaxed italic pt-3 mb-5">
                "{r.quote}"
              </p>
              <div className="pt-4 border-t border-black/5">
                {r.author && <div className="font-semibold text-navy-deep text-sm">{r.author}</div>}
                {r.role && <div className="text-xs text-charcoal/55 mt-0.5">{r.role}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
