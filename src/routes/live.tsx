import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { livestreamQuery, subscribeToBroadcasts } from "@/lib/livestream.functions";
import { homepageQuery } from "@/lib/cms.functions";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play, Radio, Calendar, Clock, Share2, Bell, MapPin, Search, Users, Globe2,
  AlertTriangle, ChevronRight, Tv, Mic, Heart, Sparkles, X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/live")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(livestreamQuery()),
      context.queryClient.ensureQueryData(homepageQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Watch Live — Church Consolidation Mission" },
      { name: "description", content: "Watch live ministry broadcasts, conferences, prayer sessions, leadership trainings, and special events from anywhere in the world." },
      { property: "og:title", content: "Watch Live — Church Consolidation Mission" },
      { property: "og:description", content: "Join our global live broadcasts, prayer meetings, and ministry events." },
      { property: "og:type", content: "video.other" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-light p-6 text-center">
      <div><h1 className="font-display text-2xl text-navy-deep">Unable to load livestream</h1><p className="text-sm text-charcoal/70 mt-2">{error.message}</p></div>
    </div>
  ),
  notFoundComponent: () => <div>Not found</div>,
  component: LivePage,
});

function buildEmbedUrl(type?: string | null, url?: string | null): string | null {
  if (!url) return null;
  const t = (type || "").toLowerCase();
  if (t === "youtube") {
    const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
  }
  if (t === "vimeo") {
    const id = url.match(/vimeo\.com\/(?:event\/)?(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : url;
  }
  if (t === "facebook") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
  }
  return url;
}

function LivePage() {
  const { data } = useSuspenseQuery(livestreamQuery());
  const { data: chrome } = useSuspenseQuery(homepageQuery());
  const brand = chrome.settings.brand ?? {};
  const livestreamSettings = chrome.settings.livestream ?? {};
  const nav = chrome.nav.filter((n: any) => !n.parent_id);

  const hero = data.settings.livestream_hero ?? {};
  const alert = data.settings.livestream_alert ?? {};
  const current = data.current;
  const upcomingSorted = useMemo(
    () => [...data.upcoming].sort((a, b) =>
      new Date(a.scheduled_start ?? 0).getTime() - new Date(b.scheduled_start ?? 0).getTime()),
    [data.upcoming],
  );
  const nextUpcoming = upcomingSorted[0];
  const embedUrl = current ? buildEmbedUrl(current.stream_type, current.stream_url) : null;

  return (
    <div className="bg-light min-h-screen">
      <SiteHeader nav={nav} brandName={brand.name ?? "CCM"} livestream={livestreamSettings} logoUrl={brand.logo_url} />
      <main>
        <LiveHero hero={hero} />
        <AlertBar alert={alert} />
        <PlayerSection current={current} embedUrl={embedUrl} nextUpcoming={nextUpcoming} />
        {data.featured.length > 0 && <FeaturedSection items={data.featured} />}
        {upcomingSorted.length > 0 && <UpcomingSection items={upcomingSorted} />}
        <ReplaysSection items={data.replays} />
        {data.channels.length > 0 && <ChannelsSection items={data.channels} />}
        {data.stats.length > 0 && <ImpactSection stats={data.stats} />}
        <NotifySection />
      </main>
      <SiteFooter
        brand={brand}
        social={chrome.settings.social ?? {}}
        footer={chrome.settings.footer ?? {}}
        contact={chrome.settings.contact ?? {}}
      />

    </div>
  );
}

function LiveHero({ hero }: { hero: any }) {
  const bg = hero.background_url || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=2000&q=80";
  return (
    <section className="relative h-[60vh] min-h-[480px] overflow-hidden">
      <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/90 via-navy-deep/75 to-black/70" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white animate-fade-in">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold mb-5">
            <Radio className="h-3.5 w-3.5" /> {hero.eyebrow || "Watch Live"}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
            {hero.heading || "Join Our Live Broadcast"}
          </h1>
          <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
            {hero.subheading ||
              "Watch ministry programs, conferences, prayer sessions, leadership trainings, and special broadcasts from anywhere in the world."}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#player" className="inline-flex items-center gap-2 bg-gold text-navy-deep px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gold/90 transition-colors">
              <Play className="h-4 w-4" /> {hero.primary_label || "Watch Live"}
            </a>
            <a href="#upcoming" className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-white/10 transition-colors">
              {hero.secondary_label || "View Schedule"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AlertBar({ alert }: { alert: any }) {
  const [hidden, setHidden] = useState(false);
  if (!alert?.visible || hidden) return null;
  const now = Date.now();
  if (alert.start_date && new Date(alert.start_date).getTime() > now) return null;
  if (alert.end_date && new Date(alert.end_date).getTime() < now) return null;
  return (
    <div
      className="relative"
      style={{ background: alert.background_color || "hsl(45 70% 52%)", color: alert.text_color || "#0a1733" }}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-3 flex items-center gap-3 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold">{alert.title}</span>
          {alert.description && <span className="opacity-80 ml-2">{alert.description}</span>}
        </div>
        {alert.button_url && (
          <a href={alert.button_url} className="text-xs font-bold uppercase tracking-[0.18em] underline shrink-0">
            {alert.button_text || "Learn More"}
          </a>
        )}
        <button onClick={() => setHidden(true)} className="opacity-70 hover:opacity-100 shrink-0" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PlayerSection({ current, embedUrl, nextUpcoming }: { current: any; embedUrl: string | null; nextUpcoming: any }) {
  return (
    <section id="player" className="bg-navy-deep py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <div className="aspect-video bg-black overflow-hidden ring-1 ring-white/10">
            {current && embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                title={current.title}
              />
            ) : nextUpcoming ? (
              <Countdown event={nextUpcoming} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60 flex-col gap-3">
                <Tv className="h-12 w-12 text-gold" />
                <p className="text-sm">No live broadcast right now. Check back soon.</p>
              </div>
            )}
          </div>
          {current?.chat_enabled && current.chat_url && (
            <div className="mt-6 aspect-[16/8] bg-black ring-1 ring-white/10 overflow-hidden">
              <iframe src={current.chat_url} className="w-full h-full" title="Live chat" />
            </div>
          )}
        </div>
        <BroadcastInfo current={current} nextUpcoming={nextUpcoming} />
      </div>
    </section>
  );
}

function BroadcastInfo({ current, nextUpcoming }: { current: any; nextUpcoming: any }) {
  const item = current ?? nextUpcoming;
  if (!item) {
    return (
      <aside className="bg-white/5 ring-1 ring-white/10 p-6 text-white">
        <h3 className="font-display text-lg">Broadcast Information</h3>
        <p className="text-sm text-white/60 mt-2">No upcoming broadcasts scheduled.</p>
      </aside>
    );
  }
  return (
    <aside className="bg-white/5 ring-1 ring-white/10 p-6 text-white space-y-4">
      <div className="flex items-center gap-2">
        {current ? (
          <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Live Now
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-1">
            Offline
          </span>
        )}
        {item.category && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-gold">{item.category}</span>
        )}
      </div>
      <h3 className="font-display text-2xl leading-snug">{item.title}</h3>
      {item.description && <p className="text-sm text-white/70 leading-relaxed line-clamp-4">{item.description}</p>}
      <dl className="text-sm space-y-2 border-t border-white/10 pt-4">
        {item.speaker && <Row icon={<Mic className="h-4 w-4" />} label="Speaker" value={item.speaker} />}
        {item.scheduled_start && <Row icon={<Calendar className="h-4 w-4" />} label="Date" value={new Date(item.scheduled_start).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })} />}
        {item.scheduled_start && <Row icon={<Clock className="h-4 w-4" />} label="Time" value={new Date(item.scheduled_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />}
        {current && current.viewer_count > 0 && <Row icon={<Users className="h-4 w-4" />} label="Watching" value={current.viewer_count.toLocaleString()} />}
      </dl>
      <div className="flex gap-2 pt-2">
        <button onClick={() => navigator.share?.({ title: item.title, url: window.location.href }).catch(() => {})} className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        {!current && (
          <a href={item.reminder_url || "#notify"} className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-navy-deep hover:bg-gold/90 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">
            <Bell className="h-3.5 w-3.5" /> Remind Me
          </a>
        )}
      </div>
    </aside>
  );
}

function Row({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gold">{icon}</span>
      <span className="text-white/50 text-xs uppercase tracking-[0.16em] w-20">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function Countdown({ event }: { event: any }) {
  const target = event.scheduled_start ? new Date(event.scheduled_start).getTime() : 0;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy-deep via-navy to-black text-white text-center p-8 gap-6">
      <span className="text-[11px] uppercase tracking-[0.3em] text-gold">Next Broadcast</span>
      <h3 className="font-display text-2xl md:text-3xl max-w-xl">{event.title}</h3>
      <div className="flex gap-4 sm:gap-8">
        {[["Days", d], ["Hours", h], ["Min", m], ["Sec", s]].map(([l, v]) => (
          <div key={l as string} className="text-center">
            <div className="font-display text-3xl sm:text-5xl text-gold tabular-nums">{String(v).padStart(2, "0")}</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/60 mt-1">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingSection({ items }: { items: any[] }) {
  return (
    <section id="upcoming" className="py-20 bg-light">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <h2 className="font-display text-3xl text-navy-deep mb-2 flex items-center gap-3">
          <Calendar className="h-7 w-7 text-gold" /> Upcoming Broadcasts
        </h2>
        <p className="text-sm text-charcoal/60 mb-10">Don't miss what's coming next.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((b) => <UpcomingCard key={b.id} b={b} />)}
        </div>
      </div>
    </section>
  );
}

function UpcomingCard({ b }: { b: any }) {
  const d = b.scheduled_start ? new Date(b.scheduled_start) : null;
  return (
    <article className="bg-white shadow-card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-navy-deep overflow-hidden">
        {b.thumbnail_url && <img src={b.thumbnail_url} alt={b.title} className="w-full h-full object-cover" />}
      </div>
      <div className="p-5">
        {b.category && <span className="text-[10px] uppercase tracking-[0.18em] text-gold">{b.category}</span>}
        <h3 className="font-display text-lg text-navy-deep mt-2 mb-3 line-clamp-2">{b.title}</h3>
        {d && (
          <div className="flex items-center gap-4 text-xs text-charcoal/70 mb-4">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-gold" />{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3 text-gold" />{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        )}
        <div className="flex gap-2">
          {b.registration_url && <a href={b.registration_url} className="flex-1 inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.18em] bg-navy-deep text-white px-3 py-2 hover:bg-navy">Register</a>}
          <a href={b.reminder_url || "#notify"} className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] border border-navy-deep text-navy-deep px-3 py-2 hover:bg-navy-deep hover:text-white"><Bell className="h-3 w-3" /> Remind</a>
        </div>
      </div>
    </article>
  );
}

function FeaturedSection({ items }: { items: any[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <h2 className="font-display text-3xl text-navy-deep mb-2 flex items-center gap-3"><Sparkles className="h-7 w-7 text-gold" /> Featured Broadcasts</h2>
        <p className="text-sm text-charcoal/60 mb-10">Hand-picked moments from our ministry.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((b) => (
            <article key={b.id} className="group relative aspect-video overflow-hidden bg-navy-deep">
              {b.thumbnail_url && <img src={b.thumbnail_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                {b.category && <span className="text-[10px] uppercase tracking-[0.18em] text-gold">{b.category}</span>}
                <h3 className="font-display text-lg mt-1 mb-3 line-clamp-2">{b.title}</h3>
                <a href={b.stream_url || "#"} className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                  <Play className="h-3 w-3" /> Watch Replay
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReplaysSection({ items }: { items: any[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const cats = useMemo(() => Array.from(new Set(items.map((i) => i.category).filter(Boolean))), [items]);
  const filtered = items.filter((i) =>
    (!cat || i.category === cat) &&
    (!q || `${i.title} ${i.speaker ?? ""} ${i.category ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <section className="py-20 bg-light">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="font-display text-3xl text-navy-deep flex items-center gap-3"><Play className="h-7 w-7 text-gold" /> Watch Replays</h2>
            <p className="text-sm text-charcoal/60 mt-1">Past broadcasts on demand.</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 text-sm bg-white border border-black/10 w-56 focus:outline-none focus:ring-1 focus:ring-gold" />
            </div>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 text-sm bg-white border border-black/10">
              <option value="">All categories</option>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center text-sm text-charcoal/50 py-16 bg-white">No replays match your search.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((b) => (
              <article key={b.id} className="bg-white shadow-card overflow-hidden group">
                <a href={b.stream_url ?? "#"} className="block">
                  <div className="aspect-video bg-navy-deep relative overflow-hidden">
                    {b.thumbnail_url && <img src={b.thumbnail_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    {b.category && <span className="text-[10px] uppercase tracking-[0.18em] text-gold">{b.category}</span>}
                    <h3 className="font-display text-base text-navy-deep mt-1 line-clamp-2">{b.title}</h3>
                    {b.speaker && <p className="text-xs text-charcoal/60 mt-1">{b.speaker}</p>}
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ChannelsSection({ items }: { items: any[] }) {
  return (
    <section className="py-20 bg-navy-deep text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <h2 className="font-display text-3xl mb-2 flex items-center gap-3"><Tv className="h-7 w-7 text-gold" /> Ministry Channels</h2>
        <p className="text-sm text-white/60 mb-10">Explore all our broadcast channels.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => (
            <article key={c.id} className="bg-white/5 ring-1 ring-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                {c.logo_url ? <img src={c.logo_url} alt={c.name} className="h-14 w-14 object-contain" /> : <Radio className="h-14 w-14 text-gold" />}
                <h3 className="font-display text-xl">{c.name}</h3>
              </div>
              {c.description && <p className="text-sm text-white/70 leading-relaxed mb-5 line-clamp-3">{c.description}</p>}
              {c.watch_url && (
                <a href={c.watch_url} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  Watch Channel <ChevronRight className="h-3 w-3" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactSection({ stats }: { stats: any[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <h2 className="font-display text-3xl text-navy-deep text-center mb-2 flex items-center gap-3 justify-center"><Globe2 className="h-7 w-7 text-gold" /> Global Impact</h2>
        <p className="text-sm text-charcoal/60 text-center mb-12">Live reach of our ministry broadcasts.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.id} className="text-center p-6 bg-light border-t-2 border-gold">
              <div className="font-display text-4xl text-navy-deep tabular-nums">
                {Number(s.value).toLocaleString()}{s.suffix || ""}
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-charcoal/60 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotifySection() {
  const submit = useServerFn(subscribeToBroadcasts);
  const [form, setForm] = useState({ name: "", email: "", country: "", preferences: [] as string[] });
  const opts = ["Livestream Alerts", "Conferences", "Prayer Meetings", "Special Events"];
  const m = useMutation({
    mutationFn: (data: typeof form) => submit({ data }),
    onSuccess: () => { toast.success("You're subscribed!"); setForm({ name: "", email: "", country: "", preferences: [] }); },
    onError: (e: any) => toast.error(e.message ?? "Subscription failed"),
  });
  const togglePref = (p: string) =>
    setForm((f) => ({ ...f, preferences: f.preferences.includes(p) ? f.preferences.filter((x) => x !== p) : [...f.preferences, p] }));
  return (
    <section id="notify" className="py-20 bg-light">
      <div className="mx-auto max-w-3xl px-5 lg:px-8 text-center">
        <Heart className="h-10 w-10 text-gold mx-auto mb-4" />
        <h2 className="font-display text-3xl text-navy-deep mb-3">Never Miss A Broadcast</h2>
        <p className="text-sm text-charcoal/60 mb-10">Subscribe and we'll let you know when we go live.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (!form.email) return; m.mutate(form); }}
          className="bg-white p-8 shadow-card text-left space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name" className="px-3 py-2.5 text-sm border border-black/10 focus:outline-none focus:ring-1 focus:ring-gold" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address *" className="px-3 py-2.5 text-sm border border-black/10 focus:outline-none focus:ring-1 focus:ring-gold" />
          </div>
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="w-full px-3 py-2.5 text-sm border border-black/10 focus:outline-none focus:ring-1 focus:ring-gold" />
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-charcoal/70 mb-2">Notify me about</div>
            <div className="flex flex-wrap gap-2">
              {opts.map((o) => {
                const on = form.preferences.includes(o);
                return (
                  <button key={o} type="button" onClick={() => togglePref(o)} className={`text-xs px-3 py-1.5 border transition-colors ${on ? "bg-navy-deep text-white border-navy-deep" : "bg-white text-charcoal border-black/15 hover:border-navy-deep"}`}>
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
          <button type="submit" disabled={m.isPending} className="w-full bg-gold text-navy-deep font-bold uppercase tracking-[0.18em] text-xs py-3.5 hover:bg-gold/90 disabled:opacity-60">
            {m.isPending ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
