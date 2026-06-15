import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, a as adminList } from "./admin.functions-B8Ws9k6i.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { o as House, B as BookOpen, a as Calendar, k as Menu, p as Image, f as Users } from "../_libs/lucide-react.mjs";
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
import "./router-EhlbKFja.mjs";
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
import "./auth-middleware-DQksU7Dh.mjs";
function Card({
  to,
  icon: Icon,
  label,
  count
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "bg-white border border-black/5 rounded-lg p-5 hover:shadow-card transition-shadow flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-md bg-navy-deep/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-navy-deep" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.18em] text-charcoal/60", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-display text-navy-deep", children: count ?? "—" })
    ] })
  ] });
}
function Dashboard() {
  const list = useServerFn(adminList);
  const heroes = useQuery({
    queryKey: ["a", "hero_banners"],
    queryFn: () => list({
      data: {
        table: "hero_banners"
      }
    })
  });
  const mission = useQuery({
    queryKey: ["a", "mission_cards"],
    queryFn: () => list({
      data: {
        table: "mission_cards"
      }
    })
  });
  const stats = useQuery({
    queryKey: ["a", "statistics"],
    queryFn: () => list({
      data: {
        table: "statistics"
      }
    })
  });
  const programs = useQuery({
    queryKey: ["a", "programs"],
    queryFn: () => list({
      data: {
        table: "programs"
      }
    })
  });
  const resources = useQuery({
    queryKey: ["a", "resource_cards"],
    queryFn: () => list({
      data: {
        table: "resource_cards"
      }
    })
  });
  const nav = useQuery({
    queryKey: ["a", "navigation_items"],
    queryFn: () => list({
      data: {
        table: "navigation_items"
      }
    })
  });
  const media = useQuery({
    queryKey: ["a", "media_assets"],
    queryFn: () => list({
      data: {
        table: "media_assets"
      }
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-6xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-navy-deep mb-1", children: "Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-charcoal/60 mb-8", children: "Manage your ministry's website content." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/homepage", icon: House, label: "Hero Banners", count: heroes.data?.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/homepage", icon: BookOpen, label: "Mission Cards", count: mission.data?.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/homepage", icon: Calendar, label: "Statistics", count: stats.data?.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/programs", icon: Calendar, label: "Programs", count: programs.data?.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/homepage", icon: BookOpen, label: "Resource Cards", count: resources.data?.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/navigation", icon: Menu, label: "Navigation Items", count: nav.data?.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/media", icon: Image, label: "Media Assets", count: media.data?.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { to: "/admin/users", icon: Users, label: "Users", count: "—" })
    ] })
  ] });
}
export {
  Dashboard as component
};
