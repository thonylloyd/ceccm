import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { v as videoLibraryQuery, s as siteChromeQuery } from "./router-EhlbKFja.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-Cc5g1xnl.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { E as ExternalLink, S as Search, P as Play, U as User, C as Clock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-Cl-mkr1Z.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
function VideosPage() {
  const {
    data
  } = useSuspenseQuery(videoLibraryQuery());
  const {
    data: chrome
  } = useSuspenseQuery(siteChromeQuery());
  const brand = chrome.settings.brand ?? {};
  const livestream = chrome.settings.livestream ?? {};
  const [search, setSearch] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const s = search.toLowerCase();
    return data.videos.filter((v) => {
      if (cat && v.category_id !== cat) return false;
      if (!s) return true;
      return v.title?.toLowerCase().includes(s) || v.description?.toLowerCase().includes(s) || v.speaker?.toLowerCase().includes(s) || (v.tags ?? []).some((t) => t.toLowerCase().includes(s));
    });
  }, [data.videos, search, cat]);
  const featured = data.videos.find((v) => v.is_featured) ?? null;
  const cta = data.cta;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-light min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { nav: chrome.nav, brandName: brand.name ?? "CCM", livestream, logoUrl: brand.logo_url }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-navy-deep text-white py-20 lg:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-5 lg:px-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl sm:text-5xl lg:text-6xl mb-5", children: "Video Library" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg text-white/75 max-w-3xl mx-auto leading-relaxed", children: "Watch transformational teachings, leadership training, ministry broadcasts, outreach programs, and faith-building content from Church Consolidation Mission." })
      ] }) }),
      cta && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-5", style: {
        backgroundColor: cta.background_color ?? "#B88A1B",
        color: cta.text_color ?? "#FFFFFF"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center sm:text-left", children: [
          cta.title && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg sm:text-xl", children: cta.title }),
          cta.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-90", children: cta.description })
        ] }),
        cta.button_text && cta.button_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: cta.button_url, target: cta.open_new_tab ? "_blank" : void 0, rel: cta.open_new_tab ? "noreferrer" : void 0, className: "inline-flex items-center gap-2 bg-white text-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-light", children: [
          cta.button_text,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-white border-b border-black/5 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 flex flex-col md:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search videos by title, speaker, or tag…", className: "w-full pl-10 pr-4 py-3 rounded-md border border-black/10 text-sm bg-light focus:outline-none focus:border-gold" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: cat, onChange: (e) => setCat(e.target.value), className: "px-4 py-3 rounded-md border border-black/10 text-sm bg-light", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Categories" }),
          data.categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
        ] })
      ] }) }),
      featured && !search && !cat && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 lg:py-16 bg-light", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.22em] text-gold font-bold mb-3", children: "Featured" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/videos/$slug", params: {
            slug: featured.slug
          }, className: "block aspect-video bg-navy-deep overflow-hidden group relative", children: [
            featured.thumbnail_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: featured.thumbnail_url, alt: featured.title, className: "h-full w-full object-cover group-hover:scale-105 transition-transform" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-gold/95 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-7 w-7 text-white fill-white ml-1" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-navy-deep mb-4", children: featured.title }),
            featured.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-charcoal/75 mb-5 leading-relaxed", children: featured.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-charcoal/60 mb-6", children: [
              featured.speaker && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
                " ",
                featured.speaker
              ] }),
              featured.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
                " ",
                featured.duration
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/videos/$slug", params: {
              slug: featured.slug
            }, className: "inline-flex items-center gap-2 bg-navy-deep text-white px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gold transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5 fill-white" }),
              " Watch Now"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 lg:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-navy-deep mb-8", children: "All Videos" }),
        filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-charcoal/60 py-12", children: "No videos match your search." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: filtered.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCard, { v, cats: data.categories }, v.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { brand, contact: chrome.settings.contact ?? {}, footer: chrome.settings.footer ?? {}, social: chrome.settings.social ?? {}, logoUrl: brand.logo_url })
  ] });
}
function VideoCard({
  v,
  cats
}) {
  const catName = cats.find((c) => c.id === v.category_id)?.name;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/videos/$slug", params: {
    slug: v.slug
  }, className: "group bg-white overflow-hidden shadow-card hover:shadow-xl hover:-translate-y-1 transition-all", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-navy-deep relative overflow-hidden", children: [
      v.thumbnail_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.thumbnail_url, alt: v.title, className: "h-full w-full object-cover group-hover:scale-105 transition-transform", loading: "lazy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-5 w-5 text-white fill-white ml-0.5" }) }) }),
      v.duration && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded", children: v.duration })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      catName && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-gold font-bold mb-2", children: catName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base text-navy-deep mb-2 line-clamp-2", children: v.title }),
      v.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-charcoal/65 line-clamp-2 mb-3", children: v.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-charcoal/55", children: [
        v.speaker && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: v.speaker }),
        v.publish_date && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(v.publish_date).toLocaleDateString() })
      ] })
    ] })
  ] });
}
export {
  VideosPage as component
};
