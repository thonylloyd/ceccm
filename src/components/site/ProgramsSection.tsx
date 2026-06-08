import programFallback from "@/assets/program-summit.jpg";
import { Calendar, ArrowRight } from "lucide-react";

type Program = {
  id: string;
  title: string;
  description?: string | null;
  event_date?: string | null;
  event_type?: string | null;
  image_url?: string | null;
  cta_label?: string | null;
  registration_url?: string | null;
};

export function ProgramsSection({ programs }: { programs: Program[] }) {
  if (!programs.length) return null;
  return (
    <section className="bg-light py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs uppercase tracking-[0.32em] text-gold font-semibold">Upcoming</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-navy-deep leading-tight">
              Programs &amp; <span className="italic text-gold font-light">Gatherings</span>
            </h2>
          </div>
          <a href="/programs" className="text-sm uppercase tracking-[0.18em] text-navy hover:text-gold font-semibold inline-flex items-center gap-2">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {programs.map((p) => (
            <article key={p.id} className="group relative overflow-hidden rounded-3xl bg-navy-deep text-white shadow-xl shadow-navy/10 hover:shadow-2xl transition-all">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image_url || programFallback}
                  alt={p.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
                {p.event_type && (
                  <div className="absolute top-5 left-5 inline-flex items-center rounded-full bg-gold/95 text-navy-deep px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] font-bold">
                    {p.event_type}
                  </div>
                )}
              </div>
              <div className="p-8">
                {p.event_date && (
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold/90 mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(p.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                )}
                <h3 className="font-display text-2xl sm:text-3xl mb-3 leading-snug">{p.title}</h3>
                {p.description && <p className="text-white/70 leading-relaxed mb-6">{p.description}</p>}
                {p.cta_label && (
                  <a
                    href={p.registration_url ?? "#"}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-soft text-navy-deep px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] hover:shadow-lg hover:shadow-gold/40 transition-shadow"
                  >
                    {p.cta_label} <ArrowRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
