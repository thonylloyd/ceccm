import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, b as bootstrapAdminIfNone, g as getIsAdmin } from "./admin.functions-B8Ws9k6i.mjs";
import { s as supabase } from "./client-CW46O5zz.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, n as LayoutDashboard, o as House, I as Info, a as Calendar, m as Mail, k as Menu, p as Image, V as Video, f as Users, q as Settings, r as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-DQksU7Dh.mjs";
const NAV = [{
  to: "/admin",
  label: "Dashboard",
  icon: LayoutDashboard,
  end: true
}, {
  to: "/admin/homepage",
  label: "Homepage",
  icon: House
}, {
  to: "/admin/about",
  label: "About",
  icon: Info
}, {
  to: "/admin/programs",
  label: "Programs",
  icon: Calendar
}, {
  to: "/admin/contact",
  label: "Contact",
  icon: Mail
}, {
  to: "/admin/navigation",
  label: "Navigation",
  icon: Menu
}, {
  to: "/admin/media",
  label: "Media Library",
  icon: Image
}, {
  to: "/admin/videos",
  label: "Videos",
  icon: Video
}, {
  to: "/admin/users",
  label: "Users",
  icon: Users
}, {
  to: "/admin/settings",
  label: "Settings",
  icon: Settings
}];
function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({
    select: (s) => s.location.pathname
  });
  const isAdminFn = useServerFn(getIsAdmin);
  const bootstrapFn = useServerFn(bootstrapAdminIfNone);
  const q = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => isAdminFn()
  });
  const bootstrap = useMutation({
    mutationFn: () => bootstrapFn(),
    onSuccess: () => q.refetch()
  });
  reactExports.useEffect(() => {
    if (q.data && !q.data.isAdmin && !bootstrap.isPending && !bootstrap.isSuccess) {
      bootstrap.mutate();
    }
  }, [q.data]);
  if (q.isLoading || bootstrap.isPending) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-light", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-navy-deep" }) });
  }
  if (q.data && !q.data.isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-light p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl text-navy-deep mb-2", children: "Access restricted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-charcoal/70", children: "Your account does not have admin privileges." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-light", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 shrink-0 bg-navy-deep text-white/85 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl text-gold", children: "CCM Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.22em] text-white/50 mt-1", children: "Content Manager" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 px-3 py-4 space-y-0.5", children: NAV.map((item) => {
        const active = item.end ? path === item.to : path.startsWith(item.to);
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${active ? "bg-gold/15 text-gold" : "hover:bg-white/5 text-white/75"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          item.label
        ] }, item.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-4 border-t border-white/10 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4" }),
          " View Site"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
          await supabase.auth.signOut();
          navigate({
            to: "/auth"
          });
        }, className: "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-white/70 hover:bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Sign Out"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};
