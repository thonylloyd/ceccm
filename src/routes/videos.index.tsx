import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Play, Clock, User, ExternalLink, Lock } from "lucide-react";
import { videoLibraryQuery } from "@/lib/videos.functions";
import { siteChromeQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import espeesCoin from "@/assets/espees-coin.png.asset.json";

export const Route = createFileRoute("/videos/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(videoLibraryQuery()),
      context.queryClient.ensureQueryData(siteChromeQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Video Library — Church Consolidation Mission" },
      { name: "description", content: "Watch transformational teachings, leadership training, ministry broadcasts and faith-building content from CCM." },
      { property: "og:title", content: "Video Library — CCM" },
      { property: "og:description", content: "Stream ministry videos, sermons, training and broadcasts." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://ceccm.lovable.app/videos" }],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
  component: VideosPage,
});

function VideosPage() {
  const { data } = useSuspenseQuery(videoLibraryQuery());
  const { data: chrome } = useSuspenseQuery(siteChromeQuery());
  const brand = chrome.settings.brand ?? {};
  const livestream = chrome.settings.livestream ?? {};

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("");

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return data.videos.filter((v: any) => {
      if (cat && v.category_id !== cat) return false;
      if (!s) return true;
      return (
        v.title?.toLowerCase().includes(s) ||
        v.description?.toLowerCase().includes(s) ||
        v.speaker?.toLowerCase().includes(s) ||
        (v.tags ?? []).some((t: string) => t.toLowerCase().includes(s))
      );
    });
  }, [data.videos, search, cat]);

  const featured = data.videos.find((v: any) => v.is_featured) ?? null;
  const cta = data.cta;

  return (
    <div className="bg-light min-h-screen">
      <SiteHeader nav={chrome.nav} brandName={brand.name ?? "CCM"} livestream={livestream} logoUrl={brand.logo_url} />
      <main>
        <section className="bg-navy-deep text-white py-20 lg:py-28">
          <div className="mx-auto max-w-5xl px-5 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-5">Video Library</h1>
            <p className="text-base sm:text-lg text-white/75 max-w-3xl mx-auto leading-relaxed">
              Watch transformational teachings, leadership training, ministry broadcasts, outreach programs,
              and faith-building content from Church Consolidation Mission.
            </p>
          </div>
        </section>

        {cta && (
          <section
            className="py-5"
            style={{ backgroundColor: cta.background_color ?? "#B88A1B", color: cta.text_color ?? "#FFFFFF" }}
          >
            <div className="mx-auto max-w-7xl px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                {cta.title && <div className="font-display text-lg sm:text-xl">{cta.title}</div>}
                {cta.description && <div className="text-sm opacity-90">{cta.description}</div>}
              </div>
              {cta.button_text && cta.button_url && (
                <a
                  href={cta.button_url}
                  target={cta.open_new_tab ? "_blank" : undefined}
                  rel={cta.open_new_tab ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 bg-white text-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-light"
                >
                  {cta.button_text} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </section>
        )}

        <section className="bg-white border-b border-black/5 py-6">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos by title, speaker, or tag…"
                className="w-full pl-10 pr-4 py-3 rounded-md border border-black/10 text-sm bg-light focus:outline-none focus:border-gold"
              />
            </div>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-4 py-3 rounded-md border border-black/10 text-sm bg-light"
            >
              <option value="">All Categories</option>
              {data.categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </section>

        {featured && !search && !cat && (
          <section className="py-12 lg:py-16 bg-light">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
              <div className="text-[10px] uppercase tracking-[0.22em] text-gold font-bold mb-3">Featured</div>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <Link to="/videos/$slug" params={{ slug: featured.slug }} className="block aspect-video bg-navy-deep overflow-hidden group relative">
                  {featured.thumbnail_url && <img src={featured.thumbnail_url} alt={featured.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-gold/95 flex items-center justify-center">
                      <Play className="h-7 w-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                </Link>
                <div>
                  <h2 className="font-display text-3xl text-navy-deep mb-4">{featured.title}</h2>
                  {featured.description && <p className="text-charcoal/75 mb-5 leading-relaxed">{featured.description}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-charcoal/60 mb-6">
                    {featured.speaker && <span className="flex items-center gap-1"><User className="h-4 w-4" /> {featured.speaker}</span>}
                    {featured.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {featured.duration}</span>}
                  </div>
                  <Link to="/videos/$slug" params={{ slug: featured.slug }} className="inline-flex items-center gap-2 bg-navy-deep text-white px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gold transition-colors">
                    <Play className="h-3.5 w-3.5 fill-white" /> Watch Now
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <h2 className="font-display text-2xl text-navy-deep mb-8">All Videos</h2>
            {filtered.length === 0 ? (
              <p className="text-center text-charcoal/60 py-12">No videos match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((v: any) => <VideoCard key={v.id} v={v} cats={data.categories} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter
        brand={brand}
        contact={chrome.settings.contact ?? {}}
        footer={chrome.settings.footer ?? {}}
        social={chrome.settings.social ?? {}}
        logoUrl={brand.logo_url}
      />
    </div>
  );
}

function VideoCard({ v, cats }: { v: any; cats: any[] }) {
  const catName = cats.find((c) => c.id === v.category_id)?.name;
  return (
    <Link
      to="/videos/$slug"
      params={{ slug: v.slug }}
      className="group bg-white overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className="aspect-video bg-navy-deep relative overflow-hidden">
        {v.thumbnail_url && <img src={v.thumbnail_url} alt={v.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center">
            <Play className="h-5 w-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        {v.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">{v.duration}</span>
        )}
        {v.access_mode && v.access_mode !== "free" && (
          <span
            className="absolute top-2 left-2 bg-gold text-navy-deep px-2 py-1 rounded inline-flex items-center gap-1"
            title={
              v.access_mode === "password" ? "Password protected"
                : v.access_mode === "paid" ? `Premium${v.price_espees ? ` · ${v.price_espees} ESPEES` : ""}`
                : `Password + Premium${v.price_espees ? ` · ${v.price_espees} ESPEES` : ""}`
            }
            aria-label={v.access_mode}
          >
            {(v.access_mode === "password" || v.access_mode === "password_paid") && (
              <Lock className="h-3 w-3" />
            )}
            {(v.access_mode === "paid" || v.access_mode === "password_paid") && (
              <img src={espeesCoin.url} alt="ESPEES" className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
      <div className="p-4">
        {catName && <div className="text-[10px] uppercase tracking-[0.18em] text-gold font-bold mb-2">{catName}</div>}
        <h3 className="font-display text-base text-navy-deep mb-2 line-clamp-2">{v.title}</h3>
        {v.description && <p className="text-xs text-charcoal/65 line-clamp-2 mb-3">{v.description}</p>}
        <div className="flex items-center justify-between text-[11px] text-charcoal/55">
          {v.speaker && <span className="truncate">{v.speaker}</span>}
          {v.publish_date && <span>{new Date(v.publish_date).toLocaleDateString()}</span>}
        </div>
      </div>
    </Link>
  );
}