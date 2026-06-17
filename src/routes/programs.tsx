import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { homepageQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import programFallback from "@/assets/program-summit.jpg";

export const Route = createFileRoute("/programs")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(homepageQuery());
  },
  head: () => ({
    meta: [
      { title: "Programs & Events — Church Consolidation Mission" },
      { name: "description", content: "Browse all upcoming CCM ministry programs, conferences, prayer summits and leadership trainings." },
      { property: "og:title", content: "Programs & Events — CCM" },
      { property: "og:description", content: "All upcoming ministry programs and events from Church Consolidation Mission." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://ceccm.lovable.app/programs" }],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
  component: ProgramsPage,
});

function ProgramsPage() {
  const { data } = useSuspenseQuery(homepageQuery());
  const brand = data.settings.brand ?? {};
  const nav = data.nav.filter((n: any) => !n.parent_id);
  const programs = (data.programs ?? []) as any[];
  const upcoming = programs.filter((p) => !p.event_date || new Date(p.event_date).getTime() >= Date.now() - 86400000);
  const past = programs.filter((p) => p.event_date && new Date(p.event_date).getTime() < Date.now() - 86400000);

  return (
    <div className="bg-light min-h-screen">
      <SiteHeader nav={nav} brandName={brand.name ?? "CCM"} livestream={data.settings.livestream ?? {}} logoUrl={brand.logo_url} />
      <main>
        <section className="relative bg-navy-deep text-white py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 80% 80%, #ffffff 0%, transparent 35%)",
          }} />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold font-semibold mb-3">Programs & Events</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">Walk With Us Through Every Season</h1>
            <p className="text-white/75 max-w-2xl mx-auto mt-6 leading-relaxed">
              Conferences, prayer summits, leadership trainings and gatherings that equip the saints and strengthen the local church.
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold font-semibold mb-2">Upcoming</p>
                <h2 className="font-display text-3xl text-navy-deep">Don't Miss What's Next</h2>
              </div>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-charcoal/60 text-sm">No upcoming programs at the moment. Check back soon.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((p) => <ProgramCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        </section>

        {past.length > 0 && (
          <section className="py-20 bg-white border-t border-black/[0.04]">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-gold font-semibold mb-2">Past Programs</p>
              <h2 className="font-display text-3xl text-navy-deep mb-10">Archive</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((p) => <ProgramCard key={p.id} p={p} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter
        brand={brand}
        contact={data.settings.contact ?? {}}
        footer={data.settings.footer ?? {}}
        social={data.settings.social ?? {}}
        logoUrl={brand.logo_url}
      />
    </div>
  );
}

function ProgramCard({ p }: { p: any }) {
  const date = p.event_date ? new Date(p.event_date) : null;
  const day = date ? date.getDate().toString().padStart(2, "0") : "";
  const mo = date ? `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${date.getFullYear()}` : "";
  const isPast = date && date.getTime() < Date.now();
  return (
    <article className="group bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 border border-black/[0.04]">
      <div className="relative aspect-[16/10] bg-navy-deep overflow-hidden">
        <img src={p.image_url || programFallback} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 to-transparent opacity-60" />
        {p.event_type && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[9px] uppercase tracking-[0.22em] px-2.5 py-1 font-bold rounded-sm shadow-gold">{p.event_type}</span>
        )}
        <span className={`absolute top-3 right-3 text-[9px] uppercase tracking-[0.22em] px-2.5 py-1 font-bold rounded-sm ${isPast ? "bg-charcoal/80 text-white" : "bg-white text-navy-deep"}`}>
          {isPast ? "Past" : "Upcoming"}
        </span>
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
        {date && (
          <div className="flex items-center gap-1.5 text-xs text-charcoal/70 mb-3">
            <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
            <span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        )}
        {p.description && <p className="text-xs text-charcoal/65 leading-relaxed mb-4 line-clamp-3">{p.description}</p>}
        {p.cta_label && (
          <a href={p.registration_url ?? "#"} className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-navy-deep group-hover:text-gold transition-colors">
            {p.cta_label} <ChevronRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}
