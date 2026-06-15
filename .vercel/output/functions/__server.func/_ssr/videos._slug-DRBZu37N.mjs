import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Route$b, a as videoQuery, s as siteChromeQuery } from "./router-EhlbKFja.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { S as SiteHeader, a as SiteFooter } from "./SiteFooter-Cc5g1xnl.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { U as User, C as Clock, j as Share2 } from "../_libs/lucide-react.mjs";
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
function getEmbed(v) {
  if (v.youtube_url) {
    const m = v.youtube_url.match(/(?:youtu\.be\/|v=)([^&?#]+)/);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  if (v.vimeo_url) {
    const m = v.vimeo_url.match(/vimeo\.com\/(\d+)/);
    if (m) return `https://player.vimeo.com/video/${m[1]}`;
  }
  return null;
}
function VideoDetail() {
  const {
    slug
  } = Route$b.useParams();
  const {
    data
  } = useSuspenseQuery(videoQuery(slug));
  const {
    data: chrome
  } = useSuspenseQuery(siteChromeQuery());
  const v = data.video;
  const brand = chrome.settings.brand ?? {};
  const embed = getEmbed(v);
  const share = () => {
    if (navigator.share) navigator.share({
      title: v.title,
      url: location.href
    }).catch(() => {
    });
    else {
      navigator.clipboard.writeText(location.href);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-light min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, { nav: chrome.nav, brandName: brand.name ?? "CCM", livestream: chrome.settings.livestream ?? {}, logoUrl: brand.logo_url }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "py-10 lg:py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1fr_320px] gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-black overflow-hidden mb-6", children: embed ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: embed, className: "h-full w-full", allow: "autoplay; encrypted-media; picture-in-picture", allowFullScreen: true }) : v.video_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("video", { src: v.video_url, poster: v.thumbnail_url ?? void 0, controls: true, className: "h-full w-full" }) : v.thumbnail_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: v.thumbnail_url, alt: v.title, className: "h-full w-full object-cover" }) : null }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-navy-deep mb-3", children: v.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-charcoal/60 mb-5", children: [
          v.speaker && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
            v.speaker
          ] }),
          v.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
            v.duration
          ] }),
          v.publish_date && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(v.publish_date).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: share, className: "flex items-center gap-1 hover:text-navy-deep", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
            "Share"
          ] })
        ] }),
        v.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-charcoal/80 leading-relaxed whitespace-pre-line mb-6", children: v.description }),
        (v.tags ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: (v.tags ?? []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider bg-white border border-black/10 px-3 py-1 rounded-full", children: t }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg text-navy-deep mb-4", children: "Continue Learning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          data.related.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/videos/$slug", params: {
            slug: r.slug
          }, className: "flex gap-3 bg-white p-2 hover:shadow-card transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-32 shrink-0 bg-navy-deep overflow-hidden", children: r.thumbnail_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.thumbnail_url, alt: "", className: "h-full w-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-navy-deep line-clamp-2", children: r.title }),
              r.duration && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-charcoal/55 mt-1", children: r.duration })
            ] })
          ] }, r.id)),
          !data.related.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-charcoal/55", children: "No related videos." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, { brand, contact: chrome.settings.contact ?? {}, footer: chrome.settings.footer ?? {}, social: chrome.settings.social ?? {}, logoUrl: brand.logo_url })
  ] });
}
export {
  VideoDetail as component
};
