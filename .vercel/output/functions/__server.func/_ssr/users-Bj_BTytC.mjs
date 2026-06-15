import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, s as setUserRole, l as listUsersWithRoles } from "./admin.functions-B8Ws9k6i.mjs";
import { P as PageHeader, C as Card, B as Button } from "./ui-DcRKsItl.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function UsersAdmin() {
  const qc = useQueryClient();
  const listFn = useServerFn(listUsersWithRoles);
  const roleFn = useServerFn(setUserRole);
  const q = useQuery({
    queryKey: ["a", "users"],
    queryFn: () => listFn()
  });
  const setRole = useMutation({
    mutationFn: (v) => roleFn({
      data: v
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["a", "users"]
      });
      toast.success("Updated");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Users", description: "Manage user accounts and roles." }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "!p-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-light text-xs uppercase tracking-wider text-charcoal/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3", children: "Roles" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        q.data?.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-black/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-navy-deep", children: u.display_name || u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-charcoal/50", children: u.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: u.roles.length ? u.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider px-2 py-1 bg-gold/15 text-gold rounded", children: r }, r)) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-charcoal/50", children: "No roles" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex gap-1", children: ["admin", "editor", "viewer"].map((role) => {
            const has = u.roles.includes(role);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: has ? "primary" : "outline", onClick: () => setRole.mutate({
              user_id: u.id,
              role,
              grant: !has
            }), children: has ? `–${role}` : `+${role}` }, role);
          }) }) })
        ] }, u.id)),
        !q.data?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, className: "text-center text-sm text-charcoal/50 py-8", children: "No users yet." }) })
      ] })
    ] }) })
  ] });
}
export {
  UsersAdmin as component
};
