import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { h as homepageQuery } from "./router-EhlbKFja.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-Cc5g1xnl.mjs";
import { h as heroFallback } from "./hero-cathedral-DiDlx29y.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowRight, a as Calendar, b as ChevronRight, D as Download, R as Radio, c as Sparkles, d as Cross, e as Church, H as HandHeart, f as Users, B as BookOpen, g as Heart, G as GraduationCap, h as Compass, i as Globe, M as MapPin } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./server-Cl-mkr1Z.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./client-CW46O5zz.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "./logo-ccm.png.asset-CPcQKdrq.mjs";
function Hero({ banners }) {
  const [idx, setIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 7e3);
    return () => clearInterval(t);
  }, [banners.length]);
  if (!banners.length) return null;
  const b = banners[idx];
  const bg = b.background_image_url || heroFallback;
  const overlay = b.overlay_opacity ?? 0.55;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-light pt-6 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-5 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-md min-h-[480px] lg:min-h-[560px] flex items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: bg, alt: "", className: "absolute inset-0 h-full w-full object-cover" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0",
        style: {
          background: `linear-gradient(110deg, rgba(4,30,74,${Math.min(overlay + 0.25, 0.95)}) 0%, rgba(4,30,74,${overlay * 0.4}) 75%, rgba(4,30,74,${overlay * 0.2}) 100%)`
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full px-8 sm:px-14 lg:px-20 py-16", children: [
      b.eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/85 text-sm mb-3", children: b.eyebrow }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-white font-bold leading-[0.95] tracking-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl uppercase max-w-2xl", children: b.heading }),
      b.subheading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-white/90 text-base sm:text-lg max-w-xl", children: b.subheading }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
        b.primary_cta_label && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: b.primary_cta_url ?? "#",
            className: "inline-flex items-center rounded-sm bg-gold px-8 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white hover:bg-gold-soft transition-colors",
            children: b.primary_cta_label
          }
        ),
        b.secondary_cta_label && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: b.secondary_cta_url ?? "#",
            className: "inline-flex items-center rounded-sm border border-white px-8 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white hover:bg-white hover:text-navy-deep transition-colors",
            children: b.secondary_cta_label
          }
        )
      ] })
    ] }),
    banners.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2", children: banners.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setIdx(i),
        className: `h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-1.5 bg-white/50"}`,
        "aria-label": `Slide ${i + 1}`
      },
      i
    )) })
  ] }) }) });
}
const map = {
  globe: Globe,
  compass: Compass,
  "graduation-cap": GraduationCap,
  heart: Heart,
  book: BookOpen,
  users: Users,
  hand: HandHeart,
  church: Church,
  cross: Cross,
  sparkles: Sparkles,
  radio: Radio,
  calendar: Calendar,
  download: Download
};
function Icon({ name, className }) {
  const Cmp = name && map[name] || Sparkles;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Cmp, { className });
}
function MissionSection({ cards, title = "Our Mission" }) {
  if (!cards.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-light py-20 lg:py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl sm:text-3xl text-navy-deep uppercase tracking-[0.18em] font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-3 h-0.5 w-12 bg-gold" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "article",
      {
        className: "bg-white border border-gold/60 px-8 py-10 text-center hover:shadow-card transition-shadow",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-11 w-11 rounded-full bg-gold/15 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: c.icon, className: "h-5 w-5 text-gold" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-navy-deep mb-3", children: c.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-charcoal/70 leading-relaxed", children: c.description })
        ]
      },
      c.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/about",
        className: "inline-flex items-center gap-2 px-7 py-3 bg-navy-deep text-white text-xs font-semibold uppercase tracking-[0.18em] hover:bg-gold transition-colors",
        children: [
          "Learn More ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
        ]
      }
    ) })
  ] }) });
}
function StatsSection({ stats }) {
  if (!stats.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-navy-deep py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-5 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-10", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-gold text-5xl sm:text-6xl font-medium leading-none", children: s.value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-[11px] uppercase tracking-[0.22em] text-white/75", children: s.label })
  ] }, s.id)) }) }) });
}
const programFallback = "/assets/program-summit-wSsfrSi1.jpg";
function ProgramCard({ p }) {
  const date = p.event_date ? new Date(p.event_date) : null;
  const day = date ? date.getDate().toString().padStart(2, "0") : "";
  const mo = date ? `${date.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${date.getFullYear()}` : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "bg-white shadow-card overflow-hidden flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/10] bg-navy-deep overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: p.image_url || programFallback,
        alt: p.title,
        className: "h-full w-full object-cover",
        loading: "lazy"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[110px_1fr] flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-navy-deep text-white flex flex-col items-center justify-center px-3 py-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl leading-none", children: day || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] tracking-[0.18em] mt-1 text-white/80", children: mo })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col", children: [
        p.event_type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block self-start bg-silver/60 text-charcoal text-[10px] uppercase tracking-[0.18em] px-2 py-1 mb-2", children: p.event_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg text-navy-deep mb-2 line-clamp-2", children: p.title }),
        p.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-charcoal/70 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-gold shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: p.location })
        ] }),
        p.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-charcoal/70 leading-relaxed mb-3 line-clamp-2", children: p.description }),
        p.cta_label && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: p.registration_url ?? "#",
            className: "mt-auto inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-gold hover:text-navy-deep",
            children: [
              p.cta_label,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
function ProgramsSection({ programs, intro }) {
  const scrollerRef = reactExports.useRef(null);
  const [paused, setPaused] = reactExports.useState(false);
  const loop = programs.length > 2 ? [...programs, ...programs] : programs;
  reactExports.useEffect(() => {
    if (!programs.length) return;
    const el = scrollerRef.current;
    if (!el) return;
    let raf;
    const tick = () => {
      if (!paused && el) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, programs.length]);
  if (!programs.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-light py-20 lg:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl sm:text-4xl text-navy-deep flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-7 w-7 text-gold" }),
            " Upcoming Programs"
          ] }),
          intro && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-charcoal/70 mt-1", children: intro })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/programs", className: "text-sm font-semibold text-navy-deep hover:text-gold inline-flex items-center gap-1", children: [
          "View All Programs ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: scrollerRef,
          onMouseEnter: () => setPaused(true),
          onMouseLeave: () => setPaused(false),
          className: "flex gap-6 overflow-x-auto scroll-smooth no-scrollbar",
          style: { scrollbarWidth: "none" },
          children: loop.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "shrink-0 w-[calc(100%-1rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProgramCard, { p })
            },
            `${p.id}-${i}`
          ))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.no-scrollbar::-webkit-scrollbar{display:none}` })
  ] });
}
const salvation = "/assets/resource-salvation-CCLsebGR.jpg";
const pastorLive = "/assets/resource-pastor-live-DmK7VT5O.jpg";
const library = "/assets/resource-library-Ct8dFds-.jpg";
const app = "/assets/resource-app-BP999T7E.jpg";
const FALLBACKS = [salvation, pastorLive, library, app];
function ResourcesSection({ cards }) {
  if (!cards.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-silver/40 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-5 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: cards.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden bg-white/60 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: c.image_url || FALLBACKS[i % FALLBACKS.length],
        alt: c.title,
        className: "h-full w-full object-cover"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-navy-deep mb-1", children: c.title }),
    c.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-charcoal/70 leading-snug mb-1 line-clamp-2 px-2", children: c.description }),
    c.cta_label && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.cta_url ?? "#", className: "text-[11px] font-semibold text-navy-deep underline hover:text-gold", children: c.cta_label })
  ] }, c.id)) }) }) });
}
function HomePage() {
  const {
    data
  } = useSuspenseQuery(homepageQuery());
  const brand = data.settings.brand ?? {};
  const contact = data.settings.contact ?? {};
  const footer = data.settings.footer ?? {};
  const social = data.settings.social ?? {};
  const livestream = data.settings.livestream ?? {};
  const homepage = data.settings.homepage ?? {};
  const nav = data.nav.filter((n) => !n.parent_id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-light min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { nav, brandName: brand.name ?? "Church Consolidation Mission", livestream, logoUrl: brand.logo_url }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, { banners: data.heroes }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MissionSection, { cards: data.mission, title: homepage.mission_title ?? "Our Mission" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatsSection, { stats: data.stats }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProgramsSection, { programs: data.programs, intro: homepage.programs_intro ?? "Join our global initiatives and transform lives." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResourcesSection, { cards: data.resources })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { brand, contact, footer, social, logoUrl: brand.logo_url })
  ] });
}
export {
  HomePage as component
};
