import { useRef } from "react";
import { ChevronRight, MapPin, Calendar as CalIcon } from "lucide-react";
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
  location?: string | null;
};

function ProgramCard({ p }: { p: Program }) {
  const date = p.event_date ? new Date(p.event_date) : null;
  const day = date ? date.getDate().toString().padStart(2, "0") : "";
  const mo = date ? `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${date.getFullYear()}` : "";
  const isPast = date && date.getTime() < Date.now();
  const status = isPast ? "Past" : "Upcoming";

  return (
    <article className="group bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-card hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 border border-black/[0.04]">
      <div className="relative aspect-[16/10] bg-navy-deep overflow-hidden">
        <img src={p.image_url || programFallback} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent opacity-60" />
        {p.event_type && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[9px] uppercase tracking-[0.22em] px-2.5 py-1 font-bold rounded-sm shadow-gold">{p.event_type}</span>
        )}
        <span className={`absolute top-3 right-3 text-[9px] uppercase tracking-[0.22em] px-2.5 py-1 font-bold rounded-sm ${isPast ? "bg-charcoal/80 text-white" : "bg-white text-navy-deep"}`}>{status}</span>
      </div>
      <div className="flex-1 p-5">
        <div className="flex items-start gap-4 mb-3">
          <div className="shrink-0 text-center border-r border-gold/40 pr-4">
            <div className="font-display text-3xl leading-none text-navy-deep">{day || "—"}</div>
            <div className="text-[9px] tracking-[0.18em] mt-1 text-gold font-bold">{mo}</div>
          </div>
          <h3 className="font-display text-lg text-navy-deep leading-snug line-clamp-2 min-w-0 flex-1">{p.title}</h3>
        </div>
        {p.location && (
          <div className="flex items-center gap-1.5 text-xs text-charcoal/70 mb-2">
            <MapPin className="h-3.5 w-3.5 text-gold shrink-0" /><span className="truncate">{p.location}</span>
          </div>
        )}
        {p.description && <p className="text-xs text-charcoal/65 leading-relaxed mb-4 line-clamp-2">{p.description}</p>}
        {p.cta_label && (
          <a href={p.registration_url ?? "#"} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-navy-deep group-hover:text-gold transition-colors">
            {p.cta_label} <ChevronRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}

export function ProgramsSection({ programs, intro }: { programs: Program[]; intro?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const skip = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLDivElement>("[data-pcard]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.9;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  if (!programs.length) return null;

  return (
    <section className="bg-light py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-navy-deep flex items-center gap-3">
              <CalIcon className="h-7 w-7 text-gold" /> Upcoming Programs
            </h2>
            {intro && <p className="text-sm text-charcoal/70 mt-1">{intro}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => skip(-1)} aria-label="Previous program" className="h-10 w-10 rounded-full bg-white border border-black/10 shadow-card flex items-center justify-center text-navy-deep hover:bg-navy-deep hover:text-white hover:border-navy-deep transition">
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <button onClick={() => skip(1)} aria-label="Next program" className="h-10 w-10 rounded-full bg-white border border-black/10 shadow-card flex items-center justify-center text-navy-deep hover:bg-navy-deep hover:text-white hover:border-navy-deep transition">
              <ChevronRight className="h-5 w-5" />
            </button>
            <a href="/programs" className="ml-3 text-sm font-semibold text-navy-deep hover:text-gold inline-flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {programs.map((p) => (
            <div
              key={p.id}
              data-pcard
              className="shrink-0 snap-start w-[calc(100%-1rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <ProgramCard p={p} />
            </div>
          ))}
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}
