import { useEffect, useRef, useState } from "react";
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
  const mo = date
    ? `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${date.getFullYear()}`
    : "";

  return (
    <article className="bg-white shadow-card overflow-hidden flex flex-col h-full">
      <div className="aspect-[16/10] bg-navy-deep overflow-hidden">
        <img
          src={p.image_url || programFallback}
          alt={p.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="grid grid-cols-[110px_1fr] flex-1">
        <div className="bg-navy-deep text-white flex flex-col items-center justify-center px-3 py-6 text-center">
          <div className="font-display text-3xl leading-none">{day || "—"}</div>
          <div className="text-[9px] tracking-[0.18em] mt-1 text-white/80">{mo}</div>
        </div>
        <div className="p-5 flex flex-col">
          {p.event_type && (
            <span className="inline-block self-start bg-silver/60 text-charcoal text-[10px] uppercase tracking-[0.18em] px-2 py-1 mb-2">
              {p.event_type}
            </span>
          )}
          <h3 className="font-display text-lg text-navy-deep mb-2 line-clamp-2">{p.title}</h3>
          {p.location && (
            <div className="flex items-center gap-1 text-xs text-charcoal/70 mb-2">
              <MapPin className="h-3 w-3 text-gold shrink-0" />
              <span className="truncate">{p.location}</span>
            </div>
          )}
          {p.description && (
            <p className="text-xs text-charcoal/70 leading-relaxed mb-3 line-clamp-2">{p.description}</p>
          )}
          {p.cta_label && (
            <a
              href={p.registration_url ?? "#"}
              className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold hover:text-navy-deep"
            >
              {p.cta_label} <ChevronRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProgramsSection({ programs, intro }: { programs: Program[]; intro?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const dragState = useRef<{ startX: number; startScroll: number; pid: number } | null>(null);

  const loop = programs.length > 2 ? [...programs, ...programs] : programs;

  useEffect(() => {
    if (!programs.length) return;
    const el = scrollerRef.current;
    if (!el) return;
    let raf: number;
    const tick = () => {
      if (!paused && el && !dragState.current) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, programs.length]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startScroll: el.scrollLeft, pid: e.pointerId };
    setPaused(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !dragState.current) return;
    el.scrollLeft = dragState.current.startScroll - (e.clientX - dragState.current.startX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el && dragState.current && el.hasPointerCapture(dragState.current.pid)) {
      el.releasePointerCapture(dragState.current.pid);
    }
    dragState.current = null;
    setPaused(false);
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
          <a href="/programs" className="text-sm font-semibold text-navy-deep hover:text-gold inline-flex items-center gap-1">
            View All Programs <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div
          ref={scrollerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar cursor-grab active:cursor-grabbing select-none touch-pan-y"
          style={{ scrollbarWidth: "none" }}
        >
          {loop.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="shrink-0 w-[calc(100%-1rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
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

