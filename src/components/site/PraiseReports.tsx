import { Quote, Star } from "lucide-react";

type Report = { id: string; quote: string; author?: string | null; role?: string | null };

export function PraiseReports({ reports, title = "Praise Reports", intro }: { reports: Report[]; title?: string; intro?: string }) {
  if (!reports.length) return null;
  return (
    <section className="relative bg-[oklch(0.97_0.008_263)] py-24 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 50% 0%, var(--navy) 0%, transparent 50%)",
      }} />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">Testimonies</p>
          <h2 className="font-display text-4xl sm:text-5xl text-navy-deep tracking-tight">{title}</h2>
          <span className="inline-block mt-5 h-[2px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          {intro && <p className="mt-6 max-w-2xl mx-auto text-charcoal/65 leading-relaxed">{intro}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {reports.map((r) => (
            <article
              key={r.id}
              className="group relative bg-white rounded-2xl p-9 shadow-card hover:shadow-elegant hover:-translate-y-1.5 transition-all duration-500 border border-black/[0.04] overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold via-gold-soft to-gold" />
              <div className="absolute -top-2 right-6 opacity-90">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gold to-gold-soft flex items-center justify-center shadow-gold">
                  <Quote className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex gap-0.5 mb-5 text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold" />)}
              </div>
              <p className="text-charcoal/85 leading-relaxed italic mb-8 text-[15px]">"{r.quote}"</p>
              <div className="pt-5 border-t border-gold/15 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-navy-deep text-white font-display flex items-center justify-center text-sm">
                  {(r.author || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  {r.author && <div className="font-semibold text-navy-deep text-sm">{r.author}</div>}
                  {r.role && <div className="text-xs text-charcoal/55 mt-0.5">{r.role}</div>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
