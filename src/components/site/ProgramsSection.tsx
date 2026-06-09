import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import programFallback from "@/assets/program-summit.jpg";

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

export function ProgramsSection({ programs, intro }: { programs: Program[]; intro?: string }) {
  const [idx, setIdx] = useState(0);
  if (!programs.length) return null;
  const p = programs[idx];
  const date = p.event_date ? new Date(p.event_date) : null;
  const day = date ? date.getDate().toString().padStart(2, "0") : "";
  const mo = date
    ? `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${date.getFullYear()}`
    : "";

  const prev = () => setIdx((i) => (i - 1 + programs.length) % programs.length);
  const next = () => setIdx((i) => (i + 1) % programs.length);

  return (
    <section className="bg-light py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-navy-deep">Upcoming Programs</h2>
            {intro && <p className="text-sm text-charcoal/70 mt-1">{intro}</p>}
          </div>
          <a href="/programs" className="text-sm font-semibold text-navy-deep hover:text-gold inline-flex items-center gap-1">
            View All Programs <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="relative">
          {programs.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute -left-2 lg:-left-10 top-1/2 -translate-y-1/2 z-10 p-2 text-charcoal/60 hover:text-navy-deep"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute -right-2 lg:-right-10 top-1/2 -translate-y-1/2 z-10 p-2 text-charcoal/60 hover:text-navy-deep"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-[140px_1fr] bg-white shadow-card">
              <div className="bg-navy-deep text-white flex flex-col items-center justify-center px-4 py-8 text-center">
                <div className="font-display text-4xl">{day}</div>
                <div className="text-[10px] tracking-[0.2em] mt-1 text-white/80">{mo}</div>
              </div>
              <div className="p-6">
                {p.event_type && (
                  <span className="inline-block bg-silver/60 text-charcoal text-[10px] uppercase tracking-[0.18em] px-2 py-1 mb-3">
                    {p.event_type}
                  </span>
                )}
                <h3 className="font-display text-xl text-navy-deep mb-2">{p.title}</h3>
                {p.description && (
                  <p className="text-sm text-charcoal/70 leading-relaxed mb-3 line-clamp-2">{p.description}</p>
                )}
                {p.cta_label && (
                  <a
                    href={p.registration_url ?? "#"}
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold hover:text-navy-deep"
                  >
                    {p.cta_label} <ChevronRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            {p.image_url || programFallback ? (
              <div className="mt-0 aspect-[16/9] overflow-hidden bg-navy-deep">
                <img
                  src={p.image_url || programFallback}
                  alt={p.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
